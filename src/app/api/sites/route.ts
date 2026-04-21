import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITES_FILE = path.join(__dirname, '../../../../data/sites.json');

function loadSites(): Record<string, unknown> {
  try {
    if (fs.existsSync(SITES_FILE)) {
      const raw = fs.readFileSync(SITES_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {}
  return {};
}

function saveSites(sites: Record<string, unknown>) {
  try {
    const dir = path.dirname(SITES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SITES_FILE, JSON.stringify(sites, null, 2));
  } catch (err) {
    console.error('[Sites] Write error:', err);
  }
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
    const siteData = sites[username] as Record<string, unknown> | undefined;
    sites[username] = {
      ...page,
      published_at: new Date().toISOString(),
    };
    saveSites(sites);

    return NextResponse.json({
      success: true,
      username,
      published_at: siteData?.published_at || new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const username = url.searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'username required' }, { status: 400 });
  }

  const sites = loadSites();
  if (!sites[username]) {
    return NextResponse.json({ error: 'Site not found' }, { status: 404 });
  }

  delete sites[username];
  saveSites(sites);

  return NextResponse.json({ success: true, username });
}