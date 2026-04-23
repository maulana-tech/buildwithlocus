'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  ChevronDown,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import type { PageConfig, PageSection } from '@/agents/state';

const SHARED_SITES_KEY = 'locus_shared_sites';
const APP_URL = typeof window !== 'undefined' ? window.location.origin : '';

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
    <section style={{
      padding: '80px 32px',
      textAlign: section.alignment as 'left' | 'center' | 'right',
      background: section.background_image
        ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${section.background_image}) center/cover`
        : s.bg,
      color: section.background_image ? '#fff' : s.text,
      minHeight: '50vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: section.alignment === 'center' ? 'center' : section.alignment === 'right' ? 'flex-end' : 'flex-start',
    }}>
      <div style={{ maxWidth: '720px' }}>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 56px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>{section.headline}</h1>
        <p style={{ fontSize: 'clamp(14px, 2vw, 18px)', opacity: 0.7, marginBottom: '32px', lineHeight: 1.6 }}>{section.subtext}</p>
        {section.cta_label && (
          <a
            href={section.cta_url || '#'}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: s.accent, color: '#fff', padding: '14px 32px', fontSize: '16px', fontWeight: 700, borderRadius: '6px', textDecoration: 'none', transition: 'opacity 0.2s' }}
          >
            {section.cta_label} <ArrowRight size={16} />
          </a>
        )}
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
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${section.columns}, 1fr)`, gap: '24px' }}>
          {section.items.map((item) => (
            <div key={item.id} style={{ padding: '28px', background: s.cardBg, border: `1px solid ${s.cardBorder}`, borderRadius: '8px' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.icon || '\u25CF'}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', opacity: 0.65, lineHeight: 1.6 }}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection({ section, theme }: { section: Extract<PageSection, { type: 'pricing' }>; theme: string }) {
  const s = THEME_STYLES[theme] || THEME_STYLES.modern;
  return (
    <section style={{ padding: '64px 32px', background: s.bg, color: s.text }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {section.title && <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '40px', textAlign: 'center' }}>{section.title}</h2>}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(section.columns, section.plans.length)}, 1fr)`, gap: '20px' }}>
          {section.plans.map((plan) => (
            <div key={plan.id} style={{
              padding: '32px',
              background: plan.highlighted ? (theme === 'dark' || theme === 'neon' ? '#1a1a2e' : '#eef2ff') : s.cardBg,
              border: plan.highlighted ? `2px solid ${s.accent}` : `1px solid ${s.cardBorder}`,
              borderRadius: '8px',
              textAlign: 'center',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{plan.name}</h3>
              <div style={{ fontSize: '36px', fontWeight: 800, marginBottom: '4px' }}>{plan.price}<span style={{ fontSize: '14px', fontWeight: 400, opacity: 0.5 }}>/{plan.period}</span></div>
              <div style={{ margin: '20px 0', textAlign: 'left' }}>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ fontSize: '14px', padding: '6px 0', opacity: 0.7, borderBottom: `1px solid ${s.cardBorder}` }}>{'\u2713'} {f}</div>
                ))}
              </div>
              <button style={{
                width: '100%', padding: '12px', fontSize: '14px', fontWeight: 700,
                background: plan.highlighted ? s.accent : s.cardBg, color: plan.highlighted ? '#fff' : s.text,
                border: `1px solid ${s.cardBorder}`, borderRadius: '6px', cursor: 'pointer',
              }}>
                {plan.cta_label}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CheckoutSectionPublic({ section, theme, checkoutUrl }: { section: Extract<PageSection, { type: 'checkout' }>; theme: string; checkoutUrl?: string }) {
  const s = THEME_STYLES[theme] || THEME_STYLES.modern;
  const payUrl = checkoutUrl || `https://checkout.paywithlocus.com`;
  return (
    <section style={{ padding: '64px 32px', background: s.sectionAlt, color: s.text }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
        {section.title && <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>{section.title}</h2>}
        <p style={{ fontSize: '14px', opacity: 0.6, marginBottom: '24px' }}>{section.description}</p>
        <div style={{
          padding: '28px', background: s.cardBg, border: `1px solid ${s.cardBorder}`, borderRadius: '8px',
          borderLeft: `4px solid ${s.accent}`, textAlign: 'left',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: s.accent }}>
              Locus Pay
            </span>
            <ShieldCheck size={16} color={s.accent} />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>
            {section.currency} {section.amount.toLocaleString()}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {section.payment_methods.map((m) => (
              <span key={m} style={{ fontSize: '11px', padding: '4px 10px', background: s.bg, borderRadius: '4px', border: `1px solid ${s.cardBorder}` }}>{m}</span>
            ))}
          </div>
          <a href={payUrl} target="_blank" rel="noopener noreferrer" style={{
            width: '100%', padding: '14px', fontSize: '16px', fontWeight: 700,
            background: s.accent, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none',
          }}>
            {section.cta_label} <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ section, theme }: { section: Extract<PageSection, { type: 'testimonials' }>; theme: string }) {
  const s = THEME_STYLES[theme] || THEME_STYLES.modern;
  return (
    <section style={{ padding: '64px 32px', background: s.bg, color: s.text }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {section.title && <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '40px', textAlign: 'center' }}>{section.title}</h2>}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(3, section.items.length)}, 1fr)`, gap: '20px' }}>
          {section.items.map((item) => (
            <div key={item.id} style={{ padding: '24px', background: s.cardBg, border: `1px solid ${s.cardBorder}`, borderRadius: '8px' }}>
              <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
                {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={14} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <p style={{ fontSize: '14px', lineHeight: 1.6, opacity: 0.8, marginBottom: '16px', fontStyle: 'italic' }}>&ldquo;{item.content}&rdquo;</p>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>{item.name}</div>
              <div style={{ fontSize: '12px', opacity: 0.5 }}>{item.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ section, theme }: { section: Extract<PageSection, { type: 'faq' }>; theme: string }) {
  const s = THEME_STYLES[theme] || THEME_STYLES.modern;
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <section style={{ padding: '64px 32px', background: s.sectionAlt, color: s.text }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        {section.title && <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '32px', textAlign: 'center' }}>{section.title}</h2>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {section.items.map((item) => (
            <div key={item.id} style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}`, borderRadius: '8px', overflow: 'hidden' }}>
              <button
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                style={{
                  width: '100%', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontFamily: 'inherit', fontSize: '15px', fontWeight: 600, textAlign: 'left',
                }}
              >
                {item.question}
                <ChevronDown size={16} style={{ transform: openId === item.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
              </button>
              {openId === item.id && (
                <div style={{ padding: '0 20px 16px', fontSize: '14px', lineHeight: 1.6, opacity: 0.7 }}>{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterSection({ section, theme }: { section: Extract<PageSection, { type: 'footer' }>; theme: string }) {
  const s = THEME_STYLES[theme] || THEME_STYLES.modern;
  return (
    <footer style={{ padding: '32px', background: theme === 'dark' || theme === 'neon' ? '#050505' : '#111', color: '#888', borderTop: `1px solid ${s.cardBorder}` }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: s.text, marginBottom: '4px' }}>{section.brand_name}</div>
          <div style={{ fontSize: '12px', opacity: 0.5 }}>{section.tagline}</div>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          {section.links.map((l) => (
            <a key={l.id} href={l.url} style={{ fontSize: '12px', color: '#888', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {l.label} <ExternalLink size={10} />
            </a>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: '960px', margin: '16px auto 0', textAlign: 'center', fontSize: '11px', opacity: 0.3 }}>
        Powered by Locus Studio &mdash; BuildWithLocus
      </div>
    </footer>
  );
}

export default function PublicSitePage() {
  const params = useParams();
  const id = params.id as string;
  const [page, setPage] = useState<PageConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      console.log('[Site] Starting load for:', id);
      try {
        const res = await fetch(`/api/sites?username=${id}`);
        console.log('[Site] Response status:', res.status);
        
        if (!res.ok) {
          console.log('[Site] Response not ok');
          setLoading(false);
          return;
        }
        
        const data = await res.json();
        console.log('[Site] Data received:', Object.keys(data));
        
        if (data.sections && data.sections.length > 0) {
          setPage(data);
        } else {
          console.log('[Site] No sections in data');
        }
      } catch (err) {
        console.error('[Site] Error:', err);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0c', color: '#f8f9fa' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '24px', height: '24px', border: '2px solid #333', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ opacity: 0.6, fontSize: '14px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0c', color: '#f8f9fa' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>404</h1>
          <p style={{ opacity: 0.6 }}>Site not found</p>
          <Link href="/" style={{ display: 'inline-block', marginTop: '20px', color: '#6366f1', textDecoration: 'underline' }}>Back to Studio</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: THEME_STYLES[page.theme]?.bg || '#fff' }}>
      <title>{page.title} &mdash; Locus Studio</title>
      {page.sections.map((section) => (
        <React.Fragment key={section.id}>
          {section.type === 'hero' && <HeroSection section={section} theme={page.theme} />}
          {section.type === 'features' && <FeaturesSection section={section} theme={page.theme} />}
          {section.type === 'pricing' && <PricingSection section={section} theme={page.theme} />}
          {section.type === 'checkout' && <CheckoutSectionPublic section={section} theme={page.theme} />}
          {section.type === 'testimonials' && <TestimonialsSection section={section} theme={page.theme} />}
          {section.type === 'faq' && <FaqSection section={section} theme={page.theme} />}
          {section.type === 'footer' && <FooterSection section={section} theme={page.theme} />}
        </React.Fragment>
      ))}
    </div>
  );
}