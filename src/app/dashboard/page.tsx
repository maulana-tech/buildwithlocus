'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type Connection,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import { Layout, Globe, Send, Eye } from 'lucide-react';

import { FlowCanvas } from '@/components/FlowCanvas';
import { NodePanel, type BlockType } from '@/components/NodePanel';
import { PublishModal } from '@/components/PublishModal';
import { startAgents } from '@/agents';
import { WidgetConfig, SiteConfig } from '@/agents/state';

const STORAGE_KEY = 'locus_studio_site_v1';
const SHARED_SITES_KEY = 'locus_shared_sites';

function loadSavedState() {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved) as { siteConfig: SiteConfig; widgetConfig: WidgetConfig; nodes?: Node[]; edges?: Edge[] };
  } catch {
    return null;
  }
}

const DEFAULT_WIDGET: WidgetConfig = {
  widget_id: 'wgt_demo',
  merchant_id: 'mer_123',
  branding: { logo_url: '/logo.png', primary_color: '#6366f1', button_label: 'Pay Now' },
  payment_methods: ['QRIS', 'bank_transfer'],
  amount: { type: 'fixed', value: 150000, currency: 'IDR' },
  redirects: { success_url: 'https://example.com/success', failure_url: 'https://example.com/failure' },
};

const DEFAULT_SITE: SiteConfig = {
  id: 'site_123',
  username: 'demo_store',
  title: 'My Locus Store',
  theme: 'glass',
  font: 'inter',
  layout: 'stack',
  branding: { primary_color: '#6366f1' },
  blocks: [
    { id: 'p1', type: 'profile', visible: true, name: 'Locus Demo Store', bio: 'Premium checkout for everyone.', avatar_url: '/logo.png' },
    { id: 'l1', type: 'link', visible: true, title: 'Follow us on X', url: 'https://x.com/paywithlocus' },
  ],
};

function buildWidgetNodes(config: WidgetConfig): Node[] {
  return [
    {
      id: 'w-profile',
      type: 'profile',
      position: { x: 40, y: 120 },
      data: {
        name: 'Merchant Store',
        bio: 'Accept payments via Locus',
        avatar_url: config.branding.logo_url,
      },
    },
    {
      id: 'w-payment',
      type: 'payment',
      position: { x: 340, y: 120 },
      data: { methods: config.payment_methods },
    },
    {
      id: 'w-checkout',
      type: 'checkout',
      position: { x: 640, y: 120 },
      data: {
        amountType: config.amount.type,
        amountValue: config.amount.value,
        currency: config.amount.currency,
      },
    },
    {
      id: 'w-redirect',
      type: 'redirect',
      position: { x: 940, y: 120 },
      data: {
        successUrl: config.redirects.success_url,
        failureUrl: config.redirects.failure_url,
      },
    },
  ];
}

function buildWidgetEdges(): Edge[] {
  return [
    { id: 'e-w1', source: 'w-profile', target: 'w-payment', type: 'smoothstep' },
    { id: 'e-w2', source: 'w-payment', target: 'w-checkout', type: 'smoothstep' },
    { id: 'e-w3', source: 'w-checkout', target: 'w-redirect', type: 'smoothstep' },
  ];
}

function buildSiteNodes(site: SiteConfig): Node[] {
  const nodes: Node[] = [];
  let y = 60;

  const profileBlock = site.blocks.find((b) => b.type === 'profile');
  if (profileBlock) {
    nodes.push({
      id: 's-profile',
      type: 'profile',
      position: { x: 80, y: 60 },
      data: {
        name: (profileBlock as { name: string }).name || 'Name',
        bio: (profileBlock as { bio: string }).bio || '',
        avatar_url: (profileBlock as { avatar_url?: string }).avatar_url || '/logo.png',
      },
    });
    y = 260;
  }

  const links = site.blocks.filter((b) => b.type === 'link');
  links.forEach((block, i) => {
    const link = block as { title: string; url: string };
    nodes.push({
      id: `s-link-${block.id}`,
      type: 'link',
      position: { x: 80, y: y + i * 200 },
      data: { title: link.title, url: link.url },
    });
  });

  const checkouts = site.blocks.filter((b) => b.type === 'checkout');
  checkouts.forEach((block, i) => {
    nodes.push({
      id: `s-checkout-${block.id}`,
      type: 'checkout',
      position: { x: 420, y: y + i * 200 },
      data: { amountType: 'fixed' as const, amountValue: 150000, currency: 'IDR' },
    });
  });

  return nodes;
}

function buildSiteEdges(site: SiteConfig): Edge[] {
  const edges: Edge[] = [];
  const profileBlock = site.blocks.find((b) => b.type === 'profile');
  const links = site.blocks.filter((b) => b.type === 'link');

  if (profileBlock) {
    links.forEach((block) => {
      edges.push({
        id: `e-sp-${block.id}`,
        source: 's-profile',
        target: `s-link-${block.id}`,
        type: 'smoothstep',
      });
    });
  }
  return edges;
}

let nodeIdCounter = 0;
function getNextNodeId() {
  return `node_${++nodeIdCounter}_${Date.now()}`;
}

function getSavedState() {
  return loadSavedState();
}

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<'widget' | 'site'>('widget');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');

  const [widgetConfig] = useState<WidgetConfig>(() => getSavedState()?.widgetConfig ?? DEFAULT_WIDGET);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => getSavedState()?.siteConfig ?? DEFAULT_SITE);
  const [agents] = useState<ReturnType<typeof startAgents>>(() => startAgents());

  const initialNodes = useMemo(() => {
    const savedState = getSavedState();
    if (savedState?.nodes && savedState.nodes.length > 0) {
      return savedState.nodes;
    }
    return activeTab === 'widget' ? buildWidgetNodes(widgetConfig) : buildSiteNodes(siteConfig);
  }, []);

  const initialEdges = useMemo(() => {
    const savedState = getSavedState();
    if (savedState?.edges && savedState.edges.length > 0) {
      return savedState.edges;
    }
    return activeTab === 'widget' ? buildWidgetEdges() : buildSiteEdges(siteConfig);
  }, []);

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Edge | Connection) => {
      if ('id' in connection && 'source' in connection && 'target' in connection) {
        setEdges((eds) => [...eds, connection as Edge]);
      } else {
        setEdges((eds) => addEdge(connection as Connection, eds));
      }
    },
    []
  );

  const persistState = useCallback(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ siteConfig, widgetConfig, nodes, edges })
    );
  }, [siteConfig, widgetConfig, nodes, edges]);

  React.useEffect(() => {
    persistState();
  }, [persistState]);

  const switchTab = useCallback(
    (tab: 'widget' | 'site') => {
      setActiveTab(tab);
      if (tab === 'widget') {
        setNodes(buildWidgetNodes(widgetConfig));
        setEdges(buildWidgetEdges());
      } else {
        setNodes(buildSiteNodes(siteConfig));
        setEdges(buildSiteEdges(siteConfig));
      }
    },
    [widgetConfig, siteConfig]
  );

  const addNode = useCallback(
    (type: BlockType) => {
      const existingNodes = nodes;
      const lastNode = existingNodes[existingNodes.length - 1];
      const x = lastNode ? lastNode.position.x + 300 : 40;
      const y = lastNode ? lastNode.position.y : 120;

      const defaultData: Record<string, Record<string, unknown>> = {
        profile: { name: 'New Store', bio: '', avatar_url: '/logo.png' },
        payment: { methods: [] },
        checkout: { amountType: 'fixed', amountValue: 0, currency: 'IDR' },
        redirect: { successUrl: '', failureUrl: '' },
        link: { title: 'New Link', url: 'https://' },
      };

      const newId = getNextNodeId();
      const newNode: Node = {
        id: newId,
        type,
        position: { x, y },
        data: defaultData[type] || {},
      };

      setNodes((nds) => [...nds, newNode]);

      if (lastNode) {
        const newEdge: Edge = {
          id: `e-${lastNode.id}-${newId}`,
          source: lastNode.id,
          target: newId,
          type: 'smoothstep',
        };
        setEdges((eds) => [...eds, newEdge]);
      }
    },
    [nodes]
  );

  const handlePublish = useCallback(async () => {
    const sharedSites: Record<string, SiteConfig & { published_at?: string }> = JSON.parse(
      localStorage.getItem(SHARED_SITES_KEY) || '{}'
    );
    sharedSites[siteConfig.username] = {
      ...siteConfig,
      published_at: new Date().toISOString(),
    };
    localStorage.setItem(SHARED_SITES_KEY, JSON.stringify(sharedSites));

    if (agents?.builder) agents.builder.saveSite(siteConfig);

    const url = `${window.location.origin}/s/${siteConfig.username}`;
    setPublishedUrl(url);
    setIsPublishModalOpen(true);
  }, [siteConfig, agents]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#09090b', color: '#ededef' }}>
      <header
        style={{
          height: '48px',
          borderBottom: '1px solid #1e1e22',
          background: '#111113',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '16px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/logo.png" alt="" style={{ width: '20px', height: '20px' }} />
          <span style={{ fontWeight: 600, fontSize: '13px', color: '#ededef' }}>Locus Studio</span>
        </div>

        <div
          style={{
            display: 'flex',
            background: '#09090b',
            borderRadius: '4px',
            padding: '2px',
            border: '1px solid #1e1e22',
          }}
        >
          <button
            onClick={() => switchTab('widget')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              fontSize: '12px',
              fontWeight: 500,
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              background: activeTab === 'widget' ? '#1a1a1e' : 'transparent',
              color: activeTab === 'widget' ? '#ededef' : '#55555e',
              transition: 'all 0.15s ease',
            }}
          >
            <Layout size={13} />
            Widget
          </button>
          <button
            onClick={() => switchTab('site')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              fontSize: '12px',
              fontWeight: 500,
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              background: activeTab === 'site' ? '#1a1a1e' : 'transparent',
              color: activeTab === 'site' ? '#ededef' : '#55555e',
              transition: 'all 0.15s ease',
            }}
          >
            <Globe size={13} />
            Site
          </button>
        </div>

        <div style={{ flex: 1 }} />

        {activeTab === 'site' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: '#55555e' }}>locus.sh/s/</span>
            <input
              value={siteConfig.username}
              onChange={(e) => setSiteConfig({ ...siteConfig, username: e.target.value })}
              style={{
                background: '#09090b',
                border: '1px solid #1e1e22',
                borderRadius: '3px',
                padding: '4px 8px',
                color: '#ededef',
                fontSize: '12px',
                width: '120px',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>
        )}

        <button
          onClick={() => window.open(`/s/${siteConfig.username}`, '_blank')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            fontSize: '12px',
            fontWeight: 500,
            background: 'transparent',
            border: '1px solid #1e1e22',
            borderRadius: '4px',
            color: '#8b8b94',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <Eye size={13} />
          Preview
        </button>

        <button
          onClick={handlePublish}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 14px',
            fontSize: '12px',
            fontWeight: 600,
            background: '#6366f1',
            border: 'none',
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <Send size={13} />
          Publish
        </button>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <NodePanel mode={activeTab} onAddNode={addNode} />
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        />
      </div>

      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        siteUrl={publishedUrl || `/s/${siteConfig.username}`}
      />
    </div>
  );
}
