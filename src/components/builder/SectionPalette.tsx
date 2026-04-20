'use client';

import React from 'react';
import {
  Sparkles,
  LayoutGrid,
  DollarSign,
  ShoppingCart,
  MessageSquareQuote,
  HelpCircle,
  PanelBottom,
} from 'lucide-react';
import type { SectionType } from '@/agents/state';

const SECTIONS: Array<{ type: SectionType; label: string; icon: React.ReactNode; desc: string }> = [
  { type: 'hero', label: 'Hero', icon: <Sparkles size={16} />, desc: 'Headline + CTA' },
  { type: 'features', label: 'Features', icon: <LayoutGrid size={16} />, desc: 'Product highlights' },
  { type: 'pricing', label: 'Pricing', icon: <DollarSign size={16} />, desc: 'Pricing plans' },
  { type: 'checkout', label: 'Checkout', icon: <ShoppingCart size={16} />, desc: 'Payment widget' },
  { type: 'testimonials', label: 'Testimonials', icon: <MessageSquareQuote size={16} />, desc: 'Customer reviews' },
  { type: 'faq', label: 'FAQ', icon: <HelpCircle size={16} />, desc: 'Common questions' },
  { type: 'footer', label: 'Footer', icon: <PanelBottom size={16} />, desc: 'Links & socials' },
];

type Props = {
  onAdd: (type: SectionType) => void;
};

export function SectionPalette({ onAdd }: Props) {
  return (
    <div className="builder-palette">
      <div className="builder-palette-header">
        <span>Sections</span>
      </div>
      <div className="builder-palette-list">
        {SECTIONS.map((s) => (
          <button
            key={s.type}
            className="builder-palette-item"
            onClick={() => onAdd(s.type)}
          >
            <div className="builder-palette-item-icon">{s.icon}</div>
            <div className="builder-palette-item-text">
              <span className="builder-palette-item-label">{s.label}</span>
              <span className="builder-palette-item-desc">{s.desc}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
