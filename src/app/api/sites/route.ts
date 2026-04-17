import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const username = url.searchParams.get('username');

  return NextResponse.json({ message: 'Sites API', username });
}

export async function POST(req: NextRequest) {
  try {
    const { username, siteConfig } = await req.json();

    if (!username || !siteConfig) {
      return NextResponse.json(
        { error: 'username and siteConfig required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      username,
      saved: true,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
