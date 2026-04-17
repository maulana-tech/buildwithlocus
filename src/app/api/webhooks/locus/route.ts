import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawBody = JSON.stringify(body);
    const headersList = await headers();
    const signature = headersList.get('x-locus-signature') || '';
    const secret = process.env.LOCUS_WEBHOOK_SECRET || '';

    if (secret && signature) {
      const expected = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (signature !== expected) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const eventType = body.type || body.event;
    const payload = body.data || body;

    switch (eventType) {
      case 'transaction.paid':
        console.log(`[Webhook] Transaction paid: ${payload.id}`);
        break;
      case 'transaction.failed':
        console.log(`[Webhook] Transaction failed: ${payload.id}`);
        break;
      case 'transaction.expired':
        console.log(`[Webhook] Transaction expired: ${payload.id}`);
        break;
      default:
        console.log(`[Webhook] Unhandled event: ${eventType}`);
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
