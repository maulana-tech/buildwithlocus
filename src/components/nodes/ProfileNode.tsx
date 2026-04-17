'use client';

import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { User, Trash2 } from 'lucide-react';

export type ProfileNodeData = {
  name: string;
  bio: string;
  avatar_url: string;
  onDelete?: () => void;
  onChange?: (field: string, value: string) => void;
};

function ProfileNodeComponent({ data, id }: NodeProps & { data: ProfileNodeData }) {
  return (
    <div className="locus-node">
      <Handle type="target" position={Position.Left} />
      <div className="locus-node-header">
        <div className="locus-node-header-dot" style={{ background: '#6366f1' }} />
        <User size={12} />
        Profile
        {data.onDelete && (
          <button className="locus-node-delete" onClick={data.onDelete}>
            <Trash2 size={11} />
          </button>
        )}
      </div>
      <div className="locus-node-body">
        <div className="locus-node-field">
          <span className="locus-node-label">Name</span>
          <input
            className="locus-node-input"
            value={data.name}
            onChange={(e) => data.onChange?.('name', e.target.value)}
            placeholder="Store name"
          />
        </div>
        <div className="locus-node-field">
          <span className="locus-node-label">Bio</span>
          <input
            className="locus-node-input"
            value={data.bio}
            onChange={(e) => data.onChange?.('bio', e.target.value)}
            placeholder="Short description"
          />
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export const ProfileNode = React.memo(ProfileNodeComponent);
