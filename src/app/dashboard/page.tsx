'use client';

import React, { useState, useCallback } from 'react';
import { Send, Eye, Palette } from 'lucide-react';

import { SectionPalette } from '@/components/builder/SectionPalette';
import { LivePreview } from '@/components/builder/LivePreview';
import { PropertyPanel } from '@/components/builder/PropertyPanel';
import { PublishModal } from '@/components/PublishModal';
import type { PageConfig, PageSection, SectionType } from '@/agents/state';
import '@/styles/builder.css';

const STORAGE_KEY = 'locus_page_builder_v1';
const SHARED_SITES_KEY = 'locus_shared_sites';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function loadPage(): PageConfig | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function savePage(page: PageConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(page));
}

function createSection(type: SectionType): PageSection {
  const id = uid();
  switch (type) {
    case 'hero':
      return { id, type, headline: 'Welcome to My Store', subtext: 'The best products at the best prices.', cta_label: 'Shop Now', cta_url: '#', alignment: 'center' };
    case 'features':
      return {
        id, type, title: 'Why Choose Us', columns: 3,
        items: [
          { id: uid(), icon: '⚡', title: 'Fast Delivery', description: 'Get your order in 24 hours.' },
          { id: uid(), icon: '🔒', title: 'Secure Payment', description: 'Protected by PayWithLocus.' },
          { id: uid(), icon: '💬', title: '24/7 Support', description: 'We are always here to help.' },
        ],
      };
    case 'pricing':
      return {
        id, type, title: 'Pricing Plans', columns: 3,
        plans: [
          { id: uid(), name: 'Starter', price: 'Free', period: 'mo', features: ['1 product', 'Basic checkout'], cta_label: 'Get Started', highlighted: false },
          { id: uid(), name: 'Pro', price: '$9', period: 'mo', features: ['10 products', 'Custom branding', 'Analytics'], cta_label: 'Go Pro', highlighted: true },
          { id: uid(), name: 'Enterprise', price: '$29', period: 'mo', features: ['Unlimited products', 'Priority support', 'API access'], cta_label: 'Contact Us', highlighted: false },
        ],
      };
    case 'checkout':
      return { id, type, title: 'Complete Your Purchase', description: 'Secure checkout powered by PayWithLocus.', amount: 150000, currency: 'IDR', payment_methods: ['QRIS', 'Bank Transfer', 'E-Wallet'], cta_label: 'Pay Now' };
    case 'testimonials':
      return {
        id, type, title: 'What Customers Say',
        items: [
          { id: uid(), name: 'Andi S.', role: 'Small Business Owner', content: 'Super easy to set up. Payments started flowing in minutes.' },
          { id: uid(), name: 'Maya R.', role: 'Freelancer', content: 'Finally a checkout tool that does not need a developer.' },
          { id: uid(), name: 'Budi K.', role: 'E-commerce Founder', content: 'The visual builder is a game changer for our team.' },
        ],
      };
    case 'faq':
      return {
        id, type, title: 'Frequently Asked Questions',
        items: [
          { id: uid(), question: 'How do I receive payments?', answer: 'Payments are processed through PayWithLocus and deposited to your linked bank account.' },
          { id: uid(), question: 'Is there a setup fee?', answer: 'No. Locus Studio is completely free to use. You only pay transaction fees.' },
          { id: uid(), question: 'Can I customize the checkout page?', answer: 'Yes! Use the visual builder to match your brand colors, fonts, and layout.' },
        ],
      };
    case 'footer':
      return {
        id, type, brand_name: 'My Store', tagline: 'Built with Locus Studio',
        links: [
          { id: uid(), label: 'Privacy', url: '#' },
          { id: uid(), label: 'Terms', url: '#' },
        ],
        socials: [
          { id: uid(), platform: 'twitter', url: '#' },
        ],
      };
  }
}

const DEFAULT_PAGE: PageConfig = {
  id: 'page_1',
  username: 'my_store',
  title: 'My Store',
  theme: 'modern',
  primary_color: '#6366f1',
  sections: [
    createSection('hero'),
    createSection('features'),
    createSection('checkout'),
    createSection('footer'),
  ],
};

export default function BuilderPage() {
  const [page, setPage] = useState<PageConfig>(() => loadPage() ?? DEFAULT_PAGE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');

  const handlePageChange = useCallback((next: PageConfig) => {
    setPage(next);
    savePage(next);
  }, []);

  const handleAddSection = useCallback((type: SectionType) => {
    const section = createSection(type);
    setPage((prev) => {
      const next = { ...prev, sections: [...prev.sections, section] };
      savePage(next);
      return next;
    });
    setSelectedId(section.id);
  }, []);

  const handleDeleteSection = useCallback((id: string) => {
    setPage((prev) => {
      const next = { ...prev, sections: prev.sections.filter((s) => s.id !== id) };
      savePage(next);
      return next;
    });
    setSelectedId((prev) => (prev === id ? null : prev));
  }, []);

  const handlePublish = useCallback(async () => {
    const sharedSites: Record<string, PageConfig & { published_at?: string }> = JSON.parse(
      localStorage.getItem(SHARED_SITES_KEY) || '{}'
    );
    sharedSites[page.username] = { ...page, published_at: new Date().toISOString() };
    localStorage.setItem(SHARED_SITES_KEY, JSON.stringify(sharedSites));

    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page),
      });
      const data = await res.json();
      if (data.url) {
        setPublishedUrl(data.url);
      } else {
        setPublishedUrl(`${window.location.origin}/s/${page.username}`);
      }
    } catch {
      setPublishedUrl(`${window.location.origin}/s/${page.username}`);
    }

    setIsPublishOpen(true);
  }, [page]);

  const cycleTheme = useCallback(() => {
    const themes: PageConfig['theme'][] = ['modern', 'dark', 'retro', 'glass', 'neon'];
    const idx = themes.indexOf(page.theme);
    const next = themes[(idx + 1) % themes.length];
    handlePageChange({ ...page, theme: next });
  }, [page, handlePageChange]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#09090b', color: '#ededef' }}>
      <header style={{
        height: '48px',
        borderBottom: '1px solid #1e1e22',
        background: '#111113',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: '12px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/logo.png" alt="" style={{ width: '20px', height: '20px' }} />
          <span style={{ fontWeight: 600, fontSize: '13px' }}>Locus Studio</span>
        </div>

        <div style={{ width: '1px', height: '20px', background: '#1e1e22' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: '#55555e' }}>locus.sh/s/</span>
          <input
            value={page.username}
            onChange={(e) => handlePageChange({ ...page, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
            style={{
              background: '#09090b',
              border: '1px solid #1e1e22',
              borderRadius: '3px',
              padding: '4px 8px',
              color: '#ededef',
              fontSize: '12px',
              width: '120px',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <div style={{ flex: 1 }} />

        <button onClick={cycleTheme} className="builder-props-action" title={`Theme: ${page.theme}`}>
          <Palette size={13} />
        </button>

        <button
          onClick={() => window.open(`/s/${page.username}`, '_blank')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            fontSize: '12px',
            fontWeight: 500,
            background: 'transparent',
            border: '1px solid #1e1e22',
            borderRadius: '4px',
            color: '#8b8b94',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <Eye size={13} />
          Preview
        </button>

        <button
          onClick={handlePublish}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 14px',
            fontSize: '12px',
            fontWeight: 600,
            background: '#6366f1',
            border: 'none',
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <Send size={13} />
          Publish
        </button>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <SectionPalette onAdd={handleAddSection} />
        <LivePreview page={page} selectedId={selectedId} onSelect={setSelectedId} />
        <PropertyPanel page={page} selectedId={selectedId} onChange={handlePageChange} onDelete={handleDeleteSection} />
      </div>

      <PublishModal
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        siteUrl={publishedUrl || `/s/${page.username}`}
      />
    </div>
  );
}
