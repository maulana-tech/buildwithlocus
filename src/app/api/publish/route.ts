import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { siteConfig } = body as { siteConfig: { username?: string } & Record<string, unknown> };

    if (!siteConfig || !siteConfig.username) {
      return NextResponse.json(
        { error: 'siteConfig with username is required' },
        { status: 400 }
      );
    }

    const username = siteConfig.username as string;

    const sitesRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/sites?username=${username}`);
    let sharedSites: Record<string, unknown> = {};
    if (sitesRes.ok) {
      sharedSites = await sitesRes.json();
    }

    sharedSites[username] = {
      ...siteConfig,
      published_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/s/${username}`,
      site: sharedSites[username],
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
