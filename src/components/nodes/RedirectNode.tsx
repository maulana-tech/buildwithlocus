'use client';

import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ArrowRightLeft } from 'lucide-react';

export type RedirectNodeData = {
  successUrl: string;
  failureUrl: string;
  onChange?: (field: string, value: string) => void;
};

function RedirectNodeComponent({ data }: NodeProps & { data: RedirectNodeData }) {
  return (
    <div className="locus-node">
      <Handle type="target" position={Position.Left} />
      <div className="locus-node-header">
        <div className="locus-node-header-dot" style={{ background: '#ec4899' }} />
        <ArrowRightLeft size={12} />
        Redirects
      </div>
      <div className="locus-node-body">
        <div className="locus-node-field">
          <span className="locus-node-label">Success URL</span>
          <input
            className="locus-node-input"
            value={data.successUrl}
            onChange={(e) => data.onChange?.('successUrl', e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div className="locus-node-field">
          <span className="locus-node-label">Failure URL</span>
          <input
            className="locus-node-input"
            value={data.failureUrl}
            onChange={(e) => data.onChange?.('failureUrl', e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export const RedirectNode = React.memo(RedirectNodeComponent);
