import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const username = url.searchParams.get('username');

  const sites = loadSites();

  if (username) {
    const site = sites[username];
    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }
    return NextResponse.json(site);
  }

  return NextResponse.json({
    count: Object.keys(sites).length,
    sites: Object.keys(sites),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, page } = body as { username: string; page: Record<string, unknown> };

    if (!username || !page) {
      return NextResponse.json({ error: 'username and page required' }, { status: 400 });
    }

    const sites = loadSites();
    sites[username] = {
      ...page,
      published_at: new Date().toISOString(),
    };
    
    const dir = path.dirname(SITES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SITES_FILE, JSON.stringify(sites, null, 2));

    return NextResponse.json({
      success: true,
      username,
      published_at: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}