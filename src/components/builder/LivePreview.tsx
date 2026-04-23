'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  LayoutGrid,
  DollarSign,
  ShoppingCart,
  MessageSquareQuote,
  HelpCircle,
  PanelBottom,
  Star,
  ChevronDown,
  ExternalLink,
  Monitor,
  Smartphone,
  ZoomIn,
  ZoomOut,
  ArrowRight,
} from 'lucide-react';
import type { PageSection, PageConfig } from '@/agents/state';

const THEME_STYLES: Record<string, { bg: string; text: string; accent: string; cardBg: string; cardBorder: string; sectionAlt: string }> = {
  modern: { bg: '#ffffff', text: '#111111', accent: '#b7d941', cardBg: '#f8f9fa', cardBorder: '#e5e7eb', sectionAlt: '#f8f9fa' },
  dark: { bg: '#0f0f10', text: '#fdfdfd', accent: '#b7d941', cardBg: '#1b1b1c', cardBorder: '#2a2a2b', sectionAlt: '#141415' },
  retro: { bg: '#faf7f2', text: '#2d2418', accent: '#d97706', cardBg: '#f5f0e8', cardBorder: '#e2d9c8', sectionAlt: '#f0ebe3' },
  glass: { bg: '#0f172a', text: '#e2e8f0', accent: '#38bdf8', cardBg: 'rgba(255,255,255,0.05)', cardBorder: 'rgba(255,255,255,0.1)', sectionAlt: '#0c1322' },
  neon: { bg: '#0a0a0a', text: '#e0e0e0', accent: '#a855f7', cardBg: '#141414', cardBorder: '#262626', sectionAlt: '#0e0e0e' },
};

const SECTION_ICONS: Record<string, React.ReactNode> = {
  hero: <Sparkles size={12} />,
  features: <LayoutGrid size={12} />,
  pricing: <DollarSign size={12} />,
  checkout: <ShoppingCart size={12} />,
  testimonials: <MessageSquareQuote size={12} />,
  faq: <HelpCircle size={12} />,
  footer: <PanelBottom size={12} />,
};

function HeroPreview({ section, theme }: { section: Extract<PageSection, { type: 'hero' }>; theme: string }) {
  const s = THEME_STYLES[theme] || THEME_STYLES.modern;
  return (
    <div style={{ padding: '48px 32px', textAlign: section.alignment, background: s.bg, color: s.text, minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: section.alignment === 'center' ? 'center' : section.alignment === 'right' ? 'flex-end' : 'flex-start' }}>
      <div style={{ maxWidth: '720px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, lineHeight: 1.1, marginBottom: '8px' }}>{section.headline}</h2>
        <p style={{ fontSize: '12px', opacity: 0.7, marginBottom: '16px', lineHeight: 1.6 }}>{section.subtext}</p>
        {section.cta_label && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: s.accent, color: theme === 'dark' || theme === 'glass' || theme === 'neon' ? '#0f0f10' : '#fff', padding: '10px 24px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>
            {section.cta_label} <ArrowRight size={12} />
          </span>
        )}
      </div>
    </div>
  );
}

function FeaturesPreview({ section, theme }: { section: Extract<PageSection, { type: 'features' }>; theme: string }) {
  const s = THEME_STYLES[theme] || THEME_STYLES.modern;
  return (
    <div style={{ padding: '32px', background: s.sectionAlt, color: s.text }}>
      {section.title && <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>{section.title}</h3>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${section.columns}, 1fr)`, gap: '12px' }}>
        {section.items.map((item) => (
          <div key={item.id} style={{ padding: '16px', background: s.cardBg, border: `1px solid ${s.cardBorder}` }}>
            <div style={{ fontSize: '16px', marginBottom: '6px' }}>{item.icon || '\u25CF'}</div>
            <div style={{ fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>{item.title}</div>
            <div style={{ fontSize: '9px', opacity: 0.65, lineHeight: 1.4 }}>{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingPreview({ section, theme }: { section: Extract<PageSection, { type: 'pricing' }>; theme: string }) {
  const s = THEME_STYLES[theme] || THEME_STYLES.modern;
  return (
    <div style={{ padding: '32px', background: s.sectionAlt, color: s.text }}>
      {section.title && <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>{section.title}</h3>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(section.columns, section.plans.length)}, 1fr)`, gap: '12px' }}>
        {section.plans.map((plan) => (
          <div key={plan.id} style={{ padding: '20px', background: s.cardBg, border: plan.highlighted ? `2px solid ${s.accent}` : `1px solid ${s.cardBorder}`, textAlign: 'center' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>{plan.name}</div>
            <div style={{ fontSize: '20px', fontWeight: 800 }}>{plan.price}<span style={{ fontSize: '10px', fontWeight: 400, opacity: 0.6 }}>/{plan.period}</span></div>
            <div style={{ margin: '10px 0', textAlign: 'left' }}>
              {plan.features.map((f, i) => <div key={i} style={{ fontSize: '9px', padding: '3px 0', opacity: 0.7 }}>&#10003; {f}</div>)}
            </div>
            <span style={{ display: 'inline-block', background: plan.highlighted ? s.accent : s.cardBg, color: plan.highlighted ? (theme === 'dark' || theme === 'glass' || theme === 'neon' ? '#0f0f10' : '#fff') : 'inherit', padding: '6px 14px', fontSize: '10px', fontWeight: 600, border: plan.highlighted ? 'none' : `1px solid ${s.cardBorder}` }}>
              {plan.cta_label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckoutPreview({ section, theme }: { section: Extract<PageSection, { type: 'checkout' }>; theme: string }) {
  const s = THEME_STYLES[theme] || THEME_STYLES.modern;
  return (
    <div style={{ padding: '32px', background: s.sectionAlt, color: s.text, textAlign: 'center' }}>
      {section.title && <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{section.title}</h3>}
      <p style={{ fontSize: '10px', opacity: 0.6, marginBottom: '12px' }}>{section.description}</p>
      <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '4px', fontFamily: 'monospace' }}>{section.amount.toLocaleString()}</div>
      <div style={{ fontSize: '10px', opacity: 0.5, marginBottom: '12px' }}>{section.currency}</div>
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
        {section.payment_methods.map((m) => <span key={m} style={{ fontSize: '9px', padding: '3px 8px', background: s.cardBg, border: `1px solid ${s.cardBorder}` }}>{m}</span>)}
      </div>
      <span style={{ display: 'inline-block', background: s.accent, color: theme === 'dark' || theme === 'glass' || theme === 'neon' ? '#0f0f10' : '#fff', padding: '10px 28px', fontSize: '12px', fontWeight: 700 }}>
        {section.cta_label}
      </span>
    </div>
  );
}

function TestimonialsPreview({ section, theme }: { section: Extract<PageSection, { type: 'testimonials' }>; theme: string }) {
  const s = THEME_STYLES[theme] || THEME_STYLES.modern;
  return (
    <div style={{ padding: '32px', background: s.sectionAlt, color: s.text }}>
      {section.title && <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>{section.title}</h3>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(3, section.items.length)}, 1fr)`, gap: '12px' }}>
        {section.items.map((item) => (
          <div key={item.id} style={{ padding: '16px', background: s.cardBg, border: `1px solid ${s.cardBorder}` }}>
            <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
              {[1, 2, 3, 4, 5].map((st) => <Star key={st} size={10} fill="#f59e0b" color="#f59e0b" />)}
            </div>
            <p style={{ fontSize: '9px', lineHeight: 1.5, opacity: 0.8, marginBottom: '10px', fontStyle: 'italic' }}>&ldquo;{item.content}&rdquo;</p>
            <div style={{ fontSize: '10px', fontWeight: 700 }}>{item.name}</div>
            <div style={{ fontSize: '8px', opacity: 0.5 }}>{item.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FaqPreview({ section, theme }: { section: Extract<PageSection, { type: 'faq' }>; theme: string }) {
  const s = THEME_STYLES[theme] || THEME_STYLES.modern;
  return (
    <div style={{ padding: '32px', background: s.sectionAlt, color: s.text }}>
      {section.title && <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>{section.title}</h3>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {section.items.map((item) => (
          <div key={item.id} style={{ padding: '12px', background: s.cardBg, border: `1px solid ${s.cardBorder}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: 700 }}>{item.question}</span>
              <ChevronDown size={12} opacity={0.5} />
            </div>
            <p style={{ fontSize: '9px', opacity: 0.6, marginTop: '6px', lineHeight: 1.4 }}>{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FooterPreview({ section, theme }: { section: Extract<PageSection, { type: 'footer' }>; theme: string }) {
  const s = THEME_STYLES[theme] || THEME_STYLES.modern;
  return (
    <div style={{ padding: '24px 32px', background: s.bg, color: s.text, opacity: 0.6, borderTop: `1px solid ${s.cardBorder}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>{section.brand_name}</div>
          <div style={{ fontSize: '8px', opacity: 0.6 }}>{section.tagline}</div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {section.links.map((l) => <span key={l.id} style={{ fontSize: '8px', display: 'flex', alignItems: 'center', gap: '3px' }}>{l.label} <ExternalLink size={7} /></span>)}
        </div>
      </div>
    </div>
  );
}

type Props = {
  page: PageConfig;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function LivePreview({ page, selectedId, onSelect }: Props) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [zoom, setZoom] = useState(100);

  const viewportWidth = device === 'mobile' ? 375 : 900;
  const viewportPadding = device === 'mobile' ? 12 : 32;
  const s = THEME_STYLES[page.theme] || THEME_STYLES.modern;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0a0a0b' }}>
      <div style={{ display: 'flex', gap: '8px', padding: '8px 16px', background: '#0f0f10', borderBottom: '1px solid #2a2a2b', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '1px', background: '#1b1b1c', padding: '2px' }}>
          <button onClick={() => setDevice('desktop')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '26px', border: 'none', background: device === 'desktop' ? '#242425' : 'transparent', color: device === 'desktop' ? '#fdfdfd' : '#666668', cursor: 'pointer' }} title="Desktop">
            <Monitor size={13} />
          </button>
          <button onClick={() => setDevice('mobile')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '26px', border: 'none', background: device === 'mobile' ? '#242425' : 'transparent', color: device === 'mobile' ? '#fdfdfd' : '#666668', cursor: 'pointer' }} title="Mobile">
            <Smartphone size={13} />
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: '#1b1b1c', padding: '2px' }}>
          <button onClick={() => setZoom(Math.max(50, zoom - 10))} disabled={zoom <= 50} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '26px', border: 'none', background: 'transparent', color: zoom <= 50 ? '#333' : '#a0a0a2', cursor: zoom <= 50 ? 'not-allowed' : 'pointer' }}>
            <ZoomOut size={13} />
          </button>
          <span style={{ fontSize: '10px', width: '36px', textAlign: 'center', color: '#666668', fontFamily: 'monospace' }}>{zoom}%</span>
          <button onClick={() => setZoom(Math.min(150, zoom + 10))} disabled={zoom >= 150} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '26px', border: 'none', background: 'transparent', color: zoom >= 150 ? '#333' : '#a0a0a2', cursor: zoom >= 150 ? 'not-allowed' : 'pointer' }}>
            <ZoomIn size={13} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '24px', display: 'flex', justifyContent: 'center', backgroundImage: 'radial-gradient(circle at 1px 1px, #1b1b1c 1px, transparent 0)', backgroundSize: '20px 20px' }}>
        <div style={{ width: `${viewportWidth}px`, transform: `scale(${zoom / 100})`, transformOrigin: 'top center', transition: 'width 0.2s ease', border: `1px solid ${s.cardBorder}`, background: s.bg }}>
          {page.sections.length === 0 && (
            <div style={{ padding: '80px 32px', textAlign: 'center', color: '#666668', fontSize: '13px' }}>
              No sections yet. Add from the left panel.
            </div>
          )}
          {page.sections.map((section) => (
            <div
              key={section.id}
              onClick={() => onSelect(section.id)}
              style={{ position: 'relative', cursor: 'pointer', outline: selectedId === section.id ? `2px solid ${s.accent}` : '2px solid transparent', outlineOffset: '-2px', transition: 'outline-color 0.15s' }}
            >
              <div style={{ position: 'absolute', top: '6px', right: '6px', display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 8px', fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', background: 'rgba(0,0,0,0.75)', color: '#fdfdfd', zIndex: 5, opacity: selectedId === section.id ? 1 : 0, transition: 'opacity 0.15s', pointerEvents: 'none' }}>
                {SECTION_ICONS[section.type]}
                <span>{section.type}</span>
              </div>
              {section.type === 'hero' && <HeroPreview section={section} theme={page.theme} />}
              {section.type === 'features' && <FeaturesPreview section={section} theme={page.theme} />}
              {section.type === 'pricing' && <PricingPreview section={section} theme={page.theme} />}
              {section.type === 'checkout' && <CheckoutPreview section={section} theme={page.theme} />}
              {section.type === 'testimonials' && <TestimonialsPreview section={section} theme={page.theme} />}
              {section.type === 'faq' && <FaqPreview section={section} theme={page.theme} />}
              {section.type === 'footer' && <FooterPreview section={section} theme={page.theme} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
