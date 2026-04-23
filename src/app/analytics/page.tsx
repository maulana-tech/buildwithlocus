'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart3, TrendingUp, DollarSign, Eye, ArrowRight, ShoppingCart, Users, Settings, Home } from 'lucide-react';

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
      <div style={{ minHeight: '100vh', background: '#09090b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #222', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ opacity: 0.5 }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#fff' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      
      <header style={{ height: '48px', borderBottom: '1px solid #1e1e22', background: '#111113', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '16px' }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b8b94', textDecoration: 'none', fontSize: '13px' }}>
          <Home size={14} /> Studio
        </Link>
        <Link href="/analytics" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
          <BarChart3 size={14} /> Analytics
        </Link>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: '11px', color: '#555' }}>Locus Studio</span>
      </header>

      <main style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Analytics</h1>
        <p style={{ color: '#71717a', fontSize: '14px', marginBottom: '32px' }}>Track your site performance and revenue</p>

        {summary && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
            <StatCard icon={<DollarSign size={18} />} label="Total Revenue" value={`${summary.totalRevenue} ${summary.currency}`} color="#22c55e" />
            <StatCard icon={<ShoppingCart size={18} />} label="Transactions" value={String(summary.totalTransactions)} color="#f59e0b" />
            <StatCard icon={<Eye size={18} />} label="Total Views" value={formatNumber(summary.totalViews)} color="#6366f1" />
            <StatCard icon={<Users size={18} />} label="Sites" value={String(sites.length)} color="#ec4899" />
          </div>
        )}

        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Your Sites</h2>
        
        {sites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#111113', borderRadius: '8px', border: '1px solid #1e1e22' }}>
            <BarChart3 size={40} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <p style={{ color: '#71717a', marginBottom: '16px' }}>No published sites yet</p>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#6366f1', color: '#fff', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
              Go to Studio <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sites.map(site => (
              <SiteRow key={site.username} site={site} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div style={{ background: '#111113', border: '1px solid #1e1e22', borderRadius: '8px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          {icon}
        </div>
        <span style={{ fontSize: '12px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div style={{ fontSize: '28px', fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function SiteRow({ site }: { site: SiteAnalytics }) {
  const paidTx = site.transactions.filter(t => t.status === 'PAID');
  
  return (
    <div style={{ background: '#111113', border: '1px solid #1e1e22', borderRadius: '8px', padding: '20px', display: 'flex', alignItems: 'center', gap: '24px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontWeight: 600, fontSize: '15px' }}>{site.title}</span>
          <span style={{ fontSize: '11px', color: '#555', background: '#1a1a1e', padding: '2px 6px', borderRadius: '3px' }}>{site.username}</span>
        </div>
        <div style={{ fontSize: '12px', color: '#555' }}>Published {formatDate(site.published_at)}</div>
      </div>
      
      <div style={{ display: 'flex', gap: '32px', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#22c55e' }}>{site.revenue}</div>
          <div style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase' }}>Revenue</div>
        </div>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 700 }}>{paidTx.length}</div>
          <div style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase' }}>Sales</div>
        </div>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 700 }}>{site.views}</div>
          <div style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase' }}>Views</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <a href={`/s/${site.username}`} target="_blank" rel="noopener" style={{ padding: '8px 12px', background: 'transparent', border: '1px solid #2e2e35', borderRadius: '6px', color: '#8b8b94', fontSize: '12px', textDecoration: 'none' }}>
          View Site
        </a>
        <Link href={`/analytics/${site.username}`} style={{ padding: '8px 12px', background: '#6366f1', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '12px', textDecoration: 'none', fontWeight: 600 }}>
          Details
        </Link>
      </div>
    </div>
  );
}