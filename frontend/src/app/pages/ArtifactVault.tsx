import React from 'react';
import { ThemeToggle } from '../components/ThemeToggle';

export default function ArtifactVault() {
  return (
    <div className="min-h-screen bg-app-bg text-text-primary font-body flex flex-col overflow-x-hidden selection:bg-violet/30 relative">
      {/* Background Decorators */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(circle_at_50%_0%,_rgba(123,97,255,0.08)_0%,_transparent_70%)] pointer-events-none z-0"></div>

      {/* TopAppBar */}
      <header className="fixed top-0 z-50 flex justify-between items-center w-full px-6 py-3 bg-app-bg transition-colors border-b border-border-default/50">
        <div className="flex items-center gap-8">
          <span className="text-xl font-black tracking-tighter text-text-primary">Antigravity AI</span>
          <div className="hidden md:flex items-center gap-8 ml-4">
            <nav className="flex gap-6 text-sm font-label tracking-widest uppercase">
              <a className="text-text-secondary hover:text-text-primary transition-colors duration-200" href="#">Terminal</a>
              <a className="text-text-secondary hover:text-text-primary transition-colors duration-200" href="#">Monitoring</a>
              <a className="text-emerald font-bold border-b-2 border-emerald" href="/artifact-vault">Artifacts</a>
            </nav>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group hidden sm:block">
            <span className="absolute inset-y-0 left-3 flex items-center text-text-tertiary">
              <span className="material-symbols-outlined text-sm">search</span>
            </span>
            <input className="bg-surface-container-lowest border-none rounded-lg pl-10 pr-4 py-1.5 text-xs font-label tracking-widest focus:ring-1 focus:ring-violet w-64 transition-all text-text-primary outline-none" placeholder="SEARCH ARCHIVES..." type="text"/>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="material-symbols-outlined text-text-secondary hover:text-text-primary cursor-pointer transition-colors text-[20px] flex items-center justify-center p-2">monitoring</span>
            <span className="material-symbols-outlined text-text-secondary hover:text-text-primary cursor-pointer transition-colors text-[20px] flex items-center justify-center p-2">settings</span>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-border-default/30">
              <img alt="Lead Developer Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb9gDXjsc8YKnkWOScSGMXRImuQNyVUKWVpw5JfmumcGRztPkWIovjgDS8f3-aQLGTt94pduE8yltgTsuwD8q7kXppg3ibPXABFz05yd0pBzI0HD6AezcdzWisT8GgVP2FBby4FHnQG7qcNBSTYeF4vNk1hg8F6qJ3xBIddNLg_eD_gntJQngS7597y9t54W9CxBrOx-6JMacre6zxWibYuCa0HIfun6jm_P4IJgd-H4D2ca5bm1RXavu1-OBJqJrFFs6RzUdCHU8"/>
            </div>
          </div>
        </div>
      </header>

      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-sidebar-bg hidden md:flex flex-col pt-20 border-r border-border-default transition-colors z-40">
        <div className="px-6 mb-8">
          <h2 className="text-xs font-label uppercase tracking-[0.2em] text-text-tertiary mb-1">Project Void</h2>
          <p className="text-[10px] font-label text-emerald flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse"></span>
            5 Parallel Agents Active
          </p>
        </div>
        <nav className="flex-grow flex flex-col">
          <a className="text-text-secondary flex items-center gap-3 px-6 py-3 hover:bg-elevated hover:text-text-primary transition-all" href="/mission-control">
            <span className="material-symbols-outlined text-xl">dashboard</span>
            <span className="font-label text-sm tracking-wide">Mission Control</span>
          </a>
          <a className="text-text-secondary flex items-center gap-3 px-6 py-3 hover:bg-elevated hover:text-text-primary transition-all" href="/neural-editor">
            <span className="material-symbols-outlined text-xl">code_blocks</span>
            <span className="font-label text-sm tracking-wide">Neural Editor</span>
          </a>
          <a className="text-text-secondary flex items-center gap-3 px-6 py-3 hover:bg-elevated hover:text-text-primary transition-all" href="#">
            <span className="material-symbols-outlined text-xl">smart_toy</span>
            <span className="font-label text-sm tracking-wide">Agent Swarm</span>
          </a>
          <a className="text-text-primary bg-violet/10 border-l-2 border-violet flex items-center gap-3 px-6 py-3 transition-all" href="/artifact-vault">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
            <span className="font-label text-sm tracking-wide">Artifact Vault</span>
          </a>
          <a className="text-text-secondary flex items-center gap-3 px-6 py-3 hover:bg-elevated hover:text-text-primary transition-all" href="#">
            <span className="material-symbols-outlined text-xl">terminal</span>
            <span className="font-label text-sm tracking-wide">System Logs</span>
          </a>
        </nav>
        <div className="p-6">
          <button className="w-full py-3 rounded-xl bg-violet text-white font-label font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-violet/20 flex items-center justify-center">
            New Agent
          </button>
        </div>
        <div className="mt-auto border-t border-border-default">
          <a className="text-text-secondary flex items-center gap-3 px-6 py-4 hover:text-text-primary transition-all text-sm" href="#">
            <span className="material-symbols-outlined text-lg">help</span>
            <span>Docs</span>
          </a>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="md:ml-64 pt-20 px-6 md:px-10 pb-20 relative z-10 flex-grow">
        {/* Hero Section / Header */}
        <header className="max-w-7xl mx-auto py-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter text-text-primary">
              Artifact <span className="text-violet italic">Vault</span>
            </h1>
            <p className="text-text-secondary max-w-lg font-light leading-relaxed">
              Historical ledger of parallel agent computational outputs, verified builds, and neural planning transcripts.
            </p>
          </div>
          <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-lg self-start md:self-auto border border-border-default/50">
            <button className="px-4 py-2 rounded-md bg-surface text-text-primary flex items-center gap-2 shadow-sm border border-border-default/50">
              <span className="material-symbols-outlined text-sm">grid_view</span>
              <span className="text-xs font-label font-bold tracking-widest uppercase">Grid</span>
            </button>
            <button className="px-4 py-2 rounded-md text-text-secondary hover:text-text-primary flex items-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-sm">list</span>
              <span className="text-xs font-label font-bold tracking-widest uppercase">List</span>
            </button>
          </div>
        </header>

        {/* Search & Filter Bar */}
        <section className="max-w-7xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-violet">
                <span className="material-symbols-outlined">filter_list</span>
              </span>
              <input className="w-full bg-surface-container-low border border-border-default/50 rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-violet transition-all text-text-primary outline-none" placeholder="Query artifacts by keyword, hash, or agent ID..." type="text"/>
            </div>
            <div className="flex gap-2">
              <button className="px-6 py-4 bg-surface-container-low rounded-xl text-text-secondary text-xs font-label font-bold uppercase tracking-widest hover:text-text-primary border border-border-default/50 hover:border-border-default transition-all">
                Type: All
              </button>
              <button className="px-6 py-4 bg-surface-container-low rounded-xl text-text-secondary text-xs font-label font-bold uppercase tracking-widest hover:text-text-primary border border-border-default/50 hover:border-border-default transition-all">
                Date: Last 24h
              </button>
            </div>
          </div>
        </section>

        {/* Bento Grid Artifacts */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Artifact Card 1: Implementation Plan */}
          <div className="glass-card rounded-xl p-6 flex flex-col group hover:translate-y-[-4px] transition-transform duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-label font-bold tracking-tighter bg-violet/20 text-violet uppercase border border-violet/10">Agent-882</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-label font-bold tracking-tighter bg-saffron/20 text-saffron uppercase border border-saffron/10">Planning</span>
              </div>
              <span className="text-[10px] font-label text-text-tertiary uppercase tracking-wider">12:04:22 UTC</span>
            </div>
            <h3 className="text-xl font-headline font-bold text-text-primary group-hover:text-violet transition-colors mb-2">Refactoring Legacy Core Modules</h3>
            <p className="text-text-secondary text-sm font-light line-clamp-3 mb-6">
              Proposed architectural shift for data ingestion pipeline to reduce latency during peak swarm synchronization cycles.
            </p>
            <div className="mt-auto pt-6 border-t border-border-default/50 flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-label text-text-tertiary">
                <span className="material-symbols-outlined text-sm">description</span>
                Implementation Plan
              </span>
              <button className="material-symbols-outlined text-text-secondary hover:text-violet transition-colors text-[20px]">open_in_new</button>
            </div>
          </div>

          {/* Artifact Card 2: Verified Build */}
          <div className="glass-card rounded-xl p-6 flex flex-col group hover:translate-y-[-4px] transition-transform duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-label font-bold tracking-tighter bg-violet/20 text-violet uppercase border border-violet/10">Agent-104</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-label font-bold tracking-tighter bg-emerald/20 text-emerald uppercase border border-emerald/10">Completed</span>
              </div>
              <span className="text-[10px] font-label text-text-tertiary uppercase tracking-wider">09:15:01 UTC</span>
            </div>
            <h3 className="text-xl font-headline font-bold text-text-primary group-hover:text-emerald transition-colors mb-2">Neural Link v4.2.1 Stable</h3>
            <p className="text-text-secondary text-sm font-light line-clamp-3 mb-6">
              Final build of the neural link interface protocol. Passes all safety checks and edge-case regression tests.
            </p>
            <div className="mt-auto pt-6 border-t border-border-default/50 flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-label text-text-tertiary">
                <span className="material-symbols-outlined text-sm">verified</span>
                Verified Build
              </span>
              <button className="material-symbols-outlined text-text-secondary hover:text-emerald transition-colors text-[20px]">download</button>
            </div>
          </div>

          {/* Artifact Card 3: Recording Transcript */}
          <div className="glass-card rounded-xl p-6 flex flex-col group hover:translate-y-[-4px] transition-transform duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-label font-bold tracking-tighter bg-violet/20 text-violet uppercase border border-violet/10">Agent-911</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-label font-bold tracking-tighter bg-saffron/20 text-saffron uppercase border border-saffron/10">Planning</span>
              </div>
              <span className="text-[10px] font-label text-text-tertiary uppercase tracking-wider">08:44:59 UTC</span>
            </div>
            <h3 className="text-xl font-headline font-bold text-text-primary group-hover:text-violet transition-colors mb-2">Swarm Conflict Resolution Log</h3>
            <p className="text-text-secondary text-sm font-light line-clamp-3 mb-6">
              Raw audio/text transcript of the sub-agent consensus negotiation regarding resource allocation priorities.
            </p>
            <div className="mt-auto pt-6 border-t border-border-default/50 flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-label text-text-tertiary">
                <span className="material-symbols-outlined text-sm">mic</span>
                Recording Transcript
              </span>
              <button className="material-symbols-outlined text-text-secondary hover:text-violet transition-colors text-[20px]">play_circle</button>
            </div>
          </div>

          {/* Artifact Card 4: Detailed Verified Build */}
          <div className="glass-card rounded-xl p-6 flex flex-col group hover:translate-y-[-4px] transition-transform duration-300 lg:col-span-2">
            <div className="flex flex-col md:flex-row gap-6 h-full">
              <div className="w-full md:w-2/5 rounded-lg overflow-hidden bg-surface-container-lowest border border-border-default">
                <img alt="Artifact visualization" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDP-BuCqyKwChUfWY6-50FzoqGH53cWzkCCjxZ4Z9p3AQIeRPlHA1nTJymRV2c1WguiGPcjbf2bpd4SOD-BfVWt6hwpmqtqR8LOw7Gp0orQLjXfi7F_TGRKZfXazmZvIw7Cip_MDizqY_a9ZoyXdaOndQzUWZ2gzIs6r2HiL7WccsKj7JuQLF3LkbD7oiNYzUxa0owdYy5ZL4gAqmNGhKIgp3TGFMs4a2xL_YDyTP4_f6agsEvsI5sjLcgtiuRMVsn54aT5anATzN0"/>
              </div>
              <div className="flex-grow flex flex-col pt-2 pb-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-label font-bold tracking-tighter bg-violet/20 text-violet uppercase border border-violet/10">Global-Root</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-label font-bold tracking-tighter bg-emerald/20 text-emerald uppercase border border-emerald/10">Completed</span>
                  </div>
                  <span className="text-[10px] font-label text-text-tertiary uppercase tracking-wider">Yesterday</span>
                </div>
                <h3 className="text-2xl font-headline font-bold text-text-primary mb-3 group-hover:text-emerald transition-colors">Void-Chain Synchronization Patch</h3>
                <p className="text-text-secondary text-sm font-light mb-6 flex-grow">
                  A critical patch addressing the drift between parallel timelines in the agent swarm. This build ensures all agents operate on a unified temporal baseline, preventing artifact collisions.
                </p>
                <div className="mt-auto pt-6 border-t border-border-default/50 flex items-center justify-between">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-2 text-xs font-label text-text-tertiary uppercase tracking-tighter">
                      <span className="material-symbols-outlined text-sm text-emerald">verified</span>
                      Verified Build
                    </span>
                    <span className="flex items-center gap-2 text-xs font-label text-text-tertiary uppercase tracking-tighter">
                      <span className="material-symbols-outlined text-sm">history</span>
                      v9.11.0
                    </span>
                  </div>
                  <button className="bg-elevated border border-border-default text-text-primary px-6 py-2 rounded-lg text-xs font-label font-bold tracking-widest uppercase hover:bg-violet hover:text-white hover:border-violet transition-all shadow-sm group-hover:border-violet/50">Details</button>
                </div>
              </div>
            </div>
          </div>

          {/* Artifact Card 5: Implementation Plan */}
          <div className="glass-card rounded-xl p-6 flex flex-col group hover:translate-y-[-4px] transition-transform duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-label font-bold tracking-tighter bg-violet/20 text-violet uppercase border border-violet/10">Agent-001</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-label font-bold tracking-tighter bg-saffron/20 text-saffron uppercase border border-saffron/10">Planning</span>
              </div>
              <span className="text-[10px] font-label text-text-tertiary uppercase tracking-wider">04:12:11 UTC</span>
            </div>
            <h3 className="text-xl font-headline font-bold text-text-primary group-hover:text-violet transition-colors mb-2">Heuristic Analysis Model</h3>
            <p className="text-text-secondary text-sm font-light line-clamp-3 mb-6">
              New model for predicting potential system bottlenecks before they manifest in the production environment.
            </p>
            <div className="mt-auto pt-6 border-t border-border-default/50 flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-label text-text-tertiary">
                <span className="material-symbols-outlined text-sm">analytics</span>
                Logic Frame
              </span>
              <button className="material-symbols-outlined text-text-secondary hover:text-violet transition-colors text-[20px]">visibility</button>
            </div>
          </div>

        </div>

        {/* Pagination / Load More */}
        <div className="max-w-7xl mx-auto mt-16 flex justify-center pb-10">
          <button className="group flex flex-col items-center gap-2">
            <span className="text-xs font-label font-bold tracking-[0.3em] text-text-tertiary group-hover:text-text-primary transition-colors uppercase">Decrypt More Artifacts</span>
            <span className="material-symbols-outlined text-violet group-hover:translate-y-1 transition-transform">keyboard_double_arrow_down</span>
          </button>
        </div>
      </main>

      {/* Bottom Nav Shell (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-md flex justify-around items-center px-4 py-3 z-50 border-t border-border-default">
        <a href="/mission-control" className="flex flex-col items-center gap-1 text-text-secondary">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-label uppercase">Control</span>
        </a>
        <a href="/neural-editor" className="flex flex-col items-center gap-1 text-text-secondary">
          <span className="material-symbols-outlined">smart_toy</span>
          <span className="text-[10px] font-label uppercase">Agents</span>
        </a>
        <a href="/artifact-vault" className="flex flex-col items-center gap-1 text-emerald">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
          <span className="text-[10px] font-label uppercase font-bold">Vault</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-text-secondary">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-label uppercase">System</span>
        </a>
      </nav>
    </div>
  );
}
