'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BarChart3, Layers, Settings, LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Builder', icon: Layers },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function AppNavbar() {
  const pathname = usePathname();

  return (
    <nav style={{
      height: '52px',
      borderBottom: '1px solid #1e1e22',
      background: '#0c0c0e',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: '8px',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingRight: '16px', borderRight: '1px solid #1e1e22', marginRight: '4px' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Layers size={14} color="#fff" />
        </div>
        <span style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.02em' }}>Locus Studio</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
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
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500,
                color: isActive ? '#ededef' : '#71717a',
                background: isActive ? '#1a1a1e' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} />
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
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 500,
            color: '#71717a',
            textDecoration: 'none',
          }}
        >
          <Settings size={14} />
          Settings
        </Link>
      </div>
    </nav>
  );
}