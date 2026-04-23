'use client';

import React, { useState, useEffect, use } from 'react';
import { Star, ChevronDown, ArrowRight } from 'lucide-react';
import type { PageConfig, PageSection } from '@/agents/state';

const SHARED_SITES_KEY = 'locus_shared_sites';

function loadFromStorage(username: string): Record<string, unknown> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(SHARED_SITES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const THEME_STYLES: Record<string, { bg: string; text: string; accent: string; cardBg: string; cardBorder: string; sectionAlt: string }> = {
  modern: { bg: '#ffffff', text: '#111111', accent: '#6366f1', cardBg: '#f8f9fa', cardBorder: '#e5e7eb', sectionAlt: '#f8f9fa' },
  dark: { bg: '#09090b', text: '#ededef', accent: '#6366f1', cardBg: '#111113', cardBorder: '#1e1e22', sectionAlt: '#0c0c0e' },
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
        {section.cta_label && <a href={section.cta_url || '#'} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: s.accent, color: '#fff', padding: '14px 32px', fontSize: '16px', fontWeight: 700, borderRadius: '6px', textDecoration: 'none' }}>{section.cta_label} <ArrowRight size={16} /></a>}
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
          {section.items.map((item) => <div key={item.id} style={{ padding: '28px', background: s.cardBg, border: `1px solid ${s.cardBorder}`, borderRadius: '8px' }}><div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.icon || '\u25CF'}</div><h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{item.title}</h3><p style={{ fontSize: '14px', opacity: 0.65, lineHeight: 1.6 }}>{item.description}</p></div>)}
        </div>
      </div>
    </section>
  );
}

function CheckoutSection({ section, theme }: { section: Extract<PageSection, { type: 'checkout' }>; theme: string }) {
  return (
    <section style={{ padding: '64px 32px', background: '#fff', color: '#111', textAlign: 'center' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {section.title && <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>{section.title}</h2>}
        <p style={{ fontSize: '16px', opacity: 0.6, marginBottom: '24px' }}>{section.description}</p>
        <div style={{ fontSize: '48px', fontWeight: 800, marginBottom: '24px' }}>{section.currency} {section.amount.toLocaleString()}</div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>{section.payment_methods.map((m) => <span key={m} style={{ fontSize: '12px', padding: '6px 12px', background: '#f3f4f6', borderRadius: '4px' }}>{m}</span>)}</div>
        <button style={{ background: '#6366f1', color: '#fff', padding: '16px 48px', fontSize: '16px', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer' }}>{section.cta_label}</button>
      </div>
    </section>
  );
}

function FooterSection({ section, theme }: { section: Extract<PageSection, { type: 'footer' }>; theme: string }) {
  const s = THEME_STYLES[theme] || THEME_STYLES.modern;
  return (
    <footer style={{ padding: '40px 32px', background: s.bg, color: '#999', borderTop: `1px solid ${s.cardBorder}` }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><div style={{ fontSize: '16px', fontWeight: 700, color: s.text, marginBottom: '4px' }}>{section.brand_name}</div><div style={{ fontSize: '12px', opacity: 0.6 }}>{section.tagline}</div></div>
        <div style={{ display: 'flex', gap: '24px' }}>{section.links.map((l) => <a key={l.id} href={l.url} style={{ fontSize: '12px', color: '#999', textDecoration: 'none' }}>{l.label}</a>)}</div>
      </div>
    </footer>
  );
}

export default function SitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [page, setPage] = useState<PageConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/sites?username=${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.sections?.length) setPage(data);
        }
        const local = loadFromStorage(id);
        if (local[id]) setPage(local[id] as PageConfig);
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <div style={{ minHeight: '100vh', background: '#0a0a0c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  if (!page) return <div style={{ minHeight: '100vh', background: '#0a0a0c', color: '#fff', padding: '40px' }}><h1>404 - Site not found</h1></div>;

  return (
    <div style={{ minHeight: '100vh', background: THEME_STYLES[page.theme]?.bg || '#fff' }}>
      {page.sections.map((s) => (
        <React.Fragment key={s.id}>
          {s.type === 'hero' && <HeroSection section={s} theme={page.theme} />}
          {s.type === 'features' && <FeaturesSection section={s} theme={page.theme} />}
          {s.type === 'checkout' && <CheckoutSection section={s} theme={page.theme} />}
          {s.type === 'footer' && <FooterSection section={s} theme={page.theme} />}
        </React.Fragment>
      ))}
    </div>
  );
}