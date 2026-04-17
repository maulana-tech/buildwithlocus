'use client';

import React from 'react';
import { Settings, Palette, CreditCard, Send } from 'lucide-react';
import { WidgetConfig } from '@/agents/state';

interface SidebarProps {
  config: WidgetConfig;
  onChange: (key: string, value: unknown) => void;
  onPublish: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ config, onChange, onPublish }) => {
  return (
    <aside className="glass" style={{ width: '350px', height: 'calc(100vh - 40px)', margin: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src="/logo.png" alt="Locus Logo" style={{ width: '32px', height: '32px' }} />
        <h2 className="gradient-text" style={{ fontSize: '1.2rem' }}>Checkout Studio</h2>
      </div>

      {/* Branding Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '600' }}>
          <Palette size={18} />
          <h3>Branding</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '0.9rem', opacity: 0.8 }}>Primary Color</label>
          <input 
            type="color" 
            value={config.branding.primary_color} 
            onChange={(e) => onChange('branding', { ...config.branding, primary_color: e.target.value })}
            style={{ width: '100%', height: '40px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'transparent' }}
          />
          <label style={{ fontSize: '0.9rem', opacity: 0.8 }}>Button Label</label>
          <input 
            type="text" 
            value={config.branding.button_label}
            onChange={(e) => onChange('branding', { ...config.branding, button_label: e.target.value })}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
          />
        </div>
      </section>

      {/* Payment Methods Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '600' }}>
          <CreditCard size={18} />
          <h3>Payment Methods</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {['QRIS', 'bank_transfer', 'ewallet'].map(method => (
            <label key={method} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span style={{ textTransform: 'capitalize', fontSize: '0.9rem' }}>{method.replace('_', ' ')}</span>
              <input 
                type="checkbox" 
                checked={config.payment_methods.includes(method)}
                onChange={(e) => {
                  const methods = e.target.checked 
                    ? [...config.payment_methods, method]
                    : config.payment_methods.filter((m: string) => m !== method);
                  onChange('payment_methods', methods);
                }}
              />
            </label>
          ))}
        </div>
      </section>

      {/* Amount Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '600' }}>
          <Settings size={18} />
          <h3>Amount Settings</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <select 
            value={config.amount.type}
            onChange={(e) => onChange('amount', { ...config.amount, type: e.target.value })}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
          >
            <option value="fixed">Fixed Amount</option>
            <option value="customer_defined">Customer Defined</option>
          </select>
          {config.amount.type === 'fixed' && (
            <input 
              type="number" 
              value={config.amount.value}
              onChange={(e) => onChange('amount', { ...config.amount, value: Number(e.target.value) })}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            />
          )}
        </div>
      </section>

      <div style={{ marginTop: 'auto' }}>
        <button className="glow-button" onClick={onPublish} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Send size={18} />
          Publish Widget
        </button>
      </div>
    </aside>
  );
};
