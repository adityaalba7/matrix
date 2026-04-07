

import { ThemeToggle } from '../components/ThemeToggle';

export default function MissionControl() {
  return (
    <div className="min-h-screen bg-[#0A0B14] dark:bg-[#0A0B14] bg-white text-[#F0EEE6] dark:text-[#F0EEE6] text-[#141417] font-body selection:bg-primary/30">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0B14] dark:bg-[#0A0B14] bg-white flex justify-between items-center w-full px-6 py-3 glow-top border-b border-[#484555]/10 dark:border-none">
        <div className="flex items-center gap-8">
          <span className="text-xl font-black tracking-tighter text-[#F0EEE6] dark:text-[#F0EEE6] text-[#141417]">Antigravity AI</span>
          <div className="hidden md:flex gap-6 items-center">
            <nav className="flex gap-6">
              <a href="/mission-control" className="text-[#00D4AA] font-bold border-b-2 border-[#00D4AA] text-sm tracking-wide">Mission Control</a>
              <a href="/neural-editor" className="text-[#C9C4D8] dark:text-[#C9C4D8] text-[#6B6B78] hover:text-[#F0EEE6] dark:hover:text-[#F0EEE6] transition-colors duration-200 text-sm tracking-wide">Neural Editor</a>
              <a href="#" className="text-[#C9C4D8] dark:text-[#C9C4D8] text-[#6B6B78] hover:text-[#F0EEE6] dark:hover:text-[#F0EEE6] transition-colors duration-200 text-sm tracking-wide">Agent Swarm</a>
            </nav>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input type="text" placeholder="Search systems..." className="bg-[#0d0e17] dark:bg-[#0d0e17] bg-[#f0eff8] border-none rounded-lg pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-1 focus:ring-primary text-[#F0EEE6] dark:text-[#F0EEE6] text-[#141417] outline-none" />
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button className="material-symbols-outlined text-[#c9c4d8] dark:text-[#c9c4d8] text-[#6B6B78] hover:text-[#F0EEE6] dark:hover:text-[#F0EEE6] transition-transform active:scale-95">terminal</button>
            <button className="material-symbols-outlined text-[#c9c4d8] hover:text-[#F0EEE6] transition-transform active:scale-95">monitoring</button>
            <button className="material-symbols-outlined text-[#c9c4d8] hover:text-[#F0EEE6] transition-transform active:scale-95">settings</button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPKVNlRSyNlZpIBHqh249CVLoSmNQZ3IPs3F4wcKCMq4F84RXWieqNMX8WNnL3a8jpkDRtgsl3j4bWjtyIBGUvju423g2clQmEN3KpABnm1QpOAgQ-qWxIDKIergR2wjLNgHjqN1JEdzGz37KV7YTBTNmB64WCnGnKRCUoU8L8imKhVcRl7bTllTgaCHHLF3Z4kVmuhJMLeFbUWNyFyrsP6n2A2-0Qz7RbGjaiaXelXC1f_T5FlF8ahhMo2o2zSV-jdhRnPcbxQFA" alt="User Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#12131C] pt-16 hidden md:flex flex-col border-r border-[#484555]/10">
        <div className="px-6 py-8">
          <h2 className="font-headline font-bold text-lg text-[#e3e1ef]">Project Void</h2>
          <p className="font-label text-[10px] uppercase tracking-widest text-[#c9c4d8] mt-1">5 Parallel Agents Active</p>
        </div>
        
        <nav className="flex-1 px-2 space-y-1">
          <a href="/mission-control" className="text-[#F0EEE6] bg-[#7B61FF]/10 border-l-2 border-[#7B61FF] flex items-center gap-3 px-4 py-3 transition-all">
            <span className="material-symbols-outlined text-primary">dashboard</span>
            <span className="font-label text-sm font-medium">Mission Control</span>
          </a>
          <a href="/neural-editor" className="text-[#C9C4D8] hover:bg-[#1E1F29] hover:text-[#F0EEE6] flex items-center gap-3 px-4 py-3 transition-all">
            <span className="material-symbols-outlined">code_blocks</span>
            <span className="font-label text-sm">Neural Editor</span>
          </a>
          <a href="#" className="text-[#C9C4D8] hover:bg-[#1E1F29] hover:text-[#F0EEE6] flex items-center gap-3 px-4 py-3 transition-all">
            <span className="material-symbols-outlined">smart_toy</span>
            <span className="font-label text-sm">Agent Swarm</span>
          </a>
          <a href="/artifact-vault" className="text-[#C9C4D8] hover:bg-[#1E1F29] hover:text-[#F0EEE6] flex items-center gap-3 px-4 py-3 transition-all">
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="font-label text-sm">Artifact Vault</span>
          </a>
          <a href="#" className="text-[#C9C4D8] hover:bg-[#1E1F29] hover:text-[#F0EEE6] flex items-center gap-3 px-4 py-3 transition-all">
            <span className="material-symbols-outlined">terminal</span>
            <span className="font-label text-sm">System Logs</span>
          </a>
        </nav>

        <div className="p-4">
          <button className="w-full bg-[#917eff] text-[#28008a] py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/10">
            <span className="material-symbols-outlined text-sm">add</span>
            New Agent
          </button>
        </div>

        <div className="px-2 pb-6 space-y-1 mt-auto">
          <a href="#" className="text-[#C9C4D8] hover:bg-[#1E1F29] flex items-center gap-3 px-4 py-2 transition-all">
            <span className="material-symbols-outlined text-sm">help</span>
            <span className="font-label text-xs">Docs</span>
          </a>
          <a href="#" className="text-[#C9C4D8] hover:bg-[#1E1F29] flex items-center gap-3 px-4 py-2 transition-all">
            <span className="material-symbols-outlined text-sm">contact_support</span>
            <span className="font-label text-xs">Support</span>
          </a>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="md:pl-64 pt-16 min-h-screen relative overflow-hidden">
        <div className="focus-orb top-20 right-10 opacity-60"></div>
        <div className="focus-orb bottom-10 -left-20 opacity-40"></div>

        <div className="p-8 max-w-7xl mx-auto space-y-12">
          {/* Hero Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-[#e3e1ef]">Mission Control</h1>
              <p className="text-[#c9c4d8] mt-3 max-w-lg leading-relaxed">
                Orchestrating high-latency neural compute cycles across 5 synchronized instances. 
                System integrity is nominal.
              </p>
            </div>
            <button className="group bg-[#c9bfff] text-[#2e009c] px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-[#55fcd0] transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(123,97,255,0.3)]">
              Initiate Swarm
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">bolt</span>
            </button>
          </div>

          {/* Bento Grid: Neural Map & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Neural Map Visualization */}
            <div className="lg:col-span-8 bg-[#111320] rounded-2xl p-6 relative border border-white/5 overflow-hidden group">
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="font-headline font-bold text-lg text-[#e3e1ef]">Neural Map</h3>
                <div className="flex items-center gap-4 text-xs font-label">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#41eec2]"></span> Verification</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ffb68e]"></span> Reasoning</span>
                </div>
              </div>

              <div className="h-[400px] w-full flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZF7RGwvUBzjPbOMI0sI-Wbjhhb0U8CcaA4KeICS4itTFHveN2F0VZ5KpKCYiJev1w0Lbp0gP0yrdE6W_vqf1Hz2AnVR67jB6CaFMj9aeb-18UfJ1kSppJKytWlx1J8_OnQ3-RrX162n_cBCOg8Dj_x2smsRDECRf_f7dQCcsDEzoaiQSiUN0XB8YjA43hBTXgCbzW0Ng5qB_tvvSz0NUWQ_CK0DmC9v0eM7-UoBE4_BBOziwUiyxuS5th1MSU5RwWfxPn1H3lrNQ" alt="Map" className="w-full h-full object-cover" />
                </div>
                
                <div className="relative w-full h-full">
                  <svg className="absolute inset-0 w-full h-full opacity-30">
                    <path d="M100,100 L300,150 L500,80 L700,200" fill="transparent" stroke="#7B61FF" strokeWidth="1"></path>
                    <path d="M100,100 L250,300 L600,350 L700,200" fill="transparent" stroke="#00D4AA" strokeWidth="1"></path>
                  </svg>
                  <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-[#c9bfff] rounded-full animate-pulse shadow-[0_0_15px_#7B61FF]"></div>
                  <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-[#41eec2] rounded-full animate-pulse shadow-[0_0_15px_#00D4AA]"></div>
                  <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-[#ffb68e] rounded-full animate-pulse shadow-[0_0_15px_#FF7A1A]"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-[#c9bfff] rounded-full animate-pulse shadow-[0_0_15px_#7B61FF]"></div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 glass-card p-4 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-label uppercase tracking-tighter text-[#928ea1]">Parallel Execution Load</p>
                    <p className="text-xl font-black text-[#41eec2]">88.4%</p>
                  </div>
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full border-2 border-[#1e1f29] bg-[#282933] flex items-center justify-center text-[10px] font-bold text-[#e3e1ef]">A1</div>
                    <div className="w-10 h-10 rounded-full border-2 border-[#1e1f29] bg-[#282933] flex items-center justify-center text-[10px] font-bold text-[#e3e1ef]">A2</div>
                    <div className="w-10 h-10 rounded-full border-2 border-[#1e1f29] bg-[#282933] flex items-center justify-center text-[10px] font-bold text-[#e3e1ef]">A3</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity & Performance */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-[#111320] rounded-2xl p-6 border border-white/5 flex-1 text-[#e3e1ef]">
                <h3 className="font-headline font-bold text-lg mb-6">Recent Activity</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="mt-1 w-2 h-2 rounded-full bg-[#41eec2] shrink-0"></div>
                    <div>
                      <p className="text-sm font-semibold">Code Verification Successful</p>
                      <p className="text-xs text-[#c9c4d8] mt-1">Agent Alpha finalized rust-core module optimization.</p>
                      <p className="text-[10px] font-label text-[#928ea1] mt-2">2m ago</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-1 w-2 h-2 rounded-full bg-[#ffb68e] shrink-0"></div>
                    <div>
                      <p className="text-sm font-semibold">Logic Reasoning Initiated</p>
                      <p className="text-xs text-[#c9c4d8] mt-1">Agent Gamma evaluating branch conditions for UI-2.</p>
                      <p className="text-[10px] font-label text-[#928ea1] mt-2">14m ago</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-1 w-2 h-2 rounded-full bg-[#41eec2] shrink-0"></div>
                    <div>
                      <p className="text-sm font-semibold">Deployment Confirmed</p>
                      <p className="text-xs text-[#c9c4d8] mt-1">Parallel Swarm v2.4 successfully synced to main.</p>
                      <p className="text-[10px] font-label text-[#928ea1] mt-2">1h ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Snapshot */}
              <div className="bg-[#1a1b24] rounded-2xl p-6 border border-white/5">
                <p className="text-[10px] font-label uppercase tracking-widest text-[#928ea1] mb-4">Uptime Pulse</p>
                <div className="flex items-end gap-1 h-12">
                  <div className="w-full bg-[#41eec2]/20 h-1/2 rounded-sm"></div>
                  <div className="w-full bg-[#41eec2]/40 h-2/3 rounded-sm"></div>
                  <div className="w-full bg-[#41eec2]/60 h-1/2 rounded-sm"></div>
                  <div className="w-full bg-[#41eec2]/30 h-3/4 rounded-sm"></div>
                  <div className="w-full bg-[#41eec2]/80 h-full rounded-sm"></div>
                  <div className="w-full bg-[#41eec2]/40 h-2/3 rounded-sm"></div>
                  <div className="w-full bg-[#41eec2]/20 h-1/2 rounded-sm"></div>
                  <div className="w-full bg-[#41eec2]/90 h-full rounded-sm animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Agents */}
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-headline text-2xl font-bold text-[#e3e1ef]">Active Agents</h2>
              <button className="text-[#c9bfff] font-label text-sm hover:underline">Manage All</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Agent Card 1 */}
              <div className="bg-[#111320] p-5 rounded-2xl border border-white/5 hover:border-primary/30 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#c9bfff]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#c9bfff] text-xl">psychology</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#41eec2]/10 border border-[#41eec2]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#41eec2] animate-pulse"></span>
                    <span className="text-[10px] font-bold text-[#41eec2]">ACTIVE</span>
                  </div>
                </div>
                <h4 className="font-bold text-[#e3e1ef]">Alpha One</h4>
                <p className="text-xs text-[#c9c4d8] mt-1">Primary Synthesizer</p>
                <div className="mt-6 pt-6 border-t border-white/5">
                  <div className="flex justify-between text-[10px] font-label text-[#928ea1] mb-2">
                    <span>REASONING</span>
                    <span className="text-[#ffb68e]">98%</span>
                  </div>
                  <div className="w-full h-1 bg-[#1e1f29] rounded-full overflow-hidden">
                    <div className="bg-[#ffb68e] h-full w-[98%]"></div>
                  </div>
                </div>
              </div>

              {/* Agent Card 2 */}
              <div className="bg-[#111320] p-5 rounded-2xl border border-white/5 hover:border-primary/30 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#41eec2]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#41eec2] text-xl">verified_user</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#41eec2]/10 border border-[#41eec2]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#41eec2] animate-pulse"></span>
                    <span className="text-[10px] font-bold text-[#41eec2]">ACTIVE</span>
                  </div>
                </div>
                <h4 className="font-bold text-[#e3e1ef]">Beta Core</h4>
                <p className="text-xs text-[#c9c4d8] mt-1">Code Auditor</p>
                <div className="mt-6 pt-6 border-t border-white/5">
                  <div className="flex justify-between text-[10px] font-label text-[#928ea1] mb-2">
                    <span>ACCURACY</span>
                    <span className="text-[#41eec2]">99.9%</span>
                  </div>
                  <div className="w-full h-1 bg-[#1e1f29] rounded-full overflow-hidden">
                    <div className="bg-[#41eec2] h-full w-[99.9%]"></div>
                  </div>
                </div>
              </div>

              {/* Agent Card 3 */}
              <div className="bg-[#111320] p-5 rounded-2xl border border-white/5 hover:border-primary/30 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#ffb68e]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#ffb68e] text-xl">database</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#41eec2]/10 border border-[#41eec2]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#41eec2] animate-pulse"></span>
                    <span className="text-[10px] font-bold text-[#41eec2]">ACTIVE</span>
                  </div>
                </div>
                <h4 className="font-bold text-[#e3e1ef]">Gamma Vault</h4>
                <p className="text-xs text-[#c9c4d8] mt-1">Retrieval Expert</p>
                <div className="mt-6 pt-6 border-t border-white/5">
                  <div className="flex justify-between text-[10px] font-label text-[#928ea1] mb-2">
                    <span>LATENCY</span>
                    <span className="text-[#e3e1ef]">12ms</span>
                  </div>
                  <div className="w-full h-1 bg-[#1e1f29] rounded-full overflow-hidden">
                    <div className="bg-[#c9bfff] h-full w-[40%]"></div>
                  </div>
                </div>
              </div>

              {/* Agent Card 4 */}
              <div className="bg-[#111320] p-5 rounded-2xl border border-white/5 hover:border-primary/30 transition-all cursor-pointer opacity-80">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#928ea1]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#928ea1] text-xl">precision_manufacturing</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ffb68e]/10 border border-[#ffb68e]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffb68e] animate-pulse"></span>
                    <span className="text-[10px] font-bold text-[#ffb68e]">REASONING</span>
                  </div>
                </div>
                <h4 className="font-bold text-[#e3e1ef]">Delta Craft</h4>
                <p className="text-xs text-[#c9c4d8] mt-1">UI Architect</p>
                <div className="mt-6 pt-6 border-t border-white/5">
                  <div className="flex justify-between text-[10px] font-label text-[#928ea1] mb-2">
                    <span>PROGRESS</span>
                    <span className="text-[#e3e1ef]">62%</span>
                  </div>
                  <div className="w-full h-1 bg-[#1e1f29] rounded-full overflow-hidden">
                    <div className="bg-[#c9bfff] h-full w-[62%]"></div>
                  </div>
                </div>
              </div>

              {/* Agent Card 5 */}
              <div className="bg-[#111320] p-5 rounded-2xl border border-white/5 hover:border-primary/30 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#41eec2]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#41eec2] text-xl">hub</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#41eec2]/10 border border-[#41eec2]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#41eec2] animate-pulse"></span>
                    <span className="text-[10px] font-bold text-[#41eec2]">ACTIVE</span>
                  </div>
                </div>
                <h4 className="font-bold text-[#e3e1ef]">Epsilon Link</h4>
                <p className="text-xs text-[#c9c4d8] mt-1">Network Orchestrator</p>
                <div className="mt-6 pt-6 border-t border-white/5">
                  <div className="flex justify-between text-[10px] font-label text-[#928ea1] mb-2">
                    <span>THROUGHPUT</span>
                    <span className="text-[#e3e1ef]">4.2 GB/s</span>
                  </div>
                  <div className="w-full h-1 bg-[#1e1f29] rounded-full overflow-hidden">
                    <div className="bg-[#41eec2] h-full w-[85%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A0B14] h-16 border-t border-white/5 flex items-center justify-around px-4 z-50">
        <a href="#" className="flex flex-col items-center gap-1 text-[#00D4AA]">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-label">Mission</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-[#C9C4D8]">
          <span className="material-symbols-outlined">code_blocks</span>
          <span className="text-[10px] font-label">Editor</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-[#C9C4D8]">
          <span className="material-symbols-outlined">smart_toy</span>
          <span className="text-[10px] font-label">Swarm</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-[#C9C4D8]">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-label">Settings</span>
        </a>
      </nav>
    </div>
  );
}
