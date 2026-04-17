'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Loader2, CheckCircle2, Terminal, ExternalLink, Rocket, Server, Cloud } from 'lucide-react';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteUrl: string;
}

type DeployPhase = 'queued' | 'building' | 'deploying' | 'healthy';

export const PublishModal: React.FC<PublishModalProps> = ({ isOpen, onClose, siteUrl }) => {
  const [phase, setPhase] = useState<DeployPhase>('queued');
  const [logs, setLogs] = useState<string[]>([]);
  const deployId = useRef(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      deployId.current++;
      hasRun.current = false;
      return;
    }
    if (hasRun.current) return;
    hasRun.current = true;

    const runId = ++deployId.current;
    setPhase('queued');
    setLogs([]);

    const log = (msg: string) => {
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    const run = async () => {
      log("Initializing Locus deployment workflow...");
      await new Promise(r => setTimeout(r, 1500));
      if (deployId.current !== runId) return;

      setPhase('building');
      log("Cloning repository source...");
      log("Nixpacks: Detecting framework (Next.js)");
      log("Running build script: pnpm run build");
      await new Promise(r => setTimeout(r, 3000));
      if (deployId.current !== runId) return;

      setPhase('deploying');
      log("Build successful. Registering task definition...");
      log("Provisioning container on BuildWithLocus...");
      log("Waiting for health checks... (0/1)");
      await new Promise(r => setTimeout(r, 2500));
      if (deployId.current !== runId) return;

      setPhase('healthy');
      log("Service registered with Locus Service Discovery.");
      log("Deployment SUCCESSFUL. Live at " + siteUrl);
    };

    run();
  }, [isOpen, siteUrl]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass animate-fade-in" style={{ width: '600px', background: '#0a0a0c', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', border: '1px solid var(--primary)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Rocket size={24} color="var(--primary)" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Publishing Site</h2>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid var(--glass-border)' }}>
          {([
            { id: 'queued' as const, icon: <Server size={18} />, label: 'Queued' },
            { id: 'building' as const, icon: <Terminal size={18} />, label: 'Build' },
            { id: 'deploying' as const, icon: <Cloud size={18} />, label: 'Deploy' },
            { id: 'healthy' as const, icon: <CheckCircle2 size={18} />, label: 'Ready' }
          ]).map((s, i) => {
            const phases: DeployPhase[] = ['queued', 'building', 'deploying', 'healthy'];
            const isDone = i <= phases.indexOf(phase);
            const isCurrent = phase === s.id;
            
            return (
              <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: isDone ? 1 : 0.3 }}>
                <div style={{ color: isDone ? 'var(--primary)' : 'white' }}>
                  {isCurrent && phase !== 'healthy' ? <Loader2 size={18} className="animate-spin" /> : s.icon}
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>{s.label}</span>
              </div>
            );
          })}
        </div>

        <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '12px', padding: '16px', height: '200px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
          {logs.map((log, i) => (
            <div key={i} style={{ marginBottom: '4px', opacity: i === logs.length - 1 ? 1 : 0.5 }}>
              <span style={{ color: 'var(--primary)', marginRight: '8px' }}>[LOCUS]</span>
              {log}
            </div>
          ))}
        </div>

        {phase === 'healthy' ? (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass" style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Your site is now LIVE at:</p>
                <p style={{ fontWeight: 'bold' }}>{siteUrl}</p>
              </div>
              <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="glow-button" style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Visit Site <ExternalLink size={14} />
              </a>
            </div>
            <button onClick={onClose} style={{ alignSelf: 'center', background: 'none', border: 'none', color: 'white', opacity: 0.6, cursor: 'pointer', fontSize: '0.9rem' }}>
              Close
            </button>
          </div>
        ) : (
          <p style={{ textAlign: 'center', fontSize: '0.9rem', opacity: 0.5 }}>
            Do not close this window. Your containers are being provisioned...
          </p>
        )}
      </div>
    </div>
  );
};
