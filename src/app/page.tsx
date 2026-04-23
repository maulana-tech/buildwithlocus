'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Terminal,
  CreditCard,
  Zap,
  Activity,
  Rocket,
  ExternalLink,
  Globe,
  Layers,
  MousePointerClick,
  Link2,
  Code2,
  ShieldCheck,
  User,
  DollarSign,
} from 'lucide-react';

const NAV_LINKS = ['Product', 'Developers', 'Features', 'Blog'];

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reveal = () => {
      const children = el.querySelectorAll('.sr, .sr-left, .sr-right, .sr-scale');
      children.forEach((child) => child.classList.add('sr-visible'));
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sr-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );
    const children = el.querySelectorAll('.sr, .sr-left, .sr-right, .sr-scale');
    children.forEach((child) => observer.observe(child));
    const fallback = setTimeout(reveal, 3000);
    return () => { observer.disconnect(); clearTimeout(fallback); };
  }, []);
  return ref;
}

const PX = 'clamp(24px, 5vw, 80px)';
const HEADLINE = 'var(--font-headline), Space Grotesk, sans-serif';
const ACCENT = '#b7d941';

export default function LandingPage() {
  const revealRef = useScrollReveal();

  return (
    <div ref={revealRef} style={{ minHeight: '100vh', background: '#0f0f10', color: '#fdfdfd' }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-hero { animation: fadeInUp 0.8s ease forwards; }
        .animate-hero-delay { animation: fadeInUp 0.8s ease 0.15s forwards; opacity: 0; }
        .animate-hero-delay2 { animation: fadeInUp 0.8s ease 0.3s forwards; opacity: 0; }
        .sr { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .sr.sr-visible { opacity: 1; transform: translateY(0); }
        .sr-left { opacity: 0; transform: translateX(-40px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .sr-left.sr-visible { opacity: 1; transform: translateX(0); }
        .sr-right { opacity: 0; transform: translateX(40px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .sr-right.sr-visible { opacity: 1; transform: translateX(0); }
        .sr-scale { opacity: 0; transform: scale(0.95); transition: opacity 0.6s ease, transform 0.6s ease; }
        .sr-scale.sr-visible { opacity: 1; transform: scale(1); }
        .landing-card { transition: background 0.2s, transform 0.2s; }
        .landing-card:hover { background: #f5f5f5 !important; transform: translateY(-2px); }
        .landing-card-dark { transition: background 0.2s, transform 0.2s; }
        .landing-card-dark:hover { background: ${ACCENT} !important; transform: translateY(-2px); }
        .step-card { transition: transform 0.2s, border-color 0.2s; }
        .step-card:hover { transform: translateY(-4px); border-color: ${ACCENT} !important; }
        .float-anim { animation: float 3s ease-in-out infinite; }
        .marquee-track { animation: marquee 30s linear infinite; }
        html { scroll-behavior: smooth; }
        .landing-btn:hover { opacity: 0.85; }
        .landing-btn-outline:hover { background: #0f0f10 !important; color: #fdfdfd !important; }
      `}</style>

      {/* Navigation */}
      <header style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 50,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `20px ${PX}`,
        background: 'rgba(15, 15, 16, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #2a2a2b',
      }}>
        <div style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.05em', textTransform: 'uppercase', fontFamily: HEADLINE, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image src="/logo.png" alt="Locus" width={24} height={24} style={{ flexShrink: 0 }} />
          Locus Studio
        </div>
        <nav style={{ display: 'none', alignItems: 'center', gap: '40px', fontFamily: HEADLINE, fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase', fontSize: '14px' }}>
          {NAV_LINKS.map((link, i) => (
            <a key={link} href={`#${link.toLowerCase()}`} style={{ color: i === 0 ? '#fdfdfd' : '#a0a0a2', borderBottom: i === 0 ? `2px solid ${ACCENT}` : 'none', textDecoration: 'none', transition: 'color 0.2s' }}>
              {link}
            </a>
          ))}
        </nav>
        <Link href="/dashboard" className="landing-btn" style={{ background: ACCENT, color: '#0f0f10', fontFamily: HEADLINE, fontWeight: 700, textTransform: 'uppercase', padding: '8px 24px', fontSize: '12px', textDecoration: 'none', transition: 'opacity 0.2s', letterSpacing: '0.05em' }}>
          Open Studio
        </Link>
      </header>

      <main style={{ paddingTop: '80px' }}>

        {/* Hero */}
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: `0 ${PX} 80px` }}>
          <div style={{ background: '#fdfdfd', color: '#0f0f10', overflow: 'hidden', position: 'relative' }}>

            <section style={{
              minHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: `48px ${PX}`,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '40px 40px' }} />
              <div className="animate-hero" style={{ zIndex: 10, maxWidth: '1100px' }}>
                <h1 style={{ fontSize: 'clamp(40px, 7vw, 84px)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.05em', textTransform: 'uppercase', marginBottom: '32px', fontFamily: HEADLINE }}>
                  Build checkout experiences, visually.
                </h1>
              </div>
              <div className="animate-hero-delay" style={{ zIndex: 10, maxWidth: '640px' }}>
                <p style={{ fontSize: '17px', fontWeight: 500, color: '#666668', maxWidth: '640px', margin: '0 auto 48px', lineHeight: 1.6 }}>
                  No-code visual editor for payment widgets and link-in-bio stores. Configure, connect, and deploy checkout flows in minutes on BuildWithLocus.
                </p>
              </div>
              <div className="animate-hero-delay2" style={{ zIndex: 10, display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link href="/dashboard" className="landing-btn" style={{ background: '#0f0f10', color: '#fdfdfd', padding: '16px 32px', fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', fontFamily: HEADLINE, transition: 'opacity 0.2s' }}>
                  Start Building <ArrowRight size={20} />
                </Link>
                <a href="#features" className="landing-btn-outline" style={{ border: '2px solid #0f0f10', color: '#0f0f10', padding: '16px 32px', fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', textDecoration: 'none', fontFamily: HEADLINE, transition: 'all 0.2s' }}>
                  See Features
                </a>
              </div>
              <div style={{ position: 'absolute', bottom: '40px', right: PX, fontFamily: HEADLINE, fontWeight: 700, fontSize: '11px', letterSpacing: '0.2em', opacity: 0.3, textTransform: 'uppercase' }}>
                Powered by BuildWithLocus // PayWithLocus
              </div>
            </section>

          </div>
        </div>

        {/* Stats Ticker */}
        <section style={{ background: '#0f0f10', padding: '32px 0', overflow: 'hidden', borderTop: '1px solid #2a2a2b', borderBottom: '1px solid #2a2a2b' }}>
          <div className="marquee-track" style={{ display: 'flex', gap: '80px', width: 'max-content' }}>
            {[{ n: '< 5min', l: 'Time to live' }, { n: '3', l: 'Payment methods' }, { n: '0', l: 'Code required' }, { n: '1', l: 'Click deploy' }, { n: '60+', l: 'FPS smooth canvas' }, { n: '100%', l: 'Client-side' }].flatMap(s => [s, s]).map((stat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', whiteSpace: 'nowrap' }}>
                <span style={{ fontFamily: HEADLINE, fontSize: '22px', fontWeight: 900, color: ACCENT }}>{stat.n}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666668' }}>{stat.l}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" style={{ padding: `128px ${PX}`, borderTop: '1px solid #2a2a2b', background: '#fdfdfd', color: '#0f0f10' }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
            <div className="sr" style={{ marginBottom: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', marginBottom: '16px', fontFamily: HEADLINE }}>
                  Everything you need to accept payments
                </h2>
                <p style={{ color: '#666668', maxWidth: '560px', fontSize: '15px', lineHeight: 1.6 }}>
                  Visual node editor, real payment integration, and instant deployment. From idea to live checkout in under 5 minutes.
                </p>
              </div>
              <div style={{ fontFamily: HEADLINE, fontSize: '72px', fontWeight: 900, opacity: 0.05 }}>01</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: '1px solid #f4f4f5' }}>
              <FeatureCard icon={<MousePointerClick size={40} />} title="Visual Node Editor" description="Click to add blocks, connect nodes, configure everything visually. No code required." delay="0s" />
              <FeatureCard icon={<CreditCard size={40} />} title="Multi-method Payments" description="Accept QRIS, bank transfer, and e-wallet payments out of the box. Powered by PayWithLocus API." delay="0.1s" />
              <FeatureCard icon={<Zap size={40} />} title="Instant Deployment" description="One click to deploy your checkout widget. Live URL generated instantly on BuildWithLocus infrastructure." delay="0.2s" />

              <div className="sr-left landing-card" style={{ gridColumn: 'span 2', padding: '40px', minHeight: '380px', display: 'flex', gap: '48px', alignItems: 'center', borderRight: '1px solid #f4f4f5', cursor: 'default' }}>
                <div style={{ flex: 1 }}>
                  <Activity size={40} style={{ marginBottom: '24px' }} />
                  <h3 style={{ fontSize: '26px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '-0.02em', fontFamily: HEADLINE }}>Real-time Analytics</h3>
                  <p style={{ color: '#666668', lineHeight: 1.6, maxWidth: '420px' }}>Track revenue, transaction counts, and payment method breakdown per widget. Full visibility into your checkout performance.</p>
                </div>
                <div style={{ width: '50%', height: '256px', background: '#f4f4f5', position: 'relative', overflow: 'hidden' }}>
                  <img src="https://picsum.photos/seed/analytics-dashboard/800/600" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) brightness(0.9) contrast(1.25)', transition: 'transform 0.5s' }} referrerPolicy="no-referrer" />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)' }} />
                </div>
              </div>

              <div className="sr-right landing-card-dark" style={{ background: '#0f0f10', padding: '40px', minHeight: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'default', color: '#fdfdfd' }}>
                <Rocket size={40} color={ACCENT} />
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '-0.02em', fontFamily: HEADLINE }}>Agent-Native Architecture</h3>
                  <p style={{ color: '#a0a0a2', lineHeight: 1.6 }}>Built-in event-driven agent system. Builder, Payment, and Analytics agents handle your checkout lifecycle automatically.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Preview */}
        <section id="developers" style={{ background: '#0f0f10', padding: `128px ${PX}`, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: PX, width: '1px', background: 'linear-gradient(to bottom, transparent, #2a2a2b 20%, #2a2a2b 80%, transparent)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, right: PX, width: '1px', background: 'linear-gradient(to bottom, transparent, #2a2a2b 20%, #2a2a2b 80%, transparent)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
            <div className="sr" style={{ marginBottom: '64px', textAlign: 'center' }}>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', color: '#fdfdfd', fontFamily: HEADLINE, marginBottom: '16px' }}>
                See it in action
              </h2>
              <p style={{ color: '#a0a0a2', fontSize: '15px', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
                Visual node editor. Connected checkout flow. One-click publish. This is how payment infrastructure should feel.
              </p>
            </div>

            <div className="sr" style={{ background: '#1b1b1c', border: '1px solid #2a2a2b', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderBottom: '1px solid #2a2a2b', background: '#0f0f10' }}>
                <div style={{ width: '10px', height: '10px', background: '#ef4444' }} />
                <div style={{ width: '10px', height: '10px', background: '#e8a830' }} />
                <div style={{ width: '10px', height: '10px', background: ACCENT }} />
                <span style={{ marginLeft: '16px', fontSize: '12px', color: '#666668', fontFamily: 'monospace' }}>locus.studio/dashboard</span>
              </div>

              <div style={{ display: 'flex', minHeight: '400px' }}>
                <div style={{ width: '200px', flexShrink: 0, background: '#0f0f10', borderRight: '1px solid #2a2a2b', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '10px', color: '#666668', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Components</span>
                  {[
                    { icon: <User size={14} />, label: 'Profile', color: '#9b6dff' },
                    { icon: <CreditCard size={14} />, label: 'Payment', color: ACCENT },
                    { icon: <DollarSign size={14} />, label: 'Checkout', color: '#e8a830' },
                    { icon: <ShieldCheck size={14} />, label: 'Redirect', color: '#4ea8f6' },
                    { icon: <Link2 size={14} />, label: 'Link', color: '#a0a0a2' },
                  ].map((b, idx) => (
                    <div key={b.label} className="float-anim" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: '#1b1b1c', border: '1px solid #2a2a2b', fontSize: '12px', color: '#a0a0a2', animationDelay: `${idx * 0.3}s` }}>
                      <div style={{ width: '6px', height: '6px', background: b.color, flexShrink: 0 }} />
                      {b.icon}
                      <span>{b.label}</span>
                    </div>
                  ))}
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '40px 32px', backgroundImage: 'radial-gradient(circle at 2px 2px, #2a2a2b 1px, transparent 0)', backgroundSize: '20px 20px', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Profile', color: '#9b6dff', icon: <User size={12} /> },
                    { label: 'Payment', color: ACCENT, icon: <CreditCard size={12} /> },
                    { label: 'Checkout', color: '#e8a830', icon: <DollarSign size={12} /> },
                    { label: 'Redirect', color: '#4ea8f6', icon: <ShieldCheck size={12} /> },
                  ].map((node, i) => (
                    <React.Fragment key={node.label}>
                      {i > 0 && <div style={{ width: '32px', height: '2px', background: '#383839', flexShrink: 0 }} />}
                      <div style={{ background: '#1b1b1c', border: `1px solid ${node.color}33`, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#fdfdfd', whiteSpace: 'nowrap' }}>
                        <div style={{ width: '6px', height: '6px', background: node.color }} />
                        {node.icon}
                        {node.label}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: `128px ${PX}` }}>
          <div className="sr" style={{ marginBottom: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', color: '#fdfdfd', fontFamily: HEADLINE }}>
                How it works
              </h2>
              <p style={{ color: '#a0a0a2', maxWidth: '480px', fontSize: '15px', lineHeight: 1.6, marginTop: '16px' }}>
                Three steps from zero to live checkout.
              </p>
            </div>
            <div style={{ fontFamily: HEADLINE, fontSize: '72px', fontWeight: 900, opacity: 0.05, color: '#fdfdfd' }}>02</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#2a2a2b', border: '1px solid #2a2a2b' }}>
            {[
              { step: '01', icon: <Layers size={32} />, title: 'Configure', desc: 'Use the visual node editor to set up your profile, payment methods, checkout amount, and redirect URLs.', delay: '0s' },
              { step: '02', icon: <Terminal size={32} />, title: 'Connect', desc: 'Link your nodes together to define the checkout flow. Payment and Analytics agents activate automatically.', delay: '0.15s' },
              { step: '03', icon: <Globe size={32} />, title: 'Deploy', desc: 'Hit Publish. Your checkout page goes live instantly on BuildWithLocus with a shareable URL.', delay: '0.3s' },
            ].map((item) => (
              <div key={item.step} className="sr step-card" style={{ background: '#1b1b1c', padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: '24px', transitionDelay: item.delay }}>
                <div style={{ fontFamily: HEADLINE, fontSize: '48px', fontWeight: 900, color: ACCENT, opacity: 0.3, lineHeight: 1 }}>{item.step}</div>
                <div style={{ color: '#a0a0a2' }}>{item.icon}</div>
                <h3 style={{ fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', fontFamily: HEADLINE }}>{item.title}</h3>
                <p style={{ color: '#666668', lineHeight: 1.6, fontSize: '13px' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <section className="sr-scale" style={{ background: ACCENT, padding: `128px ${PX}` }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', gap: '48px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', color: '#0f0f10', lineHeight: 1, fontStyle: 'italic', marginBottom: '24px', fontFamily: HEADLINE }}>
                Start accepting payments in minutes.
              </h2>
              <p style={{ fontSize: '17px', color: 'rgba(15, 15, 16, 0.8)', fontWeight: 500, lineHeight: 1.6 }}>
                No Dockerfiles. No cloud console. No DevOps. Just open the studio and build.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/dashboard" className="landing-btn" style={{ background: '#0f0f10', color: '#fdfdfd', padding: '20px 40px', fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', fontFamily: HEADLINE, transition: 'opacity 0.2s' }}>
                Open Studio <ArrowRight size={20} />
              </Link>
              <a href="https://beta.buildwithlocus.com" target="_blank" rel="noopener noreferrer" className="landing-btn" style={{ background: 'rgba(0,0,0,0.15)', color: '#0f0f10', padding: '20px 40px', fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', fontFamily: HEADLINE, transition: 'opacity 0.2s' }}>
                BuildWithLocus <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ width: '100%', padding: `80px ${PX}`, background: '#0f0f10', borderTop: '1px solid #2a2a2b' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '48px', flexWrap: 'wrap', maxWidth: '1440px', margin: '0 auto' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', fontWeight: 900, color: '#fdfdfd', fontFamily: HEADLINE, textTransform: 'uppercase', marginBottom: '32px' }}>
              <Image src="/logo.png" alt="Locus" width={24} height={24} style={{ flexShrink: 0 }} />
              Locus Studio
            </div>
            <p style={{ color: '#666668', fontFamily: HEADLINE, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', maxWidth: '320px', lineHeight: 1.6 }}>
              2025 Locus Studio — BuildWithLocus. Precision-engineered checkout infrastructure.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '64px' }}>
            <FooterColumn title="Platform" links={['Studio', 'Documentation', 'Status']} hrefs={['/dashboard', '#', '#']} />
            <FooterColumn title="Legal" links={['Privacy', 'Terms']} hrefs={['#', '#']} />
            <FooterColumn title="Connect" links={[{ name: 'Twitter / X', icon: <Link2 size={14} /> }, { name: 'GitHub', icon: <Code2 size={14} /> }]} hrefs={['https://x.com/paywithlocus', 'https://github.com/maulana-tech/buildwithlocus']} />
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: string }) {
  return (
    <div className={`sr landing-card`} style={{ padding: '40px', minHeight: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid #f4f4f5', borderBottom: '1px solid #f4f4f5', cursor: 'default', transitionDelay: delay }}>
      {icon}
      <div>
        <h3 style={{ fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '-0.02em', fontFamily: HEADLINE }}>{title}</h3>
        <p style={{ color: '#666668', lineHeight: 1.6 }}>{description}</p>
      </div>
    </div>
  );
}

function FooterColumn({ title, links, hrefs }: { title: string; links: (string | { name: string; icon: React.ReactNode })[]; hrefs: string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h5 style={{ color: '#fdfdfd', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', fontSize: '11px', fontFamily: HEADLINE, marginBottom: '8px' }}>{title}</h5>
      {links.map((link, i) => {
        const name = typeof link === 'string' ? link : link.name;
        const icon = typeof link === 'string' ? null : link.icon;
        return (
          <a key={name} href={hrefs[i]} target={hrefs[i].startsWith('http') ? '_blank' : undefined} rel={hrefs[i].startsWith('http') ? 'noopener noreferrer' : undefined} style={{ color: '#666668', fontFamily: HEADLINE, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {name} {icon}
          </a>
        );
      })}
    </div>
  );
}
