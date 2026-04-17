'use client';

import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Link2, Trash2 } from 'lucide-react';

export type LinkNodeData = {
  title: string;
  url: string;
  onDelete?: () => void;
  onChange?: (field: string, value: string) => void;
};

function LinkNodeComponent({ data }: NodeProps & { data: LinkNodeData }) {
  return (
    <div className="locus-node">
      <Handle type="target" position={Position.Left} />
      <div className="locus-node-header">
        <div className="locus-node-header-dot" style={{ background: '#06b6d4' }} />
        <Link2 size={12} />
        Link
        {data.onDelete && (
          <button className="locus-node-delete" onClick={data.onDelete}>
            <Trash2 size={11} />
          </button>
        )}
      </div>
      <div className="locus-node-body">
        <div className="locus-node-field">
          <span className="locus-node-label">Title</span>
          <input
            className="locus-node-input"
            value={data.title}
            onChange={(e) => data.onChange?.('title', e.target.value)}
            placeholder="Link title"
          />
        </div>
        <div className="locus-node-field">
          <span className="locus-node-label">URL</span>
          <input
            className="locus-node-input"
            value={data.url}
            onChange={(e) => data.onChange?.('url', e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export const LinkNode = React.memo(LinkNodeComponent);
