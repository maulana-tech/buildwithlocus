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
    if (!res.ok) {
      console.error('[Build] Auth exchange failed:', res.status, await res.text());
      return null;
    }
    const data = await res.json();
    return data.token || data.access_token || null;
  } catch (err) {
    console.error('[Build] Auth exchange error:', err);
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

async function createPaymentLinks(sections: Extract<PageSection, { type: 'checkout' }>[]) {
  const links: Array<{ sectionId: string; url: string; mock: boolean }> = [];

  for (const section of sections) {
    try {
      const link = await locus.payment.createLink({
        amount: section.amount,
        currency: section.currency,
        payment_methods: section.payment_methods,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success`,
        failure_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/failed`,
        metadata: { section_id: section.id, source: 'locus-studio' },
      });
      links.push({ sectionId: section.id, url: link.url, mock: false });
    } catch {
      const mockUrl = `https://pay.locus.sh/mock/${section.id}`;
      links.push({ sectionId: section.id, url: mockUrl, mock: true });
    }
  }

  return links;
}

async function deployToBuildWithLocus(page: PageConfig, token: string, repo: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.locus.sh';

  console.log('[Build] Deploying to BuildWithLocus...');
  console.log('[Build] Repo:', repo);
  console.log('[Build] Token:', token ? 'present' : 'missing');

  const res = await fetch(`${BUILD_BASE_URL}/v1/projects/from-repo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: page.username,
      repo: repo,
      branch: 'main',
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('[Build] Deploy failed:', res.status, errText);
    throw new Error(`Deploy failed: ${res.status} ${errText}`);
  }

  const data = await res.json();
  console.log('[Build] Deploy response:', JSON.stringify(data).slice(0, 500));

  return {
    url: data.project?.url || data.services?.[0]?.url || data.url || `${appUrl}/s/${page.username}`,
    projectId: data.project?.id,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const page = body as PageConfig;
    const repo = body.repo as string;

    if (!page.username) {
      return NextResponse.json({ error: 'username is required' }, { status: 400 });
    }

    if (!repo) {
      return NextResponse.json({ error: 'repo (GitHub repo) is required for deployment' }, { status: 400 });
    }

    const checkoutSections = extractCheckoutSections(page.sections);
    const paymentLinks = await createPaymentLinks(checkoutSections);

    const saved = await saveToStorage(page.username, page);

    let deployUrl: string | null = null;
    let deployedVia = 'local';
    let projectId: string | null = null;

    const token = await getBuildToken();
    if (token) {
      try {
        const result = await deployToBuildWithLocus(page, token, repo);
        deployUrl = result.url;
        projectId = result.projectId;
        deployedVia = 'buildwithlocus';
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
      paymentLinks,
      fallback: !deployUrl,
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