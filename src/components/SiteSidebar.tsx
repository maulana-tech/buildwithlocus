'use client';

import React, { useState } from 'react';
import { User, Link as LinkIcon, ShoppingCart, Trash2, Eye, Palette, Type, Layout as LayoutIcon } from 'lucide-react';
import type { SiteConfig, ProfileBlock, LinkBlock, CheckoutBlock } from '@/agents/state';

type ThemeType = SiteConfig['theme'];
type FontType = SiteConfig['font'];
type LayoutType = SiteConfig['layout'];

interface SiteSidebarProps {
  site: SiteConfig;
  onChange: (site: SiteConfig) => void;
  onPreview: () => void;
  onPublish: () => void;
}

export const SiteSidebar: React.FC<SiteSidebarProps> = ({ site, onChange, onPreview, onPublish }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');

  const addBlock = (type: "profile" | "link" | "checkout") => {
    let newBlock: ProfileBlock | LinkBlock | CheckoutBlock;

    if (type === 'profile') {
      newBlock = { id: Math.random().toString(36).substr(2, 9), type, visible: true, name: 'New Name', bio: 'New Bio' };
    } else if (type === 'link') {
      newBlock = { id: Math.random().toString(36).substr(2, 9), type, visible: true, title: 'New Link', url: 'https://' };
    } else {
      newBlock = { id: Math.random().toString(36).substr(2, 9), type, visible: true, widget_id: 'wgt_default' };
    }

    onChange({ ...site, blocks: [...site.blocks, newBlock] });
  };

  const removeBlock = (id: string) => {
    onChange({ ...site, blocks: site.blocks.filter(b => b.id !== id) });
  };

  const updateBlock = (id: string, updates: Record<string, string>) => {
    onChange({
      ...site,
      blocks: site.blocks.map(b => b.id === id ? { ...b, ...updates } : b)
    });
  };

  return (
    <aside className="glass" style={{ width: '400px', height: 'calc(100vh - 40px)', margin: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 className="gradient-text" style={{ fontSize: '1.4rem' }}>Site Builder</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onPreview} className="glass" style={{ padding: '8px', cursor: 'pointer' }} title="Preview">
            <Eye size={16} />
          </button>
          <button onClick={onPublish} className="glow-button" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            Publish
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px' }}>
        <button 
          onClick={() => setActiveTab('content')}
          style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: activeTab === 'content' ? 'var(--primary)' : 'transparent', color: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
        >
          Content
        </button>
        <button 
          onClick={() => setActiveTab('design')}
          style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: activeTab === 'design' ? 'var(--primary)' : 'transparent', color: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
        >
          Design
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'content' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: 'bold' }}>USERNAME</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                <span style={{ opacity: 0.4 }}>locus.sh/s/</span>
                <input 
                  type="text" 
                  value={site.username}
                  onChange={(e) => onChange({ ...site, username: e.target.value })}
                  style={{ flex: 1, background: 'none', border: 'none', color: 'white', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LayoutIcon size={14} /> BLOCKS
              </h3>
              {site.blocks.map((block) => (
                <div key={block.id} className="glass" style={{ padding: '14px', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase' }}>{block.type}</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => removeBlock(block.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', opacity: 0.6 }}><Trash2 size={14} /></button>
                    </div>
                  </div>
                  {block.type === 'profile' && (
                    <input 
                      type="text" value={block.name} onChange={(e) => updateBlock(block.id, { name: e.target.value })}
                      placeholder="Name" style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white', marginBottom: '8px' }}
                    />
                  )}
                  {block.type === 'link' && (
                    <input 
                      type="text" value={block.title} onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                      placeholder="Title" style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}
                    />
                  )}
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <button onClick={() => addBlock('profile')} className="glass" style={{ padding: '12px 4px', fontSize: '0.65rem', cursor: 'pointer' }}><User size={14} style={{ marginBottom: '4px' }} /><br/>Profile</button>
                <button onClick={() => addBlock('link')} className="glass" style={{ padding: '12px 4px', fontSize: '0.65rem', cursor: 'pointer' }}><LinkIcon size={14} style={{ marginBottom: '4px' }} /><br/>Link</button>
                <button onClick={() => addBlock('checkout')} className="glass" style={{ padding: '12px 4px', fontSize: '0.65rem', cursor: 'pointer' }}><ShoppingCart size={14} style={{ marginBottom: '4px' }} /><br/>Checkout</button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Palette size={14} /> THEME
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {['modern', 'retro', 'dark', 'glass', 'neon'].map(t => (
                  <button 
                    key={t}
                    onClick={() => onChange({ ...site, theme: t as ThemeType })}
                    style={{ 
                      padding: '12px', borderRadius: '10px', border: site.theme === t ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                      background: 'rgba(255,255,255,0.03)', color: 'white', cursor: 'pointer', textTransform: 'capitalize', fontSize: '0.8rem'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </section>

            <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Type size={14} /> FONT
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {['inter', 'playfair', 'mono', 'space'].map(f => (
                  <button 
                    key={f}
                    onClick={() => onChange({ ...site, font: f as FontType })}
                    style={{ 
                      padding: '12px', borderRadius: '10px', border: site.font === f ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                      background: 'rgba(255,255,255,0.03)', color: 'white', cursor: 'pointer', textTransform: 'capitalize', fontSize: '0.8rem',
                      fontFamily: f === 'mono' ? 'monospace' : f === 'playfair' ? 'serif' : 'sans-serif'
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </section>

            <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LayoutIcon size={14} /> LAYOUT
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['stack', 'grid'].map(l => (
                  <button 
                    key={l}
                    onClick={() => onChange({ ...site, layout: l as LayoutType })}
                    style={{ 
                      flex: 1, padding: '12px', borderRadius: '10px', border: site.layout === l ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                      background: 'rgba(255,255,255,0.03)', color: 'white', cursor: 'pointer', textTransform: 'capitalize', fontSize: '0.8rem'
                    }}
                  >
                    {l === 'stack' ? 'List View' : 'Grid View'}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </aside>
  );
};
