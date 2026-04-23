import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.LOCUS_API_BASE || 'https://api.paywithlocus.com/api';

export async function POST(req: NextRequest) {
  try {
    const { apiKey } = await req.json();

    if (!apiKey || !apiKey.startsWith('claw_')) {
      return NextResponse.json({ error: 'Invalid API key format' }, { status: 400 });
    }

    const res = await fetch(`${API_BASE}/pay/balance`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: (err as Record<string, string>).message || `Authentication failed (${res.status})` },
        { status: res.status },
      );
    }

    const data = await res.json() as { success?: boolean; data?: { balance?: string; wallet_address?: string }; balance?: string; wallet_address?: string };
    const result = data.success ? data.data : data;

    return NextResponse.json({
      wallet_address: (result as Record<string, unknown>).wallet_address,
      balance: (result as Record<string, unknown>).balance,
      token: (result as Record<string, unknown>).token || 'USDC',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
