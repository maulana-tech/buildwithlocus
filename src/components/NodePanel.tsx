'use client';

import React, { useState } from 'react';
import { User, CreditCard, DollarSign, ArrowRightLeft, Link2, ShoppingCart, Plus, ChevronDown, ChevronRight } from 'lucide-react';

export type BlockType = 'profile' | 'payment' | 'checkout' | 'redirect' | 'link';

interface BlockItem {
  type: BlockType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  preview: string;
}

const WIDGET_BLOCKS: BlockItem[] = [
  {
    type: 'profile',
    label: 'Profile',
    description: 'Merchant name, bio, avatar',
    icon: <User size={16} />,
    color: '#6366f1',
    preview: 'Store name & description',
  },
  {
    type: 'payment',
    label: 'Payment',
    description: 'QRIS, bank transfer, e-wallet',
    icon: <CreditCard size={16} />,
    color: '#22c55e',
    preview: 'Payment methods selector',
  },
  {
    type: 'checkout',
    label: 'Checkout',
    description: 'Amount, currency, type',
    icon: <DollarSign size={16} />,
    color: '#f59e0b',
    preview: 'IDR 150,000 — Fixed',
  },
  {
    type: 'redirect',
    label: 'Redirect',
    description: 'Success & failure URLs',
    icon: <ArrowRightLeft size={16} />,
    color: '#ec4899',
    preview: 'Post-payment routing',
  },
];

const SITE_BLOCKS: BlockItem[] = [
  {
    type: 'profile',
    label: 'Profile',
    description: 'Name, bio, avatar',
    icon: <User size={16} />,
    color: '#6366f1',
    preview: 'Store name & description',
  },
  {
    type: 'link',
    label: 'Link',
    description: 'External URL with title',
    icon: <Link2 size={16} />,
    color: '#06b6d4',
    preview: 'e.g. Follow us on X',
  },
  {
    type: 'checkout',
    label: 'Cart Widget',
    description: 'Embed checkout flow',
    icon: <ShoppingCart size={16} />,
    color: '#f59e0b',
    preview: 'Locus Pay button',
  },
];

interface NodePanelProps {
  mode: 'widget' | 'site';
  onAddNode: (type: BlockType) => void;
}

function BlockCard({ block, onAdd }: { block: BlockItem; onAdd: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onAdd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
        background: hovered ? '#1a1a1e' : '#09090b',
        border: `1px solid ${hovered ? block.color + '44' : '#1e1e22'}`,
        borderRadius: '6px',
        cursor: 'pointer',
        textAlign: 'left',
        padding: '0',
        color: '#ededef',
        transition: 'all 0.15s ease',
        width: '100%',
        fontFamily: 'inherit',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 14px',
        borderBottom: '1px solid #1e1e22',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: block.color + '15',
          border: `1px solid ${block.color}33`,
          borderRadius: '6px',
          color: block.color,
          flexShrink: 0,
        }}>
          {block.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#ededef',
            lineHeight: 1.2,
          }}>
            {block.label}
          </div>
          <div style={{
            fontSize: '11px',
            color: '#55555e',
            lineHeight: 1.4,
          }}>
            {block.description}
          </div>
        </div>
        <Plus size={14} style={{
          color: hovered ? block.color : '#55555e',
          flexShrink: 0,
          transition: 'color 0.15s ease',
        }} />
      </div>
      <div style={{
        padding: '10px 14px',
        fontSize: '11px',
        color: '#55555e',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <div style={{
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: block.color,
          flexShrink: 0,
        }} />
        {block.preview}
      </div>
    </button>
  );
}

export const NodePanel: React.FC<NodePanelProps> = ({ mode, onAddNode }) => {
  const [widgetOpen, setWidgetOpen] = useState(true);
  const blocks = mode === 'widget' ? WIDGET_BLOCKS : SITE_BLOCKS;

  return (
    <div
      style={{
        width: '260px',
        background: '#111113',
        borderRight: '1px solid #1e1e22',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <div style={{
        padding: '16px 16px 12px',
        borderBottom: '1px solid #1e1e22',
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 600,
          color: '#ededef',
          marginBottom: '2px',
        }}>
          {mode === 'widget' ? 'Widget Builder' : 'Site Builder'}
        </div>
        <div style={{
          fontSize: '11px',
          color: '#55555e',
        }}>
          Click a block to add to canvas
        </div>
      </div>

      <div style={{
        padding: '12px',
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <button
          onClick={() => setWidgetOpen(!widgetOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#55555e',
            fontSize: '11px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            cursor: 'pointer',
            padding: '4px 4px 8px',
            fontFamily: 'inherit',
          }}
        >
          {widgetOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          Components ({blocks.length})
        </button>

        {widgetOpen && blocks.map((block) => (
          <BlockCard
            key={block.label}
            block={block}
            onAdd={() => onAddNode(block.type)}
          />
        ))}
      </div>

      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #1e1e22',
        fontSize: '11px',
        color: '#55555e',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#22c55e',
        }} />
        Flow auto-connected
      </div>
    </div>
  );
};
