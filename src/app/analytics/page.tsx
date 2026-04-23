'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart3, TrendingUp, DollarSign, Eye, ArrowRight, ShoppingCart, Users } from 'lucide-react';
import { AppNavbar } from '@/components/AppNavbar';

type SiteAnalytics = {
  username: string;
  title: string;
  published_at: string;
  views: number;
  transactions: Array<{
    id: string;
    method: string;
    amount: number;
    status: string;
    created_at: string;
  }>;
  revenue: number;
  currency: string;
};

type Summary = {
  totalRevenue: number;
  totalViews: number;
  totalTransactions: number;
  currency: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatNumber(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

export default function AnalyticsPage() {
  const [sites, setSites] = useState<SiteAnalytics[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(data => {
        setSites(data.sites || []);
        setSummary(data.summary || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f0f10', color: '#fdfdfd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '28px', height: '28px', border: '2px solid #2a2a2b', borderTopColor: '#b7d941', borderRadius: 0, animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: '#666668', fontSize: '13px' }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f10', color: '#fdfdfd', display: 'flex', flexDirection: 'column' }}>
      <AppNavbar />

      <main style={{ padding: '32px', maxWidth: '960px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 500, letterSpacing: '-0.005em', marginBottom: '4px' }}>Analytics</h1>
        <p style={{ color: '#a0a0a2', fontSize: '13px', marginBottom: '32px', lineHeight: 1.55 }}>Track performance and revenue</p>

        {summary && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', marginBottom: '40px', background: '#2a2a2b', border: '1px solid #2a2a2b' }}>
            <StatCard icon={<DollarSign size={16} />} label="Revenue" value={`${summary.totalRevenue} ${summary.currency}`} accent />
            <StatCard icon={<ShoppingCart size={16} />} label="Transactions" value={String(summary.totalTransactions)} />
            <StatCard icon={<Eye size={16} />} label="Views" value={formatNumber(summary.totalViews)} />
            <StatCard icon={<Users size={16} />} label="Sites" value={String(sites.length)} />
          </div>
        )}

        <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#666668', marginBottom: '16px' }}>Your Sites</div>

        {sites.length === 0 ? (
          <div style={{ padding: '64px', background: '#1b1b1c', border: '1px solid #2a2a2b', textAlign: 'center' }}>
            <BarChart3 size={32} style={{ color: '#2a2a2b', marginBottom: '16px' }} />
            <p style={{ color: '#666668', marginBottom: '16px', fontSize: '13px' }}>No published sites yet</p>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#b7d941', color: '#0f0f10', padding: '10px 20px', textDecoration: 'none', fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Go to Builder <ArrowRight size={12} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#2a2a2b', border: '1px solid #2a2a2b' }}>
            {sites.map(site => (
              <SiteRow key={site.username} site={site} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ background: '#1b1b1c', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div style={{ width: '28px', height: '28px', background: accent ? 'rgba(183, 217, 65, 0.1)' : '#242425', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent ? '#b7d941' : '#a0a0a2' }}>
          {icon}
        </div>
        <span style={{ fontSize: '10px', color: '#666668', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'monospace', color: accent ? '#b7d941' : '#fdfdfd' }}>{value}</div>
    </div>
  );
}

function SiteRow({ site }: { site: SiteAnalytics }) {
  const paidTx = site.transactions.filter(t => t.status === 'PAID');

  return (
    <div style={{ background: '#1b1b1c', padding: '20px', display: 'flex', alignItems: 'center', gap: '24px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontWeight: 600, fontSize: '13px', color: '#fdfdfd' }}>{site.title}</span>
          <span style={{ fontSize: '10px', color: '#666668', background: '#242425', padding: '2px 6px', fontFamily: 'monospace' }}>{site.username}</span>
        </div>
        <div style={{ fontSize: '11px', color: '#666668' }}>Published {formatDate(site.published_at)}</div>
      </div>

      <div style={{ display: 'flex', gap: '32px', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace', color: '#b7d941' }}>{site.revenue}</div>
          <div style={{ fontSize: '9px', color: '#666668', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue</div>
        </div>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace', color: '#fdfdfd' }}>{paidTx.length}</div>
          <div style={{ fontSize: '9px', color: '#666668', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sales</div>
        </div>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace', color: '#fdfdfd' }}>{site.views}</div>
          <div style={{ fontSize: '9px', color: '#666668', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Views</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <a href={`/s/${site.username}`} target="_blank" rel="noopener" style={{ padding: '8px 12px', background: 'transparent', border: '1px solid #2a2a2b', color: '#a0a0a2', fontSize: '11px', textDecoration: 'none', fontWeight: 500 }}>
          View
        </a>
        <Link href={`/analytics/${site.username}`} style={{ padding: '8px 12px', background: '#b7d941', border: 'none', color: '#0f0f10', fontSize: '11px', textDecoration: 'none', fontWeight: 600, letterSpacing: '0.03em' }}>
          Details
        </Link>
      </div>
    </div>
  );
}
