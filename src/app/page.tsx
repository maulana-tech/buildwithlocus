'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { PreviewCanvas } from '@/components/PreviewCanvas';
import { SiteSidebar } from '@/components/SiteSidebar';
import { SitePreview } from '@/components/SitePreview';
import { PublishModal } from '@/components/PublishModal';
import { startAgents } from '@/agents';
import { WidgetConfig, SiteConfig } from '@/agents/state';
import { Layout, Globe } from 'lucide-react';

const STORAGE_KEY = 'locus_studio_site_v1';

function loadSavedState() {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved) as { siteConfig: SiteConfig; widgetConfig: WidgetConfig };
  } catch {
    return null;
  }
}

const DEFAULT_WIDGET: WidgetConfig = {
  widget_id: 'wgt_demo',
  merchant_id: 'mer_123',
  branding: { logo_url: '/logo.png', primary_color: '#6366f1', button_label: 'Pay Now' },
  payment_methods: ['QRIS', 'bank_transfer'],
  amount: { type: 'fixed', value: 150000, currency: 'IDR' },
  redirects: { success_url: 'https://example.com/success', failure_url: 'https://example.com/failure' }
};

const DEFAULT_SITE: SiteConfig = {
  id: 'site_123',
  username: 'demo_store',
  title: 'My Locus Store',
  theme: 'glass',
  font: 'inter',
  layout: 'stack',
  branding: { primary_color: '#6366f1' },
  blocks: [
    { id: 'p1', type: 'profile', visible: true, name: 'Locus Demo Store', bio: 'Premium checkout for everyone.', avatar_url: '/logo.png' },
    { id: 'l1', type: 'link', visible: true, title: 'Follow us on X', url: 'https://x.com/paywithlocus' }
  ]
};

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<'widget' | 'site'>('widget');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>(() => {
    if (typeof window === 'undefined') return DEFAULT_WIDGET;
    const saved = loadSavedState();
    return saved?.widgetConfig ?? DEFAULT_WIDGET;
  });
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    if (typeof window === 'undefined') return DEFAULT_SITE;
    const saved = loadSavedState();
    return saved?.siteConfig ?? DEFAULT_SITE;
  });

  const [agents] = useState<ReturnType<typeof startAgents>>(() => startAgents());
  const [publishedUrl, setPublishedUrl] = useState<string>('');

  const SHARED_SITES_KEY = 'locus_shared_sites';

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ siteConfig, widgetConfig }));
  }, [siteConfig, widgetConfig]);

  const handleWidgetChange = (key: string, value: unknown) => {
    const newConfig = { ...widgetConfig, [key]: value } as WidgetConfig;
    setWidgetConfig(newConfig);
    if (agents?.builder) agents.builder.saveConfig(newConfig);
  };

  const handleSiteChange = (newSite: SiteConfig) => {
    setSiteConfig(newSite);
    if (agents?.builder) agents.builder.saveSite(newSite);
  };

  const handlePublish = async () => {
    const sharedSites: Record<string, SiteConfig & { published_at?: string }> = JSON.parse(localStorage.getItem(SHARED_SITES_KEY) || '{}');
    sharedSites[siteConfig.username] = {
      ...siteConfig,
      published_at: new Date().toISOString(),
    };
    localStorage.setItem(SHARED_SITES_KEY, JSON.stringify(sharedSites));

    const url = `${window.location.origin}/s/${siteConfig.username}`;
    setPublishedUrl(url);
    setIsPublishModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)', color: 'white' }}>
      {/* Global Navigation */}
      <nav style={{ width: '80px', borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', padding: '40px 0' }}>
        <img src="/logo.png" style={{ width: '40px' }} alt="Locus" />
        <div onClick={() => setActiveTab('widget')} style={{ cursor: 'pointer', opacity: activeTab === 'widget' ? 1 : 0.4, transition: '0.2s' }}><Layout size={24} /></div>
        <div onClick={() => setActiveTab('site')} style={{ cursor: 'pointer', opacity: activeTab === 'site' ? 1 : 0.4, transition: '0.2s' }}><Globe size={24} /></div>
      </nav>

      <div style={{ flex: 1, display: 'flex' }}>
        {activeTab === 'widget' ? (
          <>
            <Sidebar config={widgetConfig} onChange={handleWidgetChange} onPublish={() => setIsPublishModalOpen(true)} />
            <PreviewCanvas config={widgetConfig} />
          </>
        ) : (
          <>
            <SiteSidebar site={siteConfig} onChange={handleSiteChange} onPreview={() => window.open(`/s/${siteConfig.username}`, '_blank')} onPublish={handlePublish} />
            <SitePreview site={siteConfig} />
          </>
        )}
      </div>

      <PublishModal 
        isOpen={isPublishModalOpen} 
        onClose={() => setIsPublishModalOpen(false)} 
        siteUrl={publishedUrl || `/s/${siteConfig.username}`}
      />
    </div>
  );
}
