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
} from 'lucide-react';
import type { PageSection, PageConfig } from '@/agents/state';

const SECTION_ICONS: Record<string, React.ReactNode> = {
  hero: <Sparkles size={12} />,
  features: <LayoutGrid size={12} />,
  pricing: <DollarSign size={12} />,
  checkout: <ShoppingCart size={12} />,
  testimonials: <MessageSquareQuote size={12} />,
  faq: <HelpCircle size={12} />,
  footer: <PanelBottom size={12} />,
};

function HeroPreview({ section, theme }: { section: Extract<PageSection, { type: 'hero' }>; theme: PageConfig['theme'] }) {
  const isDark = theme === 'dark' || theme === 'neon';
  return (
    <div style={{
      padding: '48px 32px',
      textAlign: section.alignment,
      background: section.background_image ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${section.background_image}) center/cover` : isDark ? '#111' : '#fff',
      color: isDark ? '#fff' : '#111',
      minHeight: '180px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', lineHeight: 1.1 }}>{section.headline}</h2>
      <p style={{ fontSize: '12px', opacity: 0.7, marginBottom: '16px' }}>{section.subtext}</p>
      {section.cta_label && (
        <div>
          <span style={{ display: 'inline-block', background: isDark ? '#fff' : '#111', color: isDark ? '#111' : '#fff', padding: '8px 20px', fontSize: '11px', fontWeight: 700, borderRadius: '4px' }}>
            {section.cta_label}
          </span>
        </div>
      )}
    </div>
  );
}

function FeaturesPreview({ section, theme }: { section: Extract<PageSection, { type: 'features' }>; theme: PageConfig['theme'] }) {
  const isDark = theme === 'dark' || theme === 'neon';
  return (
    <div style={{ padding: '32px', background: isDark ? '#0a0a0a' : '#fafafa', color: isDark ? '#fff' : '#111' }}>
      {section.title && <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>{section.title}</h3>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${section.columns}, 1fr)`, gap: '12px' }}>
        {section.items.map((item) => (
          <div key={item.id} style={{ padding: '16px', background: isDark ? '#161618' : '#fff', border: `1px solid ${isDark ? '#222' : '#eee'}`, borderRadius: '6px' }}>
            <div style={{ fontSize: '16px', marginBottom: '6px' }}>{item.icon || '●'}</div>
            <div style={{ fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>{item.title}</div>
            <div style={{ fontSize: '9px', opacity: 0.6, lineHeight: 1.4 }}>{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingPreview({ section, theme }: { section: Extract<PageSection, { type: 'pricing' }>; theme: PageConfig['theme'] }) {
  const isDark = theme === 'dark' || theme === 'neon';
  return (
    <div style={{ padding: '32px', background: isDark ? '#0a0a0a' : '#fafafa', color: isDark ? '#fff' : '#111' }}>
      {section.title && <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>{section.title}</h3>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(section.columns, section.plans.length)}, 1fr)`, gap: '12px' }}>
        {section.plans.map((plan) => (
          <div key={plan.id} style={{
            padding: '20px',
            background: plan.highlighted ? (isDark ? '#1a1a2e' : '#eef2ff') : (isDark ? '#161618' : '#fff'),
            border: plan.highlighted ? '2px solid #6366f1' : `1px solid ${isDark ? '#222' : '#eee'}`,
            borderRadius: '6px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>{plan.name}</div>
            <div style={{ fontSize: '20px', fontWeight: 800 }}>{plan.price}<span style={{ fontSize: '10px', fontWeight: 400, opacity: 0.6 }}>/{plan.period}</span></div>
            <div style={{ margin: '10px 0', textAlign: 'left' }}>
              {plan.features.map((f, i) => (
                <div key={i} style={{ fontSize: '9px', padding: '3px 0', opacity: 0.7 }}>✓ {f}</div>
              ))}
            </div>
            <span style={{ display: 'inline-block', background: plan.highlighted ? '#6366f1' : (isDark ? '#222' : '#eee'), color: plan.highlighted ? '#fff' : 'inherit', padding: '6px 14px', fontSize: '10px', fontWeight: 600, borderRadius: '4px' }}>
              {plan.cta_label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckoutPreview({ section, theme }: { section: Extract<PageSection, { type: 'checkout' }>; theme: PageConfig['theme'] }) {
  const isDark = theme === 'dark' || theme === 'neon';
  return (
    <div style={{ padding: '32px', background: isDark ? '#0a0a0a' : '#fafafa', color: isDark ? '#fff' : '#111', textAlign: 'center' }}>
      {section.title && <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{section.title}</h3>}
      <p style={{ fontSize: '10px', opacity: 0.6, marginBottom: '12px' }}>{section.description}</p>
      <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>
        {section.currency} {section.amount.toLocaleString()}
      </div>
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
        {section.payment_methods.map((m) => (
          <span key={m} style={{ fontSize: '9px', padding: '3px 8px', background: isDark ? '#161618' : '#eee', borderRadius: '3px', border: `1px solid ${isDark ? '#222' : '#ddd'}` }}>{m}</span>
        ))}
      </div>
      <span style={{ display: 'inline-block', background: '#6366f1', color: '#fff', padding: '10px 28px', fontSize: '12px', fontWeight: 700, borderRadius: '6px' }}>
        {section.cta_label}
      </span>
    </div>
  );
}

function TestimonialsPreview({ section, theme }: { section: Extract<PageSection, { type: 'testimonials' }>; theme: PageConfig['theme'] }) {
  const isDark = theme === 'dark' || theme === 'neon';
  return (
    <div style={{ padding: '32px', background: isDark ? '#0a0a0a' : '#fafafa', color: isDark ? '#fff' : '#111' }}>
      {section.title && <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>{section.title}</h3>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(3, section.items.length)}, 1fr)`, gap: '12px' }}>
        {section.items.map((item) => (
          <div key={item.id} style={{ padding: '16px', background: isDark ? '#161618' : '#fff', border: `1px solid ${isDark ? '#222' : '#eee'}`, borderRadius: '6px' }}>
            <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={10} fill="#f59e0b" color="#f59e0b" />)}
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

function FaqPreview({ section, theme }: { section: Extract<PageSection, { type: 'faq' }>; theme: PageConfig['theme'] }) {
  const isDark = theme === 'dark' || theme === 'neon';
  return (
    <div style={{ padding: '32px', background: isDark ? '#0a0a0a' : '#fafafa', color: isDark ? '#fff' : '#111' }}>
      {section.title && <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>{section.title}</h3>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {section.items.map((item) => (
          <div key={item.id} style={{ padding: '12px', background: isDark ? '#161618' : '#fff', border: `1px solid ${isDark ? '#222' : '#eee'}`, borderRadius: '6px' }}>
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

function FooterPreview({ section, theme }: { section: Extract<PageSection, { type: 'footer' }>; theme: PageConfig['theme'] }) {
  const isDark = theme === 'dark' || theme === 'neon';
  return (
    <div style={{ padding: '24px 32px', background: isDark ? '#050505' : '#111', color: '#999', borderTop: `1px solid ${isDark ? '#1a1a1a' : '#222'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#ccc' : '#fff', marginBottom: '4px' }}>{section.brand_name}</div>
          <div style={{ fontSize: '8px', opacity: 0.6 }}>{section.tagline}</div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {section.links.map((l) => (
            <span key={l.id} style={{ fontSize: '8px', display: 'flex', alignItems: 'center', gap: '3px' }}>{l.label} <ExternalLink size={7} /></span>
          ))}
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
  const containerPadding = 24;
  const viewportPadding = device === 'mobile' ? 12 : 32;

  return (
    <div className="builder-preview">
      <div className="builder-preview-toolbar">
        <div style={{ display: 'flex', gap: '2px', background: '#1a1a1e', padding: '2px', borderRadius: '4px' }}>
          <button
            onClick={() => setDevice('desktop')}
            className={`builder-preview-toolbar-btn ${device === 'desktop' ? 'active' : ''}`}
            title="Desktop"
          >
            <Monitor size={14} />
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`builder-preview-toolbar-btn ${device === 'mobile' ? 'active' : ''}`}
            title="Mobile"
          >
            <Smartphone size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: '#1a1a1e', padding: '2px', borderRadius: '4px' }}>
          <button
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            disabled={zoom <= 50}
            className="builder-preview-toolbar-btn"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <span style={{ fontSize: '10px', width: '36px', textAlign: 'center', color: '#71717a' }}>{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(150, zoom + 10))}
            disabled={zoom >= 150}
            className="builder-preview-toolbar-btn"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
        </div>
      </div>

      <div
        className="builder-preview-viewport"
        style={{
          padding: containerPadding,
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflow: 'auto',
        }}
      >
        <div
          className="builder-preview-scroll"
          style={{
            width: `${viewportWidth}px`,
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'width 0.2s ease',
          }}
        >
          {page.sections.length === 0 && (
            <div className="builder-preview-empty" style={{ padding: viewportPadding }}>
              <p>No sections yet.</p>
              <p style={{ fontSize: '12px', opacity: 0.5, marginTop: '4px' }}>Add sections from the left panel.</p>
            </div>
          )}
          {page.sections.map((section) => (
            <div
              key={section.id}
              className={`builder-preview-section ${selectedId === section.id ? 'selected' : ''}`}
              onClick={() => onSelect(section.id)}
              style={{ padding: viewportPadding }}
            >
              <div className="builder-preview-section-badge">
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
