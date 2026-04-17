'use client';

import React, { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Connection,
  addEdge,
  type Edge,
  type Node,
  BackgroundVariant,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '@/styles/flow.css';

import { ProfileNode } from '@/components/nodes/ProfileNode';
import { PaymentNode } from '@/components/nodes/PaymentNode';
import { CheckoutNode } from '@/components/nodes/CheckoutNode';
import { RedirectNode } from '@/components/nodes/RedirectNode';
import { LinkNode } from '@/components/nodes/LinkNode';

const nodeTypes: NodeTypes = {
  profile: ProfileNode,
  payment: PaymentNode,
  checkout: CheckoutNode,
  redirect: RedirectNode,
  link: LinkNode,
};

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
}

export const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
}) => {
  const handleConnect = useCallback(
    (connection: Connection) => {
      const newEdge = addEdge({ ...connection, type: 'smoothstep', animated: false }, edges);
      onConnect(newEdge as unknown as Connection);
    },
    [edges, onConnect]
  );

  return (
    <div style={{ flex: 1, background: '#09090b' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#2e2e35', strokeWidth: 1.5 },
        }}
        fitView
        fitViewOptions={{ padding: 0.4 }}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={['Backspace', 'Delete']}
        snapToGrid
        snapGrid={[16, 16]}
        minZoom={0.3}
        maxZoom={1.5}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          color="#2a2a32"
        />
        <Controls
          showInteractive={false}
          style={{
            bottom: 16,
            left: 16,
          }}
        />
      </ReactFlow>
    </div>
  );
};
