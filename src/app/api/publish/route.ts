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
    const sharedSites: Record<string, unknown> = {};
    sharedSites[username] = { ...page, published_at: new Date().toISOString() };
    if (typeof window !== 'undefined') {
      localStorage.setItem('locus_shared_sites', JSON.stringify(sharedSites));
    }
    return true;
  }
}

async function loadFromStorage(username: string): Promise<PageConfig | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/sites?username=${username}`);
    if (!res.ok) return null;
    return res.json() as Promise<PageConfig | null>;
  } catch {
    return null;
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

async function deployToBuildWithLocus(page: PageConfig, token: string) {
  const projectRes = await fetch(`${BUILD_BASE_URL}/v1/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: page.username,
      source: 'locus-studio',
      config: {
        type: 'static',
        pages: page.sections,
        theme: page.theme,
        primary_color: page.primary_color,
      },
    }),
  });

  if (!projectRes.ok) {
    const err = await projectRes.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || `Build API error: ${projectRes.status}`);
  }

  const project = await projectRes.json();

  const deployRes = await fetch(`${BUILD_BASE_URL}/v1/projects/${(project as { id: string }).id}/deploy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!deployRes.ok) {
    const err = await deployRes.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || `Deploy error: ${deployRes.status}`);
  }

  return deployRes.json() as Promise<{ url?: string; id?: string }>;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const page = body as PageConfig;

    if (!page.username) {
      return NextResponse.json({ error: 'username is required' }, { status: 400 });
    }

    const checkoutSections = extractCheckoutSections(page.sections);
    const paymentLinks = await createPaymentLinks(checkoutSections);

    const saved = await saveToStorage(page.username, page);

    let deployUrl: string | null = null;
    let deployedVia = 'local';

    const token = await getBuildToken();
    if (token) {
      try {
        const deployResult = await deployToBuildWithLocus(page, token);
        deployUrl = deployResult.url || null;
        deployedVia = 'buildwithlocus';
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn('[Publish] BuildWithLocus deploy failed, using local:', msg);
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const localUrl = `${appUrl}/s/${page.username}`;

    return NextResponse.json({
      success: true,
      url: deployUrl || localUrl,
      deployedVia,
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
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}