'use client';

import React, { useState, useEffect, use } from 'react';
import { ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { PageConfig, PageSection } from '@/agents/state';

const LocusCheckout = dynamic(
  () => import('@withlocus/checkout-react').then((mod) => mod.LocusCheckout),
  { ssr: false },
);

const SHARED_SITES_KEY = 'locus_shared_sites';

const THEME_STYLES: Record<string, { bg: string; text: string; accent: string; cardBg: string; cardBorder: string; sectionAlt: string }> = {
  modern: { bg: '#ffffff', text: '#111111', accent: '#b7d941', cardBg: '#f8f9fa', cardBorder: '#e5e7eb', sectionAlt: '#f8f9fa' },
  dark: { bg: '#0f0f10', text: '#fdfdfd', accent: '#b7d941', cardBg: '#1b1b1c', cardBorder: '#2a2a2b', sectionAlt: '#141415' },
  retro: { bg: '#faf7f2', text: '#2d2418', accent: '#d97706', cardBg: '#f5f0e8', cardBorder: '#e2d9c8', sectionAlt: '#f0ebe3' },
  glass: { bg: '#0f172a', text: '#e2e8f0', accent: '#38bdf8', cardBg: 'rgba(255,255,255,0.05)', cardBorder: 'rgba(255,255,255,0.1)', sectionAlt: '#0c1322' },
  neon: { bg: '#0a0a0a', text: '#e0e0e0', accent: '#a855f7', cardBg: '#141414', cardBorder: '#262626', sectionAlt: '#0e0e0e' },
};

function HeroSection({ section, theme }: { section: Extract<PageSection, { type: 'hero' }>; theme: string }) {
  const s = THEME_STYLES[theme] || THEME_STYLES.modern;
  return (
    <section style={{ padding: '80px 32px', textAlign: section.alignment as 'left' | 'center' | 'right', background: s.bg, color: s.text, minHeight: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: section.alignment === 'center' ? 'center' : section.alignment === 'right' ? 'flex-end' : 'flex-start' }}>
      <div style={{ maxWidth: '720px' }}>
        <h1 style={{ fontSize: 'clamp(28px,5vw,56px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>{section.headline}</h1>
        <p style={{ fontSize: 'clamp(14px,2vw,18px)', opacity: 0.7, marginBottom: '32px', lineHeight: 1.6 }}>{section.subtext}</p>
        {section.cta_label && <a href={section.cta_url || '#'} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: s.accent, color: theme === 'dark' || theme === 'glass' || theme === 'neon' ? '#0f0f10' : '#fff', padding: '14px 32px', fontSize: '16px', fontWeight: 700, textDecoration: 'none' }}>{section.cta_label} <ArrowRight size={16} /></a>}
      </div>
    </section>
  );
}

function FeaturesSection({ section, theme }: { section: Extract<PageSection, { type: 'features' }>; theme: string }) {
  const s = THEME_STYLES[theme] || THEME_STYLES.modern;
  return (
    <section style={{ padding: '64px 32px', background: s.sectionAlt, color: s.text }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {section.title && <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '40px', textAlign: 'center' }}>{section.title}</h2>}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${section.columns},1fr)`, gap: '24px' }}>
          {section.items.map((item) => <div key={item.id} style={{ padding: '28px', background: s.cardBg, border: `1px solid ${s.cardBorder}` }}><div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.icon || '\u25CF'}</div><h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{item.title}</h3><p style={{ fontSize: '14px', opacity: 0.65, lineHeight: 1.6 }}>{item.description}</p></div>)}
        </div>
      </div>
    </section>
  );
}

function CheckoutSection({ section, theme }: { section: Extract<PageSection, { type: 'checkout' }> & { checkoutSessionId?: string }; theme: string }) {
  const s = THEME_STYLES[theme] || THEME_STYLES.modern;
  const sessionId = (section as Record<string, unknown>).checkoutSessionId as string | undefined;
  const [showCheckout, setShowCheckout] = useState(false);

  if (showCheckout && sessionId) {
    return (
      <section style={{ padding: '64px 32px', background: s.sectionAlt, display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '450px', width: '100%' }}>
          <LocusCheckout
            sessionId={sessionId}
            mode="embedded"
            onSuccess={(data) => {
              console.log('Payment confirmed:', data.txHash);
              alert('Payment confirmed!');
            }}
            onCancel={() => setShowCheckout(false)}
            onError={(error) => {
              console.error('Checkout error:', error.message);
              alert('Checkout error: ' + error.message);
            }}
          />
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: '64px 32px', background: s.sectionAlt, color: s.text, textAlign: 'center' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {section.title && <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>{section.title}</h2>}
        <p style={{ fontSize: '16px', opacity: 0.6, marginBottom: '24px' }}>{section.description}</p>
        <div style={{ fontSize: '48px', fontWeight: 800, marginBottom: '8px', fontFamily: 'monospace' }}>{section.amount.toLocaleString()}</div>
        <div style={{ fontSize: '14px', opacity: 0.5, marginBottom: '24px' }}>{section.currency}</div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>{section.payment_methods.map((m) => <span key={m} style={{ fontSize: '12px', padding: '6px 12px', background: s.cardBg, border: `1px solid ${s.cardBorder}` }}>{m}</span>)}</div>
        <button onClick={() => setShowCheckout(true)} style={{ background: s.accent, color: theme === 'dark' || theme === 'glass' || theme === 'neon' ? '#0f0f10' : '#fff', padding: '16px 48px', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
          {section.cta_label}
        </button>
      </div>
    </section>
  );
}

function FooterSection({ section, theme }: { section: Extract<PageSection, { type: 'footer' }>; theme: string }) {
  const s = THEME_STYLES[theme] || THEME_STYLES.modern;
  return (
    <footer style={{ padding: '40px 32px', background: s.bg, color: s.text, opacity: 0.6, borderTop: `1px solid ${s.cardBorder}` }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{section.brand_name}</div><div style={{ fontSize: '12px', opacity: 0.6 }}>{section.tagline}</div></div>
        <div style={{ display: 'flex', gap: '24px' }}>{section.links.map((l) => <a key={l.id} href={l.url} style={{ fontSize: '12px', color: 'inherit', textDecoration: 'none' }}>{l.label}</a>)}</div>
      </div>
    </footer>
  );
}

export default function SitePage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const id = params.id;

  const [page, setPage] = useState<PageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const localRes = await fetch('/api/sites?username=' + id);
        if (localRes.ok) {
          const data = await localRes.json();
          if (data.sections?.length) { setPage(data); setLoading(false); return; }
        }
      } catch {}

      try {
        const raw = localStorage.getItem(SHARED_SITES_KEY);
        const sites = raw ? JSON.parse(raw) : {};
        if (sites[id]?.sections?.length) { setPage(sites[id]); setLoading(false); return; }
      } catch {}

      setError('Site not found');
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <div style={{ minHeight: '100vh', background: '#0f0f10', color: '#fdfdfd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>Loading {id}...</div>;
  if (error) return <div style={{ minHeight: '100vh', background: '#0f0f10', color: '#fdfdfd', padding: '40px' }}><h1>Error: {error}</h1></div>;
  if (!page) return <div style={{ minHeight: '100vh', background: '#0f0f10', color: '#fdfdfd', padding: '40px' }}><h1>404 - Site not found for {id}</h1></div>;

  return (
    <div style={{ minHeight: '100vh', background: THEME_STYLES[page.theme]?.bg || '#fff' }}>
      {page.sections.map((s) => (
        <React.Fragment key={s.id}>
          {s.type === 'hero' && <HeroSection section={s} theme={page.theme} />}
          {s.type === 'features' && <FeaturesSection section={s} theme={page.theme} />}
          {s.type === 'checkout' && <CheckoutSection section={s as Extract<PageSection, { type: 'checkout' }> & { checkoutSessionId?: string }} theme={page.theme} />}
          {s.type === 'footer' && <FooterSection section={s} theme={page.theme} />}
        </React.Fragment>
      ))}
    </div>
  );
}
