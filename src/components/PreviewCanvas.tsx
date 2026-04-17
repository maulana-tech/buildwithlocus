'use client';

import React from 'react';
import { ShieldCheck, Zap, ArrowRight } from 'lucide-react';

import { WidgetConfig } from '@/agents/state';

interface PreviewCanvasProps {
  config: WidgetConfig;
}

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({ config }) => {
  return (
    <main style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #1a1a2e 0%, #0a0a0c 100%)' }}>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Live Preview</h1>
        <p style={{ opacity: 0.6 }}>See how your widget looks to your customers</p>
      </div>

      {/* Widget Container */}
      <div className="glass animate-fade-in" style={{ width: '400px', padding: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={config.branding.logo_url || '/logo.png'} alt="Merchant Logo" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
            <span style={{ fontWeight: '600' }}>Store Name</span>
          </div>
          <ShieldCheck size={20} color={config.branding.primary_color} />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
            {config.amount.type === 'fixed' 
              ? `IDR ${config.amount.value.toLocaleString()}` 
              : 'Enter Amount'}
          </h2>
          <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>Checkout with Locus</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', opacity: 0.8 }}>Choose Payment Method</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {config.payment_methods.length > 0 ? config.payment_methods.map((method: string) => (
              <div key={method} style={{ padding: '8px', border: '1px solid var(--glass-border)', borderRadius: '8px', textAlign: 'center', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', textTransform: 'uppercase' }}>
                {method.replace('_', ' ')}
              </div>
            )) : (
              <div style={{ gridColumn: 'span 3', padding: '12px', opacity: 0.5, fontSize: '0.8rem', textAlign: 'center' }}>
                No methods selected
              </div>
            )}
          </div>
        </div>

        <button 
          style={{ 
            width: '100%', 
            padding: '16px', 
            borderRadius: '12px', 
            border: 'none', 
            backgroundColor: config.branding.primary_color, 
            color: 'white', 
            fontWeight: '700', 
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'default',
            boxShadow: `0 8px 20px ${config.branding.primary_color}44`
          }}
        >
          {config.branding.button_label}
          <ArrowRight size={18} />
        </button>

        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: 0.4, fontSize: '0.75rem' }}>
          <Zap size={12} fill="currentColor" />
          <span>Powered by BuildWithLocus</span>
        </div>
      </div>
    </main>
  );
};
