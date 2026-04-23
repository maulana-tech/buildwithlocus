'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Layers, Plus, ArrowRight, DollarSign, Eye, ShoppingCart, Zap, ExternalLink, Send, Sparkles, Loader2, Play, Save, Pencil, Check, Copy, CreditCard, AlertCircle } from 'lucide-react';

import { AppNavbar } from '@/components/AppNavbar';
import { SectionPalette } from '@/components/builder/SectionPalette';
import { LivePreview } from '@/components/builder/LivePreview';
import { PropertyPanel } from '@/components/builder/PropertyPanel';
import { PublishModal } from '@/components/PublishModal';
import type { PageConfig, PageSection, SectionType } from '@/agents/state';
import '@/styles/builder.css';

const STORAGE_KEY = 'locus_page_builder_v1';
const SHARED_SITES_KEY = 'locus_shared_sites';
const DEFAULT_REPO = 'maulana-tech/buildwithlocus';

const DEMO_SITE: PageConfig = {
  id: 'demo_1',
  username: 'coffee_shop',
  title: 'Kopi Nusantara',
  theme: 'dark',
  primary_color: '#b7d941',
  sections: [],
};

function buildDemoSections(): PageSection[] {
  const id = uid;
  return [
    { id: id(), type: 'hero', headline: 'Kopi Nusantara', subtext: 'Premium Indonesian coffee, delivered to your door. Fresh beans from Toraja, Gayo, and Kintamani.', cta_label: 'Order Now', cta_url: '#', alignment: 'center' },
    { id: id(), type: 'features', title: 'Why Our Coffee', columns: 3, items: [
      { id: id(), icon: '☕', title: 'Single Origin', description: 'Sourced directly from farmers in Toraja, Gayo, and Kintamani highlands.' },
      { id: id(), icon: '🌱', title: 'Organic', description: '100% organic beans, no pesticides, shade-grown naturally.' },
      { id: id(), icon: '🚀', title: 'Fresh Roasted', description: 'Roasted to order and shipped within 24 hours.' },
    ] },
    { id: id(), type: 'checkout', title: 'Order Your Coffee', description: 'Pay securely with crypto via PayWithLocus.', amount: 25, currency: 'USDC', payment_methods: ['Locus Wallet', 'MetaMask', 'AI Agent'], cta_label: 'Pay 25 USDC' },
    { id: id(), type: 'testimonials', title: 'What Customers Say', items: [
      { id: id(), name: 'Andi S.', role: 'Coffee Enthusiast', content: 'Best Toraja coffee I have ever had. Fresh and aromatic.' },
      { id: id(), name: 'Maya R.', role: 'Cafe Owner', content: 'We switched all our beans to Kopi Nusantara. Customers love it.' },
      { id: id(), name: 'Budi K.', role: 'Digital Nomad', content: 'Finally, great coffee delivered with crypto payment. So easy!' },
    ] },
    { id: id(), type: 'faq', title: 'FAQ', items: [
      { id: id(), question: 'How do I pay?', answer: 'We accept USDC payments via PayWithLocus. Connect your wallet and pay in one click.' },
      { id: id(), question: 'Where do you ship?', answer: 'Worldwide shipping via DHL. Free shipping for orders above $50.' },
      { id: id(), question: 'Is the coffee organic?', answer: 'Yes, 100% organic and fair trade certified.' },
    ] },
    { id: id(), type: 'footer', brand_name: 'Kopi Nusantara', tagline: 'Built with Locus Studio', links: [{ id: id(), label: 'Privacy', url: '#' }, { id: id(), label: 'Terms', url: '#' }], socials: [] },
  ];
}

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
      return { id, type, title: 'Why Choose Us', columns: 3, items: [{ id: uid(), icon: '⚡', title: 'Fast Delivery', description: 'Get your order in 24 hours.' }, { id: uid(), icon: '🔒', title: 'Secure Payment', description: 'Protected by PayWithLocus.' }, { id: uid(), icon: '💬', title: '24/7 Support', description: 'We are always here to help.' }] };
    case 'pricing':
      return { id, type, title: 'Pricing Plans', columns: 3, plans: [{ id: uid(), name: 'Starter', price: 'Free', period: 'mo', features: ['1 product', 'Basic checkout'], cta_label: 'Get Started', highlighted: false }, { id: uid(), name: 'Pro', price: '$9', period: 'mo', features: ['10 products', 'Custom branding', 'Analytics'], cta_label: 'Go Pro', highlighted: true }, { id: uid(), name: 'Enterprise', price: '$29', period: 'mo', features: ['Unlimited products', 'Priority support', 'API access'], cta_label: 'Contact Us', highlighted: false }] };
    case 'checkout':
      return { id, type, title: 'Complete Your Purchase', description: 'Secure checkout powered by PayWithLocus.', amount: 150000, currency: 'IDR', payment_methods: ['QRIS', 'Bank Transfer', 'E-Wallet'], cta_label: 'Pay Now' };
    case 'testimonials':
      return { id, type, title: 'What Customers Say', items: [{ id: uid(), name: 'Andi S.', role: 'Small Business Owner', content: 'Super easy to set up.' }, { id: uid(), name: 'Maya R.', role: 'Freelancer', content: 'Finally a checkout tool that works.' }, { id: uid(), name: 'Budi K.', role: 'E-commerce Founder', content: 'Game changer for our team.' }] };
    case 'faq':
      return { id, type, title: 'Frequently Asked Questions', items: [{ id: uid(), question: 'How do I receive payments?', answer: 'Through PayWithLocus.' }, { id: uid(), question: 'Is there a setup fee?', answer: 'No, free to use.' }, { id: uid(), question: 'Can I customize?', answer: 'Yes, fully customizable.' }] };
    case 'footer':
      return { id, type, brand_name: 'My Store', tagline: 'Built with Locus Studio', links: [{ id: uid(), label: 'Privacy', url: '#' }, { id: uid(), label: 'Terms', url: '#' }], socials: [] };
  }
}

const DEFAULT_PAGE: PageConfig = {
  id: 'page_1',
  username: 'my_store',
  title: 'My Store',
  theme: 'modern',
  primary_color: '#b7d941',
  sections: [createSection('hero'), createSection('features'), createSection('checkout'), createSection('footer')],
};

type SiteAnalytics = {
  username: string;
  title: string;
  published_at: string;
  views: number;
  transactions: Array<{ id: string; method: string; amount: number; status: string; created_at: string }>;
  revenue: number;
  currency: string;
};

type Summary = {
  totalRevenue: number;
  totalViews: number;
  totalTransactions: number;
  currency: string;
};

function formatNumber(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

function formatDate(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const s = {
  container: { display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#0f0f10', color: '#fdfdfd' } as React.CSSProperties,
  main: { flex: 1, overflow: 'auto', padding: '32px' } as React.CSSProperties,
  inner: { maxWidth: '1200px', margin: '0 auto' } as React.CSSProperties,
  heading: { fontSize: '22px', fontWeight: 500, letterSpacing: '-0.005em', marginBottom: '4px', color: '#fdfdfd' } as React.CSSProperties,
  subtext: { color: '#a0a0a2', fontSize: '13px', marginBottom: '32px', lineHeight: 1.55 } as React.CSSProperties,
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', marginBottom: '32px', background: '#2a2a2b', border: '1px solid #2a2a2b' } as React.CSSProperties,
  actions: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', marginBottom: '32px', background: '#2a2a2b', border: '1px solid #2a2a2b' } as React.CSSProperties,
  sectionTitle: { fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: '#666668', marginBottom: '16px' } as React.CSSProperties,
  sitesList: { display: 'flex', flexDirection: 'column', gap: '1px', background: '#2a2a2b', border: '1px solid #2a2a2b' } as React.CSSProperties,
  siteRow: { background: '#1b1b1c', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as React.CSSProperties,
  emptyState: { padding: '64px', background: '#1b1b1c', border: '1px solid #2a2a2b', textAlign: 'center' as const } as React.CSSProperties,
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{ height: '100vh', background: '#0f0f10', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666668' }}>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'builder'>(() =>
    searchParams?.get('demo') === '1' ? 'builder' : 'dashboard'
  );
  const [page, setPage] = useState<PageConfig>(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('demo') === '1') {
      return { ...DEMO_SITE, sections: buildDemoSections() };
    }
    return loadPage() ?? DEFAULT_PAGE;
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [sites, setSites] = useState<SiteAnalytics[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishLoading, setPublishLoading] = useState(false);
  const [plAmount, setPlAmount] = useState('');
  const [plCurrency, setPlCurrency] = useState('USD');
  const [plDescription, setPlDescription] = useState('');
  const [plLoading, setPlLoading] = useState(false);
  const [plResult, setPlResult] = useState<{ url: string; sessionId: string } | null>(null);
  const [plError, setPlError] = useState<string | null>(null);
  const [plCopied, setPlCopied] = useState(false);

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
    setPublishLoading(true);
    setPublishError(null);
    const sharedSites = JSON.parse(localStorage.getItem(SHARED_SITES_KEY) || '{}');
    sharedSites[page.username] = { ...page, published_at: new Date().toISOString() };
    localStorage.setItem(SHARED_SITES_KEY, JSON.stringify(sharedSites));
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...page, repo: DEFAULT_REPO }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.error || 'Publish failed');
        setPublishedUrl(`${window.location.origin}/s/${page.username}`);
      } else {
        setPublishedUrl(data.url || `${window.location.origin}/s/${page.username}`);
      }
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : 'Network error');
      setPublishedUrl(`${window.location.origin}/s/${page.username}`);
    } finally {
      setPublishLoading(false);
      setIsPublishOpen(true);
    }
  }, [page]);

  const startDemo = useCallback(() => {
    const demo = { ...DEMO_SITE, sections: buildDemoSections() };
    setPage(demo);
    savePage(demo);
    setSelectedId(demo.sections[0]?.id || null);
    setActiveTab('builder');
  }, []);

  const cycleTheme = useCallback(() => {
    const themes: PageConfig['theme'][] = ['modern', 'dark', 'retro', 'glass', 'neon'];
    const idx = themes.indexOf(page.theme);
    handlePageChange({ ...page, theme: themes[(idx + 1) % themes.length] });
  }, [page, handlePageChange]);

  const handleSave = useCallback(() => {
    savePage(page);
    const now = new Date();
    setSavedAt(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    setTimeout(() => setSavedAt(null), 3000);
  }, [page]);

  const handleEditSite = useCallback((site: SiteAnalytics) => {
    const sharedSites = JSON.parse(localStorage.getItem(SHARED_SITES_KEY) || '{}');
    const siteData = sharedSites[site.username];
    if (siteData) {
      setPage(siteData);
      savePage(siteData);
      setSelectedId(siteData.sections?.[0]?.id || null);
    } else {
      setPage({ ...DEFAULT_PAGE, username: site.username, title: site.title });
    }
    setActiveTab('builder');
  }, []);

  const handleCreatePaymentLink = useCallback(async () => {
    if (!plAmount || parseFloat(plAmount) <= 0) {
      setPlError('Enter a valid amount');
      return;
    }
    setPlLoading(true);
    setPlError(null);
    setPlResult(null);
    try {
      const res = await fetch('/api/payment-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: plAmount,
          currency: plCurrency,
          description: plDescription || `Payment ${plAmount} ${plCurrency}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create payment link');
      setPlResult({ url: data.checkoutUrl, sessionId: data.sessionId });
    } catch (err) {
      setPlError(err instanceof Error ? err.message : 'Failed to create payment link');
    } finally {
      setPlLoading(false);
    }
  }, [plAmount, plCurrency, plDescription]);

  const handleAiGenerate = useCallback(async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const keywords = aiPrompt.toLowerCase();
    const types: SectionType[] = [];
    if (keywords.includes('hero') || keywords.includes('landing')) types.push('hero');
    if (keywords.includes('feature') || keywords.includes('benefit')) types.push('features');
    if (keywords.includes('price') || keywords.includes('pricing')) types.push('pricing');
    if (keywords.includes('checkout') || keywords.includes('pay')) types.push('checkout');
    if (keywords.includes('testimonial') || keywords.includes('review')) types.push('testimonials');
    if (keywords.includes('faq') || keywords.includes('question')) types.push('faq');
    if (keywords.includes('footer')) types.push('footer');
    if (types.length === 0) types.push('hero', 'features', 'checkout', 'footer');
    const newSections = types.map(createSection);
    setPage(prev => ({ ...prev, sections: newSections }));
    setSelectedId(newSections[0]?.id || null);
    savePage({ ...page, sections: newSections });
    setAiPrompt('');
    setIsAiLoading(false);
  }, [aiPrompt, page]);

  return (
    <div style={s.container}>
      <AppNavbar activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'dashboard' ? (
        <div style={s.main}>
          <div style={s.inner}>
            <h1 style={s.heading}>Dashboard</h1>
            <p style={s.subtext}>Overview of your sites and performance</p>

            <div style={s.statGrid}>
              <StatCard icon={<DollarSign size={16} />} label="Revenue" value={summary ? `${summary.currency} ${summary.totalRevenue}` : '$0'} accent />
              <StatCard icon={<ShoppingCart size={16} />} label="Transactions" value={summary?.totalTransactions || 0} />
              <StatCard icon={<Eye size={16} />} label="Views" value={summary ? formatNumber(summary.totalViews) : '0'} />
              <StatCard icon={<Layers size={16} />} label="Sites" value={sites.length} />
            </div>

            <div style={s.actions}>
              <button onClick={() => setActiveTab('builder')} style={{ padding: '20px', background: '#b7d941', color: '#0f0f10', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', cursor: 'pointer', textAlign: 'left' as const }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', fontSize: '13px', fontWeight: 600, letterSpacing: '-0.005em' }}><Zap size={16} /> New Site</div>
                  <p style={{ fontSize: '11px', opacity: 0.7, lineHeight: 1.5 }}>Build with AI or from scratch</p>
                </div>
                <ArrowRight size={16} />
              </button>
              <button onClick={startDemo} style={{ padding: '20px', background: '#1b1b1c', color: '#fdfdfd', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', cursor: 'pointer', textAlign: 'left' as const, width: '100%' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', fontSize: '13px', fontWeight: 600, letterSpacing: '-0.005em' }}><Play size={16} /> Try Demo</div>
                  <p style={{ fontSize: '11px', color: '#666668', lineHeight: 1.5 }}>Start with a pre-built coffee shop</p>
                </div>
                <ArrowRight size={16} color="#666668" />
              </button>
            </div>

            <div>
              <div style={s.sectionTitle}>Your Sites</div>
              {sites.length === 0 ? (
                <div style={s.emptyState}>
                  <Layers size={32} style={{ color: '#2a2a2b', marginBottom: '12px' }} />
                  <p style={{ color: '#666668', marginBottom: '20px', fontSize: '13px' }}>No published sites yet</p>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button onClick={startDemo} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#b7d941', color: '#0f0f10', padding: '10px 20px', border: 'none', fontSize: '11px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}><Play size={14} /> Start with Demo</button>
                    <button onClick={() => setActiveTab('builder')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'transparent', color: '#a0a0a2', padding: '10px 20px', border: '1px solid #2a2a2b', fontSize: '11px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}><Plus size={14} /> Create Site</button>
                  </div>
                </div>
              ) : (
                <div style={s.sitesList}>
                  {sites.map(site => (
                    <div key={site.username} style={s.siteRow}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', background: '#242425', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Layers size={16} color="#666668" />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#fdfdfd' }}>{site.title}</span>
                            <span style={{ fontSize: '10px', color: '#666668', background: '#242425', padding: '2px 6px', fontFamily: 'monospace' }}>{site.username}</span>
                          </div>
                          <div style={{ fontSize: '11px', color: '#666668' }}>{formatDate(site.published_at)}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ display: 'flex', gap: '24px' }}>
                          <div style={{ textAlign: 'right' as const }}>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: '#b7d941', fontFamily: 'monospace' }}>{site.revenue}</div>
                            <div style={{ fontSize: '9px', color: '#666668', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Revenue</div>
                          </div>
                          <div style={{ textAlign: 'right' as const }}>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: '#fdfdfd', fontFamily: 'monospace' }}>{site.views}</div>
                            <div style={{ fontSize: '9px', color: '#666668', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Views</div>
                          </div>
                        </div>
                        <div style={{ width: '1px', height: '24px', background: '#2a2a2b' }} />
                        <button onClick={() => handleEditSite(site)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: 'transparent', border: '1px solid #2a2a2b', color: '#a0a0a2', fontSize: '11px', cursor: 'pointer', fontWeight: 500, letterSpacing: '0.03em' }}>
                          <Pencil size={12} /> Edit
                        </button>
                        <a href={`/s/${site.username}`} target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: 'transparent', border: '1px solid #2a2a2b', color: '#a0a0a2', fontSize: '11px', textDecoration: 'none', fontWeight: 500, letterSpacing: '0.03em' }}>
                          <ExternalLink size={12} /> View
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: '32px' }}>
              <div style={s.sectionTitle}>Create Payment Link</div>
              <div style={{ background: '#1b1b1c', border: '1px solid #2a2a2b', padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', color: '#666668', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px', fontWeight: 500 }}>Amount</label>
                    <input value={plAmount} onChange={(e) => setPlAmount(e.target.value)} placeholder="0.00" type="number" step="any" style={{ width: '100%', background: '#0f0f10', border: '1px solid #2a2a2b', padding: '8px 12px', color: '#fdfdfd', fontSize: '13px', outline: 'none', fontFamily: 'monospace' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', color: '#666668', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px', fontWeight: 500 }}>Currency</label>
                    <select value={plCurrency} onChange={(e) => setPlCurrency(e.target.value)} style={{ width: '100%', background: '#0f0f10', border: '1px solid #2a2a2b', padding: '8px 12px', color: '#fdfdfd', fontSize: '13px', outline: 'none' }}>
                      <option value="USD">USD</option>
                      <option value="USDC">USDC</option>
                      <option value="IDR">IDR</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', color: '#666668', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px', fontWeight: 500 }}>Description</label>
                    <input value={plDescription} onChange={(e) => setPlDescription(e.target.value)} placeholder="e.g. Premium Subscription" style={{ width: '100%', background: '#0f0f10', border: '1px solid #2a2a2b', padding: '8px 12px', color: '#fdfdfd', fontSize: '13px', outline: 'none' }} />
                  </div>
                </div>
                <button onClick={handleCreatePaymentLink} disabled={plLoading || !plAmount} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: '#b7d941', border: 'none', color: '#0f0f10', fontSize: '11px', fontWeight: 600, cursor: plLoading ? 'wait' : 'pointer', letterSpacing: '0.03em', textTransform: 'uppercase' as const, opacity: plLoading || !plAmount ? 0.5 : 1 }}>
                  {plLoading ? <Loader2 size={12} className="spin" /> : <CreditCard size={12} />} {plLoading ? 'Creating...' : 'Create Payment Link'}
                </button>
                {plError && (
                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <AlertCircle size={14} color="#ef4444" />
                    <span style={{ fontSize: '12px', color: '#ef4444' }}>{plError}</span>
                  </div>
                )}
                {plResult && (
                  <div style={{ marginTop: '12px', padding: '14px', background: '#0f0f10', border: '1px solid #2a2a2b' }}>
                    <div style={{ fontSize: '10px', color: '#666668', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', fontWeight: 500 }}>Payment Link Created</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input readOnly value={plResult.url} style={{ flex: 1, background: '#1b1b1c', border: '1px solid #2a2a2b', padding: '8px 12px', color: '#b7d941', fontSize: '12px', fontFamily: 'monospace', outline: 'none' }} />
                      <button onClick={() => { navigator.clipboard.writeText(plResult.url); setPlCopied(true); setTimeout(() => setPlCopied(false), 2000); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', background: '#242425', border: '1px solid #2a2a2b', color: '#fdfdfd', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
                        {plCopied ? <Check size={12} color="#b7d941" /> : <Copy size={12} />} {plCopied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <div style={{ fontSize: '10px', color: '#666668', marginTop: '6px', fontFamily: 'monospace' }}>Session: {plResult.sessionId}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ height: '44px', flexShrink: 0, borderBottom: '1px solid #2a2a2b', background: '#1b1b1c', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()} placeholder="AI: Describe your page..." style={{ background: '#0f0f10', border: '1px solid #2a2a2b', padding: '6px 12px', color: '#fdfdfd', fontSize: '12px', width: '220px', outline: 'none' }} />
              <button onClick={handleAiGenerate} disabled={isAiLoading || !aiPrompt.trim()} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', fontSize: '11px', fontWeight: 600, background: '#b7d941', border: 'none', color: '#0f0f10', cursor: isAiLoading ? 'wait' : 'pointer', letterSpacing: '0.03em' }}>
                {isAiLoading ? <Loader2 size={12} className="spin" /> : <Sparkles size={12} />} Generate
              </button>
            </div>
            <div style={{ width: '1px', height: '20px', background: '#2a2a2b' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '11px', color: '#666668', fontFamily: 'monospace' }}>locus.sh/s/</span>
              <input value={page.username} onChange={(e) => handlePageChange({ ...page, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })} style={{ background: '#0f0f10', border: '1px solid #2a2a2b', padding: '6px 10px', color: '#fdfdfd', fontSize: '12px', width: '120px', outline: 'none', fontFamily: 'monospace' }} />
            </div>
            <div style={{ flex: 1 }} />
            <button onClick={cycleTheme} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'transparent', border: '1px solid #2a2a2b', color: '#a0a0a2', fontSize: '11px', cursor: 'pointer', textTransform: 'capitalize' as const, letterSpacing: '0.03em' }}>Theme: {page.theme}</button>
            <button onClick={() => window.open(`/s/${page.username}`, '_blank')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '11px', fontWeight: 500, background: 'transparent', border: '1px solid #2a2a2b', color: '#a0a0a2', cursor: 'pointer' }}><Eye size={14} /> Preview</button>
            <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', fontSize: '11px', fontWeight: 600, background: savedAt ? '#1b3a1b' : 'transparent', border: savedAt ? '1px solid #2a5a2a' : '1px solid #2a2a2b', color: savedAt ? '#b7d941' : '#a0a0a2', cursor: 'pointer', letterSpacing: '0.03em' }}>
              {savedAt ? <Check size={13} /> : <Save size={13} />} {savedAt ? `Saved ${savedAt}` : 'Save'}
            </button>
            <button onClick={handlePublish} disabled={publishLoading} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', fontSize: '11px', fontWeight: 600, background: '#b7d941', border: 'none', color: '#0f0f10', cursor: publishLoading ? 'wait' : 'pointer', letterSpacing: '0.03em', opacity: publishLoading ? 0.7 : 1 }}>
              {publishLoading ? <Loader2 size={13} className="spin" /> : <Send size={13} />} {publishLoading ? 'Publishing...' : 'Publish'}
            </button>
            {publishError && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#ef4444' }}><AlertCircle size={12} />{publishError}</span>}
          </div>
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <SectionPalette onAdd={handleAddSection} />
            <LivePreview page={page} selectedId={selectedId} onSelect={setSelectedId} />
            <PropertyPanel page={page} selectedId={selectedId} onChange={handlePageChange} onDelete={handleDeleteSection} />
          </div>
        </div>
      )}

      <PublishModal isOpen={isPublishOpen} onClose={() => setIsPublishOpen(false)} siteUrl={publishedUrl || `/s/${page.username}`} />
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string | number; accent?: boolean }) {
  return (
    <div style={{ background: '#1b1b1c', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div style={{ width: '28px', height: '28px', background: accent ? 'rgba(183, 217, 65, 0.1)' : '#242425', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent ? '#b7d941' : '#a0a0a2' }}>
          {icon}
        </div>
        <span style={{ fontSize: '10px', color: '#666668', textTransform: 'uppercase' as const, letterSpacing: '0.06em', fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'monospace', color: accent ? '#b7d941' : '#fdfdfd' }}>{value}</div>
    </div>
  );
}
