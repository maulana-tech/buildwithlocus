import { NextRequest, NextResponse } from 'next/server';
import { locus } from '@/lib/locus';
import type { PageConfig, PageSection } from '@/agents/state';

const BUILD_BASE_URL = 'https://api.buildwithlocus.com';

async function getBuildToken(): Promise<string | null> {
  const apiKey = process.env.LOCUS_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(`${BUILD_BASE_URL}/v1/auth/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.token || data.access_token || null;
  } catch {
    return null;
  }
}

async function saveToStorage(username: string, page: PageConfig) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/sites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, page }),
    });
    return res.ok;
  } catch {
    return true;
  }
}

function extractCheckoutSections(sections: PageSection[]) {
  return sections.filter((s): s is Extract<PageSection, { type: 'checkout' }> => s.type === 'checkout');
}

async function createCheckoutSessions(sections: Extract<PageSection, { type: 'checkout' }>[]) {
  const sessions: Array<{ sectionId: string; id: string; url: string; amount: string }> = [];

  for (const section of sections) {
    try {
      const session = await locus.payment.createSession({
        amount: String(section.amount),
        currency: section.currency === 'IDR' ? 'USDC' : section.currency,
        description: section.title || 'Payment',
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/cancelled`,
        webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/locus`,
        metadata: { section_id: section.id, source: 'locus-studio' },
      });
      sessions.push({
        sectionId: section.id,
        id: session.id,
        url: session.checkoutUrl,
        amount: session.amount,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('[Publish] Session creation failed:', msg);
    }
  }

  return sessions;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const page = body as PageConfig;
    const repo = body.repo as string;

    if (!page.username) {
      return NextResponse.json({ error: 'username is required' }, { status: 400 });
    }

    const checkoutSections = extractCheckoutSections(page.sections);
    const sessions = await createCheckoutSessions(checkoutSections);

    const saved = await saveToStorage(page.username, page);

    let deployUrl: string | null = null;
    let deployedVia = 'local';
    let projectId: string | null = null;

    const token = await getBuildToken();
    if (token && repo) {
      try {
        const res = await fetch(`${BUILD_BASE_URL}/v1/projects/from-repo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: page.username, repo, branch: 'main' }),
        });
        if (res.ok) {
          const data = await res.json();
          deployUrl = data.project?.url || data.services?.[0]?.url || null;
          projectId = data.project?.id || null;
          deployedVia = 'buildwithlocus';
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn('[Publish] BuildWithLocus deploy failed:', msg);
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const localUrl = `${appUrl}/s/${page.username}`;

    return NextResponse.json({
      success: true,
      url: deployUrl || localUrl,
      deployedVia,
      projectId,
      storage: saved ? 'server' : 'local',
      sessions,
      page: {
        username: page.username,
        title: page.title,
        theme: page.theme,
        sections: page.sections.length,
        checkouts: checkoutSections.length,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Publish] Error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}