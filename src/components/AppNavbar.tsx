'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { BarChart3, Home, Layers, Wallet, ChevronDown, LogOut, Copy, ExternalLink } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Builder', icon: Layers },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

type WalletState = {
  connected: boolean;
  address: string;
  balance: string;
  loading: boolean;
};

export function AppNavbar() {
  const pathname = usePathname();
  const [wallet, setWallet] = useState<WalletState>(() => {
    if (typeof window === 'undefined') return { connected: false, address: '', balance: '', loading: false };
    try {
      const saved = localStorage.getItem('locus_wallet');
      if (saved) {
        const data = JSON.parse(saved);
        return { connected: true, address: data.address, balance: data.balance, loading: false };
      }
    } catch {}
    return { connected: false, address: '', balance: '', loading: false };
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const connectWallet = async () => {
    if (!apiKey.trim() || !apiKey.startsWith('claw_')) {
      alert('Please enter a valid Locus API key (starts with claw_)');
      return;
    }

    setWallet(prev => ({ ...prev, loading: true }));

    try {
      const res = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to connect');
      }

      const data = await res.json();
      const walletData = { address: data.wallet_address, balance: data.balance };
      localStorage.setItem('locus_wallet', JSON.stringify(walletData));
      localStorage.setItem('locus_api_key', apiKey);
      setWallet({ connected: true, ...walletData, loading: false });
      setShowConnect(false);
      setApiKey('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Connection failed');
      setWallet(prev => ({ ...prev, loading: false }));
    }
  };

  const disconnect = () => {
    localStorage.removeItem('locus_wallet');
    localStorage.removeItem('locus_api_key');
    setWallet({ connected: false, address: '', balance: '', loading: false });
    setShowDropdown(false);
  };

  const shortenAddress = (addr: string) => {
    if (addr.length <= 12) return addr;
    return addr.slice(0, 6) + '...' + addr.slice(-4);
  };

  return (
    <>
      <nav style={{
        height: '56px',
        borderBottom: '1px solid #2a2a2b',
        background: 'rgba(15, 15, 16, 0.7)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 0,
        flexShrink: 0,
        position: 'relative',
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingRight: '20px', borderRight: '1px solid #2a2a2b', marginRight: '20px' }}>
          <Image src="/logo.png" alt="Locus" width={24} height={24} style={{ flexShrink: 0 }} />
          <span style={{ fontWeight: 700, fontSize: '13px', letterSpacing: '-0.02em' }}>Locus Studio</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: isActive ? '#0f0f10' : '#a0a0a2',
                  background: isActive ? '#b7d941' : 'transparent',
                  textDecoration: 'none',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  transition: 'color 0.15s ease',
                }}
              >
                <Icon size={13} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              fontSize: '11px',
              fontWeight: 500,
              color: '#666668',
              textDecoration: 'none',
              letterSpacing: '0.03em',
            }}
          >
            <Home size={13} />
            Home
          </Link>

          <div style={{ width: '1px', height: '20px', background: '#2a2a2b' }} />

          {wallet.connected ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  background: '#1b1b1c',
                  border: '1px solid #2a2a2b',
                  color: '#fdfdfd',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                }}
              >
                <div style={{ width: '6px', height: '6px', background: '#b7d941' }} />
                <span>{shortenAddress(wallet.address)}</span>
                <span style={{ color: '#b7d941', fontSize: '11px' }}>{wallet.balance} USDC</span>
                <ChevronDown size={12} color="#666668" />
              </button>

              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '4px',
                  background: '#1b1b1c',
                  border: '1px solid #2a2a2b',
                  minWidth: '240px',
                  zIndex: 100,
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #2a2a2b' }}>
                    <div style={{ fontSize: '10px', color: '#666668', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Wallet</div>
                    <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#a0a0a2', wordBreak: 'break-all' }}>{wallet.address}</div>
                  </div>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #2a2a2b' }}>
                    <div style={{ fontSize: '10px', color: '#666668', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Balance</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#b7d941', fontFamily: 'monospace' }}>{wallet.balance} USDC</div>
                  </div>
                  <button
                    onClick={() => { navigator.clipboard.writeText(wallet.address); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'none', border: 'none', color: '#a0a0a2', fontSize: '12px', cursor: 'pointer', width: '100%', textAlign: 'left' }}
                  >
                    <Copy size={13} /> Copy Address
                  </button>
                  <a
                    href={`https://basescan.org/address/${wallet.address}`}
                    target="_blank"
                    rel="noopener"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', color: '#a0a0a2', fontSize: '12px', textDecoration: 'none' }}
                  >
                    <ExternalLink size={13} /> View on BaseScan
                  </a>
                  <button
                    onClick={disconnect}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'none', border: 'none', borderTop: '1px solid #2a2a2b', color: '#ef4444', fontSize: '12px', cursor: 'pointer', width: '100%', textAlign: 'left' }}
                  >
                    <LogOut size={13} /> Disconnect
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowConnect(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                background: '#b7d941',
                border: 'none',
                color: '#0f0f10',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              <Wallet size={13} />
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      {showConnect && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowConnect(false)}
        >
          <div
            style={{ background: '#1b1b1c', border: '1px solid #2a2a2b', maxWidth: '420px', width: '100%', margin: '16px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #2a2a2b' }}>
              <h2 style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '-0.005em' }}>Connect Locus Wallet</h2>
              <p style={{ fontSize: '13px', color: '#a0a0a2', marginTop: '4px', lineHeight: 1.55 }}>Enter your Locus API key to connect your wallet and start accepting payments.</p>
            </div>
            <div style={{ padding: '24px' }}>
              <label style={{ fontSize: '10px', color: '#666668', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, display: 'block', marginBottom: '8px' }}>API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="claw_dev_..."
                style={{
                  width: '100%',
                  background: '#0f0f10',
                  border: '1px solid #2a2a2b',
                  padding: '10px 14px',
                  color: '#fdfdfd',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  outline: 'none',
                }}
                onKeyDown={(e) => e.key === 'Enter' && connectWallet()}
              />
              <p style={{ fontSize: '11px', color: '#666668', marginTop: '8px', lineHeight: 1.5 }}>
                Get your API key from <a href="https://app.paywithlocus.com" target="_blank" rel="noopener" style={{ color: '#b7d941', textDecoration: 'none' }}>app.paywithlocus.com</a>
              </p>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #2a2a2b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <a
                href="/dashboard?demo=1"
                style={{ fontSize: '11px', color: '#666668', textDecoration: 'none', letterSpacing: '0.03em' }}
              >
                Skip &rarr; Try Demo
              </a>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setShowConnect(false)}
                  style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #2a2a2b', color: '#a0a0a2', fontSize: '12px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={connectWallet}
                  disabled={wallet.loading || !apiKey.trim()}
                  style={{ padding: '8px 16px', background: '#b7d941', border: 'none', color: '#0f0f10', fontSize: '12px', fontWeight: 600, cursor: wallet.loading ? 'wait' : 'pointer', letterSpacing: '0.03em' }}
                >
                  {wallet.loading ? 'Connecting...' : 'Connect'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
