'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';
import { SiteConfig, Block } from '@/agents/state';
import '@/styles/themes.css';

const STORAGE_KEY = 'locus_studio_site_v1';
const SHARED_SITES_KEY = 'locus_shared_sites';

type SharedSites = Record<string, SiteConfig>;

function getSharedSites(): SharedSites {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(SHARED_SITES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function BlockRenderer({ block, site }: { block: Block; site: SiteConfig }) {
  if (!block.visible) return null;

  if (block.type === 'profile') {
    return (
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${site.branding.primary_color}, #a855f7)`,
            padding: '3px',
            margin: '0 auto 12px',
          }}
        >
          <img
            src={block.avatar_url || '/logo.png'}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
              background: 'var(--site-bg)',
            }}
          />
        </div>
        <h1 style={{ fontSize: '1.3rem', fontWeight: '800' }}>{block.name}</h1>
        {block.bio && (
          <p style={{ fontSize: '0.9rem', opacity: 0.6, marginTop: '4px' }}>{block.bio}</p>
        )}
      </div>
    );
  }

  if (block.type === 'link') {
    return (
      <a
        href={block.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          background: 'var(--block-bg)',
          border: '1px solid var(--block-border)',
          boxShadow: 'var(--block-shadow)',
          borderRadius: '12px',
          color: 'var(--site-text)',
          textDecoration: 'none',
        }}
      >
        <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{block.title}</span>
        <ExternalLink size={16} opacity={0.6} />
      </a>
    );
  }

  if (block.type === 'checkout') {
    return (
      <div
        style={{
          padding: '20px',
          background: 'var(--block-bg)',
          border: '1px solid var(--block-border)',
          boxShadow: 'var(--block-shadow)',
          borderRadius: '12px',
          borderLeft: `4px solid ${site.branding.primary_color}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              color: site.branding.primary_color,
            }}
          >
            Locus Pay
          </span>
          <ShieldCheck size={16} color={site.branding.primary_color} />
        </div>
        <button
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '10px',
            border: 'none',
            background: site.branding.primary_color,
            color: 'white',
            fontWeight: '700',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          Pay Now <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  return null;
}

function loadSite(id: string): SiteConfig | null {
  const shared = getSharedSites();
  if (shared[id]) return shared[id];

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.siteConfig && parsed.siteConfig.username === id) {
        return parsed.siteConfig;
      }
    }
  } catch {}

  return null;
}

export default function SitePage() {
  const params = useParams();
  const id = params.id as string;
  const [site] = useState<SiteConfig | null>(() => loadSite(id));

  if (!site) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0c',
          color: '#f8f9fa',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>404</h1>
          <p style={{ opacity: 0.6 }}>Site not found</p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              marginTop: '20px',
              color: '#6366f1',
              textDecoration: 'underline',
            }}
          >
            Back to Studio
          </Link>
        </div>
      </div>
    );
  }

  const themeClass = `theme-${site.theme}`;
  const fontClass = `font-${site.font}`;
  const layoutClass = `layout-${site.layout}`;

  return (
    <div
      className={`${themeClass} ${fontClass}`}
      style={{
        minHeight: '100vh',
        background: 'var(--site-bg)',
        color: 'var(--site-text)',
        fontFamily: 'inherit',
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          padding: '40px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          minHeight: '100vh',
        }}
      >
        {site.title && (
          <title>{site.title}</title>
        )}

        {site.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} site={site} />
        ))}

        <div
          className={layoutClass}
          style={{ paddingBottom: '40px' }}
        >
          {site.blocks
            .filter((b) => b.visible && b.type !== 'profile')
            .map((block) => (
              <BlockRenderer key={block.id} block={block} site={site} />
            ))}
        </div>

        <div
          style={{
            marginTop: 'auto',
            textAlign: 'center',
            padding: '20px',
            opacity: 0.3,
            fontSize: '0.7rem',
          }}
        >
          Powered by Locus Checkout Studio
        </div>
      </div>
    </div>
  );
}
