import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { locus } from '@/lib/locus';
import type { PageConfig, PageSection } from '@/agents/state';

const DEPLOY_FILE = path.join(process.cwd(), 'data/deploy.json');

type DeployState = {
  projectId: string;
  serviceId: string;
  serviceUrl: string;
  deployedAt: string;
};

function loadDeployState(): DeployState | null {
  try {
    if (fs.existsSync(DEPLOY_FILE)) {
      return JSON.parse(fs.readFileSync(DEPLOY_FILE, 'utf-8'));
    }
  } catch {}
  return null;
}

function saveDeployState(state: DeployState) {
  const dir = path.dirname(DEPLOY_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DEPLOY_FILE, JSON.stringify(state, null, 2));
}

function extractCheckoutSections(sections: PageSection[]) {
  return sections.filter((s): s is Extract<PageSection, { type: 'checkout' }> => s.type === 'checkout');
}

async function createCheckoutSessions(page: PageConfig) {
  const sections = extractCheckoutSections(page.sections);
  if (sections.length === 0 || !process.env.LOCUS_API_KEY) return [];

  const sessions: Array<{ sectionId: string; sessionId: string }> = [];

  for (const section of sections) {
    try {
      const session = await locus.payment.createSession({
        amount: String(section.amount),
        description: section.title || 'Payment',
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/cancelled`,
        webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/locus`,
        metadata: { section_id: section.id, source: 'locus-studio', username: page.username },
        receiptConfig: {
          enabled: true,
          fields: {
            creditorName: page.title,
            lineItems: [{ description: section.title || 'Payment', amount: String(section.amount) }],
          },
        },
      });
      sessions.push({ sectionId: section.id, sessionId: session.id });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[Publish] Session creation failed for ${section.id}:`, msg);
    }
  }

  return sessions;
}

function attachSessionIds(page: PageConfig, sessions: Array<{ sectionId: string; sessionId: string }>): PageConfig {
  if (sessions.length === 0) return page;
  const sessionMap = Object.fromEntries(sessions.map(s => [s.sectionId, s.sessionId]));
  return {
    ...page,
    sections: page.sections.map(section => {
      if (section.type !== 'checkout') return section;
      const sessionId = sessionMap[section.id];
      if (!sessionId) return section;
      return { ...section, checkoutSessionId: sessionId };
    }),
  };
}

async function saveToStorage(username: string, page: PageConfig) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const saveUrl = baseUrl.includes('localhost') ? 'http://localhost:3000' : baseUrl;
    const res = await fetch(`${saveUrl}/api/sites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, page }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function handleBuildDeploy(repo: string) {
  const token = await locus.build.exchangeToken();
  if (!token?.token) {
    console.log('[Publish] No BuildWithLocus token, skipping deploy');
    return { deployed: false, url: null, projectId: null };
  }

  const existing = loadDeployState();

  if (existing?.serviceId) {
    console.log(`[Publish] Existing service found: ${existing.serviceId}. Triggering redeploy...`);
    try {
      const deployment = await locus.build.triggerDeployment(token.token, existing.serviceId);
      console.log(`[Publish] Redeployment triggered: ${deployment.id}`);
      return { deployed: true, url: existing.serviceUrl, projectId: existing.projectId, redeployed: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[Publish] Redeploy failed, will try fresh:`, msg);
    }
  }

  try {
    const billing = await locus.build.getBillingBalance(token.token);
    const creditBalance = parseFloat(billing.creditBalance || billing.credit_balance || '0');
    console.log(`[Publish] BuildWithLocus credits: $${creditBalance}`);

    if (creditBalance < 0.25) {
      console.warn('[Publish] Insufficient credits for new service');
      return { deployed: false, url: null, projectId: null, reason: 'insufficient_credits' };
    }
  } catch (err: unknown) {
    console.warn('[Publish] Billing check failed:', err instanceof Error ? err.message : String(err));
  }

  try {
    const data = await locus.build.deployFromRepo(token.token, { name: 'locus-studio', repo });
    const projectId = data.project?.id || null;
    const serviceId = data.services?.[0]?.id || data.service?.id || null;
    const serviceUrl = data.project?.url || data.services?.[0]?.url || null;

    if (serviceId && serviceUrl) {
      saveDeployState({
        projectId: projectId || '',
        serviceId,
        serviceUrl,
        deployedAt: new Date().toISOString(),
      });
      console.log(`[Publish] New deployment: ${serviceUrl}`);
    }

    return { deployed: true, url: serviceUrl, projectId, redeployed: false };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[Publish] BuildWithLocus deploy failed:', msg);
    return { deployed: false, url: null, projectId: null, reason: msg };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const page = body as PageConfig;
    const repo = body.repo as string;

    if (!page.username) {
      return NextResponse.json({ error: 'username is required' }, { status: 400 });
    }

    const sessions = await createCheckoutSessions(page);
    const enrichedPage = attachSessionIds(page, sessions);

    const saved = await saveToStorage(page.username, enrichedPage);

    let deployResult = { deployed: false, url: null as string | null, projectId: null as string | null, redeployed: false };
    if (repo) {
      deployResult = await handleBuildDeploy(repo) as typeof deployResult;
    }

    const appUrl = deployResult.url || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const localUrl = `${appUrl}/s/${page.username}`;

    return NextResponse.json({
      success: true,
      url: deployResult.url || localUrl,
      deployedVia: deployResult.deployed ? 'buildwithlocus' : 'local',
      projectId: deployResult.projectId,
      redeployed: deployResult.redeployed,
      storage: saved ? 'server' : 'local',
      checkoutSessions: sessions.length,
      page: {
        username: page.username,
        title: page.title,
        theme: page.theme,
        sections: page.sections.length,
        checkouts: extractCheckoutSections(page.sections).length,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Publish] Error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
