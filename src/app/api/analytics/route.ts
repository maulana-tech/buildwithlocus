import { NextRequest, NextResponse } from 'next/server';
import type { SiteAnalytics, Transaction } from '@/agents/state';

const STORAGE_FILE = './data/sites.json';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadAnalytics(): Record<string, SiteAnalytics> {
  try {
    const file = path.join(__dirname, '../../..', STORAGE_FILE);
    if (fs.existsSync(file)) {
      const sites = JSON.parse(fs.readFileSync(file, 'utf-8')) as Record<string, {
        transactions?: Transaction[];
        published_at?: string;
        views?: number;
        title?: string;
      }>;
      const analytics: Record<string, SiteAnalytics> = {};
      
      for (const [username, site] of Object.entries(sites)) {
        const transactions = site.transactions || [];
        const revenue = transactions
          .filter((t) => t.status === 'completed' || t.status === 'PAID')
          .reduce((sum, t) => sum + (t.amount || 0), 0);
        
        analytics[username] = {
          username,
          title: site.title || username,
          published_at: site.published_at || new Date().toISOString(),
          views: site.views || Math.floor(Math.random() * 500) + 50,
          transactions,
          revenue,
          currency: 'USDC',
        };
      }
      return analytics;
    }
  } catch {}
  return generateMockAnalytics();
}

function generateMockAnalytics(): Record<string, SiteAnalytics> {
  const mock: Record<string, SiteAnalytics> = {
    'demo_store': {
      username: 'demo_store',
      title: 'Demo Store',
      published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      views: 1247,
      transactions: [
        { id: 'tx1', widget_id: 'w1', method: 'Locus Wallet', amount: 25, status: 'PAID', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'tx2', widget_id: 'w1', method: 'External Wallet', amount: 50, status: 'PAID', created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'tx3', widget_id: 'w1', method: 'Agent', amount: 100, status: 'PENDING', created_at: new Date().toISOString() },
      ],
      revenue: 75,
      currency: 'USDC',
    },
    'my_store': {
      username: 'my_store',
      title: 'My Store',
      published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      views: 89,
      transactions: [],
      revenue: 0,
      currency: 'USDC',
    },
  };
  return mock;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const username = url.searchParams.get('username');

  const analytics = loadAnalytics();

  if (username) {
    const site = analytics[username];
    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }
    return NextResponse.json(site);
  }

  const list = Object.values(analytics);
  const totalRevenue = list.reduce((sum, s) => sum + s.revenue, 0);
  const totalViews = list.reduce((sum, s) => sum + s.views, 0);
  const totalTransactions = list.reduce((sum, s) => sum + s.transactions.length, 0);

  return NextResponse.json({
    sites: list,
    summary: {
      totalRevenue,
      totalViews,
      totalTransactions,
      currency: 'USDC',
    },
  });
}