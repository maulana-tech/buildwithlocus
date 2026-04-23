import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const SITES_FILE = path.join(process.cwd(), 'data/sites.json');

function loadSites(): Record<string, unknown> {
  try {
    if (fs.existsSync(SITES_FILE)) {
      return JSON.parse(fs.readFileSync(SITES_FILE, 'utf-8'));
    }
  } catch {}
  return {};
}

function saveSites(sites: Record<string, unknown>) {
  const dir = path.dirname(SITES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SITES_FILE, JSON.stringify(sites, null, 2));
}

function verifySignature(payload: string, signature: string, secret: string): boolean {
  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected),
    );
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    const headersList = await headers();
    const signature = headersList.get('X-Signature-256') || '';
    const secret = process.env.LOCUS_WEBHOOK_SECRET || '';

    if (secret && signature) {
      if (!verifySignature(rawBody, signature, secret)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const eventType = body.event || body.type;
    const data = body.data || body;
    const sessionId = data.sessionId || data.id;

    switch (eventType) {
      case 'checkout.session.paid': {
        console.log(`[Webhook] Session paid: ${sessionId} — ${data.amount} USDC from ${data.payerAddress}`);

        const sites = loadSites();
        for (const [username, site] of Object.entries(sites) as [string, Record<string, unknown>][]) {
          const sections = site.sections as Array<Record<string, unknown>> | undefined;
          if (!sections) continue;

          for (const section of sections) {
            if (section.type !== 'checkout') continue;
            const sessionIds = section.checkoutSessionIds as Record<string, string> | undefined;
            if (sessionIds && sessionIds[sessionId]) {
              const transactions = (site.transactions as Array<Record<string, unknown>>) || [];
              transactions.push({
                id: `tx_${Date.now()}`,
                method: 'Locus Checkout',
                amount: parseFloat(data.amount || '0'),
                status: 'PAID',
                created_at: data.paidAt || new Date().toISOString(),
                sessionId,
                txHash: data.paymentTxHash,
                payerAddress: data.payerAddress,
              });
              (site as Record<string, unknown>).transactions = transactions;
              saveSites(sites);
              console.log(`[Webhook] Transaction saved for ${username}`);
              break;
            }
          }
        }
        break;
      }

      case 'checkout.session.expired':
        console.log(`[Webhook] Session expired: ${sessionId}`);
        break;

      default:
        console.log(`[Webhook] Event: ${eventType}`, data);
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Webhook] Error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'locus-webhook' });
}
