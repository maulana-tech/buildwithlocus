import { NextRequest, NextResponse } from 'next/server';
import { locus } from '@/lib/locus';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, description, currency, successUrl, cancelUrl, metadata } = body;

    if (!amount || parseFloat(amount) <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await locus.payment.createSession({
      amount: String(amount),
      description: description || `Payment ${amount} ${currency || 'USD'}`,
      successUrl: successUrl || `${appUrl}/payment/success`,
      cancelUrl: cancelUrl || `${appUrl}/payment/cancelled`,
      webhookUrl: `${appUrl}/api/webhooks/locus`,
      metadata: {
        source: 'locus-studio',
        ...(metadata || {}),
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.checkoutUrl || `https://checkout.paywithlocus.com/${session.id}`,
      amount: session.amount,
      currency: session.currency,
      status: session.status,
      expiresAt: session.expiresAt,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[PaymentLinks] Error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
