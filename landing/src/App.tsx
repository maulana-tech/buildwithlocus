/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { motion } from "motion/react";
import Lenis from "lenis";
import { 
  ArrowRight, 
  Terminal, 
  Cpu, 
  Lock, 
  Activity, 
  Rocket, 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  Github,
  Twitter,
  Disc as Discord
} from "lucide-react";

const navLinks = ["Product", "Developers", "Features", "Blog"];

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-6 bg-surface/80 backdrop-blur-md border-b border-white/5">
        <div className="text-2xl font-black tracking-tighter uppercase font-headline">
          Locus Agent
        </div>
        
        <nav className="hidden md:flex items-center space-x-10 font-headline font-bold tracking-tight uppercase text-sm">
          {navLinks.map((link, i) => (
            <a 
              key={link} 
              href="#" 
              className={`${i === 0 ? "text-white border-b-2 border-white" : "text-zinc-400 hover:text-white"} transition-colors`}
            >
              {link}
            </a>
          ))}
        </nav>

        <button className="bg-white text-black font-headline font-bold uppercase px-6 py-2 hover:bg-primary hover:text-white transition-all text-sm">
          Get Started
        </button>
      </header>

      <main className="pt-24">
        {/* Monolithic Content Wrapper */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 lg:px-32 mb-20">
          <div className="bg-white text-black overflow-hidden relative">
            {/* Hero Section */}
            <section className="min-h-[85vh] flex flex-col justify-center items-center px-6 md:px-20 text-center relative overflow-hidden bg-white">
              <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '40px 40px' }}
              />
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 max-w-6xl"
              >
                <h1 className="text-5xl md:text-[84px] font-black leading-[0.95] tracking-tighter uppercase mb-8">
                  Build the future of agents, on Locus.
                </h1>
                <p className="text-lg md:text-xl font-medium text-zinc-600 max-w-2xl mx-auto mb-12 leading-relaxed">
                  Deploy production-grade autonomous systems with surgical precision. Scale your AI workforce on the most resilient infrastructure ever engineered.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <button className="bg-black text-white px-8 py-4 text-lg font-black uppercase flex items-center justify-center gap-3 hover:bg-primary transition-colors">
                    Start Deploying <ArrowRight className="w-5 h-5" />
                  </button>
                  <button className="border-3 border-black text-black px-8 py-4 text-lg font-black uppercase hover:bg-black hover:text-white transition-colors">
                    Read Whitepaper
                  </button>
                </div>
              </motion.div>

              <div className="absolute bottom-10 right-10 font-headline font-bold text-xs tracking-[0.2em] opacity-30 hidden md:block uppercase">
                SYSTEM_VERSION: 2.04.1 // CORE_LATENCY: 0.002MS
              </div>
            </section>

            {/* Infrastructure Section */}
            <section className="py-32 px-6 md:px-20 border-t border-black/5 bg-white">
              <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Infrastructure For Autonomy</h2>
                  <p className="text-zinc-600 max-w-xl text-base md:text-lg">No fluff. Just raw computing power and deterministic protocols for the next generation of digital entities.</p>
                </div>
                <div className="font-headline text-7xl font-black opacity-5">01</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 border border-zinc-100">
                {/* Feature 1 */}
                <div className="group p-10 min-h-[380px] flex flex-col justify-between hover:bg-zinc-50 transition-colors border-r border-b border-zinc-100">
                  <Terminal className="w-10 h-10 text-black" />
                  <div>
                    <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">Write smarter agents</h3>
                    <p className="text-zinc-600 text-sm md:text-base leading-relaxed">A high-level DSL designed for logical consistency and rapid prototyping of complex decision loops.</p>
                  </div>
                </div>
                {/* Feature 2 */}
                <div className="group p-10 min-h-[380px] flex flex-col justify-between hover:bg-zinc-50 transition-colors border-r border-b border-zinc-100">
                  <Cpu className="w-10 h-10 text-black" />
                  <div>
                    <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">Scale your nodes</h3>
                    <p className="text-zinc-600 text-sm md:text-base leading-relaxed">Elastic orchestration that expands with your agent population. Zero downtime, maximum throughput.</p>
                  </div>
                </div>
                {/* Feature 3 */}
                <div className="group p-10 min-h-[380px] flex flex-col justify-between hover:bg-zinc-50 transition-colors border-b border-zinc-100">
                  <Lock className="w-10 h-10 text-black" />
                  <div>
                    <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">Hardened Guardrails</h3>
                    <p className="text-zinc-600 text-sm md:text-base leading-relaxed">Every agent operates in a cryptographically isolated environment. Permissioned by design.</p>
                  </div>
                </div>
                {/* Big Feature (Span 2) */}
                <div className="group md:col-span-2 p-10 min-h-[380px] flex flex-col md:flex-row gap-12 items-center hover:bg-zinc-50 transition-colors border-r border-zinc-100">
                  <div className="flex-1">
                    <Activity className="w-10 h-10 text-black mb-6" />
                    <h3 className="text-3xl font-black uppercase mb-4 tracking-tight">Real-time Telemetry</h3>
                    <p className="text-zinc-600 text-sm md:text-base leading-relaxed max-w-md">Monitor every thought process and action execution with millisecond precision. Full observability for total control.</p>
                  </div>
                  <div className="w-full md:w-1/2 h-64 bg-zinc-100 relative overflow-hidden">
                    <img 
                      className="w-full h-full object-cover grayscale brightness-90 contrast-125" 
                      src="https://picsum.photos/seed/telemetry/800/600" 
                      alt="Telemetry visualization"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                </div>
                {/* Highlight Feature */}
                <div className="group bg-black p-10 min-h-[380px] flex flex-col justify-between hover:bg-primary transition-colors cursor-pointer">
                  <Rocket className="w-10 h-10 text-white" />
                  <div className="text-white">
                    <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">Instant Deployment</h3>
                    <p className="text-white/80 text-sm md:text-base leading-relaxed font-medium">From local code to global distribution in under 60 seconds. Built for speed.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Intel Report Section */}
        <section className="bg-surface py-32 px-6 md:px-20 overflow-hidden">
          <div className="mb-20 flex flex-col md:flex-row justify-between items-center gap-6">
            <h2 className="text-5xl font-black uppercase tracking-tighter text-white">Locus Intel Report</h2>
            <div className="flex gap-4">
              <button className="bg-white/10 text-white p-4 hover:bg-white hover:text-black transition-all">
                <ChevronLeft />
              </button>
              <button className="bg-white/10 text-white p-4 hover:bg-white hover:text-black transition-all">
                <ChevronRight />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <ReportCard 
              type="Tech Brief // 01.12.24"
              title="Optimizing Multi-Agent Swarm Intelligence"
              category="Article"
              icon={<ExternalLink className="w-4 h-4" />}
              img="https://picsum.photos/seed/robot/600/400"
            />
            <ReportCard 
              type="Video Stream // 11.28.24"
              title="LCus Keynote: The Autonomous Paradigm"
              category="42:15 Mins"
              icon={<Play className="w-4 h-4 fill-current" />}
              img="https://picsum.photos/seed/server/600/400"
              isVideo
            />
            <ReportCard 
              type="Security Alert // 11.25.24"
              title="Zero-Trust Architecture for AI Agents"
              category="Article"
              icon={<Lock className="w-4 h-4" />}
              img="https://picsum.photos/seed/circuit/600/400"
            />
             <ReportCard 
              type="Industry // 11.20.24"
              title="Scaling Beyond One Million Agents"
              category="Case Study"
              icon={<Activity className="w-4 h-4" />}
              img="https://picsum.photos/seed/city/600/400"
            />
          </div>
        </section>

        {/* Subscription Section */}
        <section className="bg-primary py-32 px-6 md:px-20">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <h2 className="text-5xl font-black uppercase tracking-tighter text-white mb-6 leading-none italic">Stay Wired.</h2>
              <p className="text-xl text-white/90 font-medium">Join 50k+ engineers receiving technical deep dives into autonomous agent architecture.</p>
            </div>
            <div className="w-full md:w-1/2 flex">
              <input 
                type="email" 
                placeholder="EMAIL@PROTOCOL.COM"
                className="w-full bg-black text-white px-6 py-5 border-none focus:ring-0 font-headline uppercase font-bold text-lg"
              />
              <button className="bg-zinc-800 text-white px-8 py-5 font-black uppercase hover:bg-black transition-colors border-l border-white/10">
                Join
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 md:px-12 py-20 bg-surface border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="mb-12 md:mb-0">
            <div className="text-2xl font-black text-white font-headline uppercase mb-8">
              Locus Agent
            </div>
            <p className="text-zinc-500 font-headline text-xs tracking-[0.2em] uppercase max-w-xs leading-relaxed">
              © 2024 Locus Agent - BuildWithLocus. Precision Engineered for the autonomous future.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
            <FooterColumn 
              title="Platform" 
              links={["Documentation", "Changelog", "Status"]} 
            />
            <FooterColumn 
              title="Legal" 
              links={["Privacy", "Terms"]} 
            />
            <FooterColumn 
              title="Connect" 
              links={[
                { name: "Twitter / X", icon: <Twitter className="w-3 h-3" /> },
                { name: "Discord", icon: <Discord className="w-3 h-3" /> },
                { name: "GitHub", icon: <Github className="w-3 h-3" /> }
              ]} 
            />
          </div>
        </div>
      </footer>
    </div>
  );
}

function ReportCard({ type, title, category, icon, img, isVideo = false }: { type: string, title: string, category: string, icon: React.ReactNode, img: string, isVideo?: boolean }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group bg-white text-black border border-transparent hover:border-black transition-all cursor-pointer overflow-hidden"
    >
      <div className="aspect-video w-full overflow-hidden bg-black relative">
        <img 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0" 
          src={img} 
          alt={title}
          referrerPolicy="no-referrer"
        />
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-black/80 flex items-center justify-center group-hover:bg-primary transition-colors">
              <Play className="text-white fill-current" />
            </div>
          </div>
        )}
      </div>
      <div className="p-8">
        <div className="text-[10px] font-bold text-zinc-400 mb-3 font-headline tracking-[0.2em] uppercase">
          {type}
        </div>
        <h4 className="text-xl font-black uppercase mb-6 leading-tight group-hover:text-primary transition-colors min-h-[2.5rem]">
          {title}
        </h4>
        <div className="flex justify-between items-center text-zinc-500">
          <span className="text-[10px] font-bold uppercase font-headline tracking-widest">
            {category}
          </span>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function FooterColumn({ title, links }: { title: string, links: (string | { name: string, icon: React.ReactNode })[] }) {
  return (
    <div className="flex flex-col space-y-4">
      <h5 className="text-white font-black uppercase tracking-tighter mb-2 text-sm">{title}</h5>
      {links.map((link) => {
        const name = typeof link === "string" ? link : link.name;
        const icon = typeof link === "string" ? null : link.icon;
        return (
          <a key={name} href="#" className="text-zinc-500 font-headline text-[10px] tracking-[0.15em] uppercase hover:text-white transition-all flex items-center gap-2">
            {name} {icon}
          </a>
        );
      })}
    </div>
  );
}
