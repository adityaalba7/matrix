import React from 'react';
import { ThemeToggle } from '../components/ThemeToggle';

export default function NeuralEditor() {
  return (
    <div className="min-h-screen bg-app-bg text-text-primary font-body flex flex-col overflow-hidden selection:bg-violet/30 selection:text-violet relative">
      <div className="focus-orb"></div>
      
      {/* TopAppBar */}
      <header className="bg-app-bg fixed top-0 z-50 flex justify-between items-center w-full px-6 py-3 border-b border-border-default transition-colors">
        <div className="flex items-center gap-8">
          <div className="text-xl font-black tracking-tighter text-text-primary">Antigravity AI</div>
          <nav className="hidden md:flex items-center gap-6">
            <a className="text-text-secondary hover:text-text-primary transition-colors duration-200 font-label text-xs uppercase tracking-wider" href="/mission-control">Mission Control</a>
            <a className="text-emerald font-bold border-b-2 border-emerald font-label text-xs uppercase tracking-wider py-1" href="/neural-editor">Neural Editor</a>
            <a className="text-text-secondary hover:text-text-primary transition-colors duration-200 font-label text-xs uppercase tracking-wider" href="#">Agent Swarm</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-surface-container-low flex items-center px-3 py-1.5 rounded-lg border border-border-default/20 hidden sm:flex">
            <span className="material-symbols-outlined text-text-tertiary mr-2 text-[20px]">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm font-label w-48 placeholder:text-text-tertiary/50 outline-none text-text-primary" placeholder="Search parameters..." type="text"/>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="p-2 text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">terminal</span>
            </button>
            <button className="p-2 text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">monitoring</span>
            </button>
            <button className="p-2 text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
          </div>
          <img alt="Lead Developer Avatar" className="w-8 h-8 rounded-full border border-violet/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIBUiP7q8SpSN7YMIm2PaO-CqtCiOGU9QW_l3JwL93LjxtJ6tiv8uJ8uoVNP3UJNWS1TlV5N2ZrU_EgDpqa0nbPxKvSZ1hyTdzQdz5tUOcGtlY1ksoecUN5DvxM6c-AMapd2IIt9PW_-d_j-BgYz_8XM1ElSJkllLgR_RtjTix8-C-YrFAWGCthd95Za-ueAvYbf-LICKzEjzGooF0XS5R5NDH7D16yz4bWqTNV_eFvJiTvzEkgseiDKlbDnwJTtizr38IC1xTHYA"/>
        </div>
      </header>
      
      {/* SideNavBar */}
      <aside className="bg-sidebar-bg fixed left-0 top-0 h-full w-64 pt-16 flex flex-col z-40 border-r border-border-default transition-colors hidden md:flex">
        <div className="px-6 py-8">
          <div className="font-headline font-bold text-lg text-text-primary">Project Void</div>
          <div className="font-label text-[10px] uppercase tracking-widest text-emerald mt-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse"></span>
            5 Parallel Agents Active
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          <a className="text-text-secondary flex items-center gap-3 px-4 py-3 hover:bg-elevated hover:text-text-primary transition-all rounded-lg group" href="/mission-control">
            <span className="material-symbols-outlined group-hover:text-violet transition-colors text-[20px]">dashboard</span>
            <span className="font-headline text-sm font-medium">Mission Control</span>
          </a>
          <a className="text-text-primary bg-violet/10 border-l-2 border-violet flex items-center gap-3 px-4 py-3 rounded-r-lg" href="/neural-editor">
            <span className="material-symbols-outlined text-violet text-[20px]">code_blocks</span>
            <span className="font-headline text-sm font-semibold">Neural Editor</span>
          </a>
          <a className="text-text-secondary flex items-center gap-3 px-4 py-3 hover:bg-elevated hover:text-text-primary transition-all rounded-lg group" href="#">
            <span className="material-symbols-outlined group-hover:text-violet transition-colors text-[20px]">smart_toy</span>
            <span className="font-headline text-sm font-medium">Agent Swarm</span>
          </a>
          <a className="text-text-secondary flex items-center gap-3 px-4 py-3 hover:bg-elevated hover:text-text-primary transition-all rounded-lg group" href="/artifact-vault">
            <span className="material-symbols-outlined group-hover:text-violet transition-colors text-[20px]">inventory_2</span>
            <span className="font-headline text-sm font-medium">Artifact Vault</span>
          </a>
          <a className="text-text-secondary flex items-center gap-3 px-4 py-3 hover:bg-elevated hover:text-text-primary transition-all rounded-lg group" href="#">
            <span className="material-symbols-outlined group-hover:text-violet transition-colors text-[20px]">terminal</span>
            <span className="font-headline text-sm font-medium">System Logs</span>
          </a>
        </nav>
        <div className="p-6 border-t border-border-default space-y-4">
          <button className="w-full bg-violet py-2.5 rounded-lg text-white font-headline font-bold text-sm shadow-lg shadow-violet/10 hover:brightness-110 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">add</span>
            New Agent
          </button>
          <div className="space-y-1">
            <a className="flex items-center gap-3 px-4 py-2 text-text-secondary hover:text-text-primary transition-colors text-xs font-label" href="#">
              <span className="material-symbols-outlined text-sm">help</span> Docs
            </a>
            <a className="flex items-center gap-3 px-4 py-2 text-text-secondary hover:text-text-primary transition-colors text-xs font-label" href="#">
              <span className="material-symbols-outlined text-sm">contact_support</span> Support
            </a>
          </div>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="md:ml-64 pt-16 flex-1 relative flex flex-col h-screen">
        
        {/* Floating Agent Status Bar */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-border-default/50 z-10 bg-app-bg/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center border-2 border-border-default" title="Agent Alpha: Idle">
                <span className="material-symbols-outlined text-xs text-emerald">bolt</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center border-2 border-border-default" title="Agent Beta: Reasoning">
                <span className="material-symbols-outlined text-xs text-saffron">psychology</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center border-2 border-border-default" title="Agent Gamma: Coding">
                <span className="material-symbols-outlined text-xs text-violet">code</span>
              </div>
            </div>
            <div className="h-6 w-[1px] bg-border-default"></div>
            <div className="flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded-full">
              <span className="w-2 h-2 rounded-full bg-saffron shadow-[0_0_8px_rgba(255,122,26,0.6)]"></span>
              <span className="font-label text-[10px] uppercase tracking-tighter text-text-secondary">Gamma reasoning: refactoring App.js for performance</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-sm transition-colors border border-border-default">
              <span className="material-symbols-outlined text-sm text-emerald">play_arrow</span>
              <span className="font-headline font-semibold text-text-primary">Deploy</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 bg-surface-container-high rounded-lg text-sm border border-border-default text-text-primary">
              <span className="material-symbols-outlined text-sm">fork_right</span>
              <span className="font-headline font-semibold">Fork</span>
            </button>
          </div>
        </div>

        {/* Triple Pane Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-px bg-border-default overflow-hidden z-10">
          
          {/* Pane 1: Code Editor */}
          <section className="md:col-span-4 bg-surface flex flex-col overflow-hidden">
            <div className="px-4 py-2 bg-elevated flex items-center justify-between border-b border-border-default">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-violet text-sm">javascript</span>
                <span className="font-label text-xs font-semibold text-text-primary">App.tsx</span>
              </div>
              <span className="material-symbols-outlined text-text-tertiary text-xs">unfold_more</span>
            </div>
            <div className="flex-1 overflow-auto hide-scrollbar p-6 font-mono text-[13px] leading-relaxed">
              <div className="flex gap-4">
                <div className="text-text-tertiary/50 text-right select-none w-6 hidden sm:block">
                  1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7<br/>8<br/>9<br/>10<br/>11<br/>12<br/>13<br/>14<br/>15<br/>16<br/>17<br/>18<br/>19<br/>20
                </div>
                <div className="flex-1 text-text-primary">
                  <span className="text-violet italic">import</span> React <span className="text-violet italic">from</span> <span className="text-emerald">'react'</span>;<br/>
                  <span className="text-violet italic">import</span> {'{ Dashboard }'} <span className="text-violet italic">from</span> <span className="text-emerald">'./components'</span>;<br/>
                  <br/>
                  <span className="text-violet">const</span> <span className="text-saffron">App</span> = () {'=>'} {'{'}<br/>
                  &nbsp;&nbsp;<span className="text-violet">const</span> [data, setData] = React.useState(<span className="text-emerald">null</span>);<br/>
                  <br/>
                  &nbsp;&nbsp;<span className="text-text-tertiary/80">// Fetch agent telemetry</span><br/>
                  &nbsp;&nbsp;React.useEffect(() {'=>'} {'{'}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;fetchTelemetry().then(setData);<br/>
                  &nbsp;&nbsp;{'}'}, []);<br/>
                  <br/>
                  &nbsp;&nbsp;<span className="text-violet">return</span> (<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;{'<'}<span className="text-violet">div</span> className=<span className="text-emerald">"canvas"</span>{'>'}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'<'}<span className="text-saffron">Header</span> title=<span className="text-emerald">"VoidOS"</span> /{'>'}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'<'}<span className="text-saffron">Dashboard</span> payload={'{data}'} /{'>'}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;{'</'}<span className="text-violet">div</span>{'>'}<br/>
                  &nbsp;&nbsp;);<br/>
                  {'}'};<br/>
                  <br/>
                  <span className="text-violet italic">export default</span> App;
                </div>
              </div>
            </div>
          </section>

          {/* Pane 2: Terminal */}
          <section className="md:col-span-3 bg-app-bg flex flex-col overflow-hidden">
            <div className="px-4 py-2 bg-elevated flex items-center justify-between border-b border-border-default">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-text-primary text-sm">terminal</span>
                <span className="font-label text-xs font-semibold text-text-primary">system-shell</span>
              </div>
              <div className="flex gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose border border-rose/50"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-saffron border border-saffron/50"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald border border-emerald/50"></span>
              </div>
            </div>
            <div className="flex-1 overflow-auto hide-scrollbar p-4 font-mono text-[12px] bg-app-bg text-text-secondary">
              <div className="space-y-1.5">
                <div className="text-text-tertiary">[14:22:01] <span className="text-text-primary">Initializing agent cluster...</span></div>
                <div className="text-text-tertiary">[14:22:02] <span className="text-emerald">SUCCESS:</span> Agent-Alpha-7 established connection.</div>
                <div className="text-text-tertiary">[14:22:04] <span className="text-violet">INFO:</span> Compiling TypeScript assets...</div>
                <div className="text-text-tertiary">[14:22:08] <span className="text-text-secondary italic">Refactoring internal hooks in components/Metrics.tsx</span></div>
                <div className="text-text-tertiary">[14:22:10] <span className="text-saffron">REASONING:</span> Optimization identified in render loop. Applying memoization.</div>
                <div className="flex items-center gap-2 mt-4 text-text-primary">
                  <span className="text-emerald">➜</span>
                  <span className="">void-os</span>
                  <span className="text-violet">git:(</span><span className="text-rose">main</span><span className="text-violet">)</span>
                  <span className="w-2 h-4 bg-violet animate-pulse"></span>
                </div>
                <div className="pt-4 text-text-tertiary">
                  $ npm run dev<br/>
                  {'>'} void-os@0.1.0 dev<br/>
                  {'>'} next dev<br/>
                  <br/>
                  ready - started server on 0.0.0.0:3000, url: http://localhost:3000
                </div>
              </div>
            </div>
          </section>

          {/* Pane 3: Browser Preview */}
          <section className="md:col-span-5 bg-elevated flex flex-col overflow-hidden relative">
            <div className="px-4 py-2 bg-surface flex items-center gap-3 border-b border-border-default">
              <div className="flex items-center gap-1.5 flex-1 bg-elevated px-3 py-1 rounded-md border border-border-default">
                <span className="material-symbols-outlined text-[10px] text-text-tertiary">lock</span>
                <span className="font-label text-[10px] text-text-tertiary">https://void-os-preview.antigravity.io</span>
              </div>
              <div className="flex gap-2">
                <button className="p-1 text-text-tertiary hover:text-text-primary">
                  <span className="material-symbols-outlined text-sm">refresh</span>
                </button>
                <button className="p-1 text-text-tertiary hover:text-text-primary">
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </button>
              </div>
            </div>

            {/* Generated UI Preview Mockup */}
            <div className="flex-1 bg-app-bg p-8 overflow-auto hide-scrollbar flex flex-col items-center z-10">
              <div className="w-full max-w-lg space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-headline font-extrabold text-2xl text-text-primary tracking-tighter">VoidOS</h2>
                  <span className="px-2 py-1 bg-emerald/10 text-emerald border border-emerald/20 rounded text-[10px] font-bold uppercase tracking-widest">Live Preview</span>
                </div>

                {/* Bento Grid Preview */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface p-4 rounded-xl border border-border-default aspect-square flex flex-col justify-between">
                    <span className="material-symbols-outlined text-violet">hub</span>
                    <div>
                      <div className="text-2xl font-bold text-text-primary">1.2 TB</div>
                      <div className="text-[10px] font-label uppercase tracking-widest text-text-tertiary">Network Flow</div>
                    </div>
                  </div>
                  <div className="bg-surface p-4 rounded-xl border border-border-default aspect-square flex flex-col justify-between">
                    <span className="material-symbols-outlined text-saffron">memory</span>
                    <div>
                      <div className="text-2xl font-bold text-text-primary">14%</div>
                      <div className="text-[10px] font-label uppercase tracking-widest text-text-tertiary">CPU Overhead</div>
                    </div>
                  </div>
                  
                  <div className="col-span-2 bg-surface p-5 rounded-xl border border-border-default">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xs font-bold font-headline text-text-primary">Active Sub-systems</div>
                      <div className="flex gap-1">
                        <div className="w-1 h-3 bg-emerald rounded-full"></div>
                        <div className="w-1 h-3 bg-emerald rounded-full"></div>
                        <div className="w-1 h-3 bg-emerald/30 rounded-full"></div>
                      </div>
                    </div>
                    <div className="h-24 w-full bg-elevated rounded-lg overflow-hidden relative">
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 100">
                        <path d="M0 80 Q 50 20 100 70 T 200 40 T 300 80 T 400 20" fill="none" stroke="currentColor" className="text-emerald/40" strokeWidth="2"></path>
                        <path d="M0 60 Q 80 80 150 30 T 300 60 T 400 40" fill="none" stroke="currentColor" className="text-violet/40" strokeWidth="2"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <button className="w-full py-3 bg-text-primary text-app-bg font-bold rounded-lg hover:brightness-90 transition-colors">
                  Request System Audit
                </button>
              </div>
            </div>
            
            {/* Overlapping Glass Inspector Badge */}
            <div className="absolute bottom-6 right-6 bg-elevated/80 backdrop-blur-xl border border-border-default p-3 rounded-xl shadow-2xl flex items-center gap-3 z-20 hidden md:flex">
              <div className="w-8 h-8 rounded bg-violet/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-violet text-[18px]">frame_inspect</span>
              </div>
              <div>
                <div className="text-[10px] font-label font-bold text-text-primary uppercase tracking-wide">Inspector Active</div>
                <div className="text-[10px] text-text-tertiary">v0.8.4-stable</div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <footer className="md:hidden bg-elevated border-t border-border-default fixed bottom-0 w-full px-6 py-3 flex justify-between items-center z-50">
        <a href="/mission-control" className="flex flex-col items-center gap-1 text-text-secondary">
          <span className="material-symbols-outlined text-[20px]">dashboard</span>
          <span className="text-[10px] font-label">Status</span>
        </a>
        <a href="/neural-editor" className="flex flex-col items-center gap-1 text-emerald">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>code_blocks</span>
          <span className="text-[10px] font-label font-bold">Editor</span>
        </a>
        <button className="flex flex-col items-center gap-1 text-text-secondary">
          <span className="material-symbols-outlined text-[20px]">terminal</span>
          <span className="text-[10px] font-label">Logs</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-text-secondary">
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span className="text-[10px] font-label">Config</span>
        </button>
      </footer>
    </div>
  );
}
