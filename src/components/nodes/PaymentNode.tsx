'use client';

import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { CreditCard } from 'lucide-react';

export type PaymentNodeData = {
  methods: string[];
  onToggleMethod?: (method: string) => void;
};

const PAYMENT_OPTIONS = ['QRIS', 'bank_transfer', 'ewallet'];

function PaymentNodeComponent({ data }: NodeProps & { data: PaymentNodeData }) {
  return (
    <div className="locus-node">
      <Handle type="target" position={Position.Left} />
      <div className="locus-node-header">
        <div className="locus-node-header-dot" style={{ background: '#22c55e' }} />
        <CreditCard size={12} />
        Payment Methods
      </div>
      <div className="locus-node-body">
        <div className="locus-node-tags">
          {PAYMENT_OPTIONS.map((method) => (
            <span
              key={method}
              className={`locus-node-tag ${data.methods.includes(method) ? 'active' : ''}`}
              onClick={() => data.onToggleMethod?.(method)}
            >
              {method.replace('_', ' ')}
            </span>
          ))}
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export const PaymentNode = React.memo(PaymentNodeComponent);
