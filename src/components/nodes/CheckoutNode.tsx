'use client';

import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { DollarSign } from 'lucide-react';

export type CheckoutNodeData = {
  amountType: 'fixed' | 'customer_defined';
  amountValue: number;
  currency: string;
  onChange?: (field: string, value: string | number) => void;
};

function CheckoutNodeComponent({ data }: NodeProps & { data: CheckoutNodeData }) {
  return (
    <div className="locus-node">
      <Handle type="target" position={Position.Left} />
      <div className="locus-node-header">
        <div className="locus-node-header-dot" style={{ background: '#f59e0b' }} />
        <DollarSign size={12} />
        Checkout
      </div>
      <div className="locus-node-body">
        <div className="locus-node-field">
          <span className="locus-node-label">Type</span>
          <select
            className="locus-node-input"
            value={data.amountType}
            onChange={(e) => data.onChange?.('amountType', e.target.value)}
          >
            <option value="fixed">Fixed</option>
            <option value="customer_defined">Customer Defined</option>
          </select>
        </div>
        {data.amountType === 'fixed' && (
          <div className="locus-node-field">
            <span className="locus-node-label">Amount ({data.currency})</span>
            <input
              className="locus-node-input"
              type="number"
              value={data.amountValue}
              onChange={(e) => data.onChange?.('amountValue', Number(e.target.value))}
            />
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export const CheckoutNode = React.memo(CheckoutNodeComponent);
