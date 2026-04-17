'use client';

import React from 'react';
import { ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';
import { SiteConfig, ProfileBlock, LinkBlock } from '@/agents/state';
import '@/styles/themes.css';

interface SitePreviewProps {
  site: SiteConfig;
}

export const SitePreview: React.FC<SitePreviewProps> = ({ site }) => {
  const themeClass = `theme-${site.theme}`;
  const fontClass = `font-${site.font}`;
  const layoutClass = `layout-${site.layout}`;

  return (
    <main 
      className={fontClass}
      style={{ 
        flex: 1, 
        padding: '40px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'radial-gradient(circle at center, #1a1a2e 0%, #0a0a0c 100%)', 
        overflowY: 'auto' 
      }}
    >
      {/* Mobile Frame Container */}
      <div 
        className={`glass animate-fade-in ${themeClass}`} 
        style={{ 
          width: '380px', 
          height: '750px', 
          padding: '24px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '24px', 
          boxShadow: 'var(--block-shadow)', 
          border: '8px solid rgba(255,255,255,0.05)',
          borderRadius: '40px',
          overflowY: 'auto',
          position: 'relative',
          background: 'var(--site-bg)',
          color: 'var(--site-text)'
        }}
      >
        {/* Site Header */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          {site.blocks.find(b => b.type === 'profile' && b.visible) ? (
            site.blocks.filter(b => b.type === 'profile' && b.visible).map((block) => {
              const profile = block as ProfileBlock;
              return (
              <div key={block.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `linear-gradient(135deg, ${site.branding.primary_color}, #a855f7)`, padding: '3px' }}>
                  <img src={profile.avatar_url || '/logo.png'} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', background: 'var(--site-bg)' }} alt="Avatar" />
                </div>
                <div>
                  <h1 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{profile.name}</h1>
                  <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>{profile.bio}</p>
                </div>
              </div>
              );
            })
          ) : (
            <div>
              <h1 style={{ fontSize: '1.2rem', fontWeight: '800' }}>@{site.username}</h1>
            </div>
          )}
        </div>

        {/* Dynamic Blocks Container with Layout class */}
        <div className={layoutClass} style={{ paddingBottom: '40px' }}>
          {site.blocks.filter(b => b.visible).map((block) => {
            if (block.type === 'link') {
              const link = block as LinkBlock;
              return (
                <a 
                  key={block.id} 
                  href={link.url} 
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
                    textAlign: site.layout === 'stack' ? 'left' : 'center'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <span style={{ fontWeight: '600', fontSize: '0.9rem', width: '100%' }}>{link.title}</span>
                  {site.layout === 'stack' && <ExternalLink size={16} opacity={0.6} />}
                </a>
              );
            }

            if (block.type === 'checkout') {
              return (
                <div 
                  key={block.id} 
                  style={{ 
                    gridColumn: site.layout === 'grid' ? 'span 2' : 'span 1',
                    padding: '20px', 
                    background: 'var(--block-bg)',
                    border: '1px solid var(--block-border)',
                    boxShadow: 'var(--block-shadow)',
                    borderRadius: '12px',
                    borderLeft: `4px solid ${site.branding.primary_color}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: site.branding.primary_color }}>Locus Flow</span>
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
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    Pay Now <ArrowRight size={14} />
                  </button>
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 'auto', textAlign: 'center', padding: '20px', opacity: 0.4, fontSize: '0.7rem' }}>
          Build with Locus Checkout Studio
        </div>
      </div>
    </main>
  );
};
