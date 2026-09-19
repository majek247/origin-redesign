import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useInView, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, Globe, Zap, LineChart, 
  MessageSquare, Lock, ChevronRight, BarChart3, 
  Building2, Users, Briefcase, Search, FileText,
  Sparkles, Check, Home, Bell, TrendingUp
} from 'lucide-react';

// Add this new import
import { 
  FilePdf, FileDoc, FileTxt, CheckCircle, 
  CircleNotch, Sparkle, Translate, 
  ShieldCheck, Lightning, Clock 
} from '@phosphor-icons/react';

// ==========================================
// TYPES & CONFIG
// ==========================================


const THEME = {
  ink: '#050505',
  navy: '#0A1128',
  blue: '#1C3F60',
  teal: '#2E8A8A',
  mint: '#A0E8AF',
  lime: '#D2F898',
  amber: '#FFC857',
  white: '#FFFFFF',
};

// ==========================================
// MOCK ENTERPRISE DATA
// ==========================================

const FEATURES = [
  {
    title: 'Global Visibility',
    desc: 'Unified dashboard mapping every vendor, cost, and policy across your international footprint.',
    icon: Globe,
    colSpan: 'md:col-span-2 md:row-span-2',
    bg: 'bg-gradient-to-br from-[#0A1128] to-[#050505]',
  },
  {
    title: 'AI Contract Extraction',
    desc: 'Proprietary NLP engine translates and extracts key terms from PDFs in 40+ languages.',
    icon: FileText,
    colSpan: 'md:col-span-1 md:row-span-1',
    bg: 'bg-[#1C3F60]/40',
  },
  {
    title: 'Real-time Compliance',
    desc: 'Automated flags for regulatory changes in local jurisdictions.',
    icon: ShieldCheck,
    colSpan: 'md:col-span-1 md:row-span-1',
    bg: 'bg-[#2E8A8A]/30',
  },
  {
    title: 'Predictive Renewals',
    desc: 'Workflow automation that initiates broker benchmarking 90 days out.',
    icon: Zap,
    colSpan: 'md:col-span-2 md:row-span-1',
    bg: 'bg-gradient-to-r from-[#A0E8AF]/10 to-transparent',
  }
];

// ==========================================
// UTILITY COMPONENTS
// ==========================================

const AnimatedCounter = ({ from = 0, to, duration = 2, prefix = '', suffix = '', decimals = 0 }: any) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-100px" });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!inView) return;
    let startTimestamp: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // Ease out quint
      const ease = 1 - Math.pow(1 - progress, 5);
      setValue(from + (to - from) * ease);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [inView, from, to, duration]);

  return <span ref={nodeRef}>{prefix}{value.toFixed(decimals)}{suffix}</span>;
};

const NoiseOverlay = () => (
  <div className="pointer-events-none absolute inset-0 z-50 h-full w-full opacity-[0.03] mix-blend-overlay" 
       style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
  </div>
);

// ==========================================
// LAYOUT & NAVIGATION
// ==========================================



// ---------- Dot-matrix world map data (60 x 26 grid, land = column ranges per row) ----------

const MAP_COLS = 60;
const MAP_ROWS = 26;

const LAND: Record<number, [number, number][]> = {
  0: [[22, 26]],
  1: [[10, 18], [21, 26], [38, 44], [47, 59]],
  2: [[2, 16], [18, 20], [21, 25], [32, 35], [37, 59]],
  3: [[2, 19], [22, 24], [26, 26], [31, 35], [36, 59]],
  4: [[3, 13], [17, 20], [29, 30], [31, 35], [36, 57]],
  5: [[5, 13], [16, 20], [29, 29], [31, 36], [37, 53], [56, 56]],
  6: [[9, 21], [28, 52]],
  7: [[9, 19], [28, 30], [32, 51], [53, 54]],
  8: [[10, 17], [28, 50], [53, 53]],
  9: [[10, 16], [28, 50]],
  10: [[11, 15], [27, 50]],
  11: [[12, 15], [16, 17], [27, 40], [42, 44], [45, 48]],
  12: [[15, 16], [27, 38], [42, 43], [46, 48], [50, 50]],
  13: [[16, 19], [28, 37], [42, 43], [46, 49]],
  14: [[17, 21], [28, 37], [46, 49], [50, 51]],
  15: [[17, 24], [31, 37], [46, 49], [50, 51], [52, 55]],
  16: [[16, 24], [32, 37], [46, 49], [53, 56]],
  17: [[17, 23], [32, 38], [50, 54]],
  18: [[18, 23], [32, 38], [50, 54]],
  19: [[18, 23], [32, 35], [49, 55]],
  20: [[18, 22], [32, 35], [49, 55]],
  21: [[18, 21], [33, 34], [49, 55], [58, 59]],
  22: [[18, 20], [53, 54], [58, 59]],
  23: [[18, 19], [58, 58]],
  24: [[18, 19]],
  25: [[19, 19]],
};

const MAP_DOTS: { c: number; r: number }[] = [];
for (let r = 0; r < MAP_ROWS; r++) {
  for (let c = 0; c < MAP_COLS; c++) {
    if ((LAND[r] ?? []).some(([a, b]) => c >= a && c <= b)) MAP_DOTS.push({ c, r });
  }
}

const HUBS = [
  { name: 'New York', x: 17.5, y: 7.5 },
  { name: 'Mexico City', x: 13.5, y: 11.5 },
  { name: 'São Paulo', x: 21.5, y: 19.5 },
  { name: 'London', x: 29.5, y: 5.5 },
  { name: 'Warsaw', x: 33.5, y: 5.5 },
  { name: 'Dubai', x: 39.5, y: 10.5 },
  { name: 'Singapore', x: 47.5, y: 14.5 },
  { name: 'Sydney', x: 55, y: 21.5 },
];

const arc = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const mx = (a.x + b.x) / 2;
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  const my = Math.min(a.y, b.y) - dist * 0.28;
  return `M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`;
};

const ARCS = [[0, 3], [3, 4], [3, 5], [5, 6], [6, 7], [0, 2], [1, 0]].map(([i, j]) => arc(HUBS[i], HUBS[j]));

const HERO_CSS = `
@keyframes orig-dot { from { opacity: 0; transform: scale(.3) } to { opacity: 1; transform: scale(1) } }
.orig-dot { opacity: 0; transform-box: fill-box; transform-origin: center; animation: orig-dot .55s ease-out forwards; }
@keyframes orig-arc { to { stroke-dashoffset: 0 } }
.orig-arc { stroke-dasharray: 1; stroke-dashoffset: 1; opacity: .75; animation: orig-arc 1.6s ease-out forwards; }
`;

// ---------- Dashboard mock ----------

const DASH_W = 680;
const DASH_H = 480;

const NAV = [
  { label: 'Overview', icon: Home, active: true },
  { label: 'Global view', icon: Globe },
  { label: 'Savings', icon: LineChart },
  { label: 'Vendors', icon: Building2 },
  { label: 'Compliance', icon: ShieldCheck },
  { label: 'Reports', icon: FileText },
];

const OPPS = [
  { label: 'Brokerage fees', val: '$1.1M', w: 100 },
  { label: 'Undisclosed commissions', val: '$1.0M', w: 91 },
  { label: 'Contract overlaps', val: '$620K', w: 56 },
  { label: 'Local plan variations', val: '$480K', w: 44 },
];

const CATEGORIES = [
  { label: 'Health', pct: 42, color: '#065a63' },
  { label: 'Retirement', pct: 24, color: '#0a7c83' },
  { label: 'Life & Disability', pct: 18, color: '#3aa6a6' },
  { label: 'Wellbeing', pct: 10, color: '#8fd6c6' },
];

const CARD = 'flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white p-3';

function ScaledStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / DASH_W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative w-full" style={{ height: DASH_H * scale }}>
      <div style={{ width: DASH_W, height: DASH_H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {children}
      </div>
    </div>
  );
}

function Sparkline({ d, id, stroke }: { d: string; id: string; stroke: string }) {
  return (
    <svg viewBox="0 0 90 28" className="h-7 w-[90px]" fill="none" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={stroke} stopOpacity="0.3" />
          <stop offset="1" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L90 28 L0 28 Z`} fill={`url(#${id})`} />
      <path d={d} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Kpi({
  label, to, decimals = 1, prefix = '', suffix = '', delta, right, featured = false, live = false, delay = 0,
}: {
  label: string; to: number; decimals?: number; prefix?: string; suffix?: string;
  delta: string; right: ReactNode; featured?: boolean; live?: boolean; delay?: number;
}) {
  const v = useCountUp(to, 1600, delay);
  const shown = decimals ? v.toFixed(decimals) : Math.round(v).toString();

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-3 ${
        featured
          ? 'border-transparent bg-gradient-to-br from-[#0a7c83] to-[#065a63] text-white shadow-[0_10px_28px_-12px_rgba(10,124,131,0.8)]'
          : 'border-slate-200/80 bg-white text-slate-900'
      }`}
    >
      <div className={`text-[10px] font-medium ${featured ? 'text-white/70' : 'text-slate-500'}`}>{label}</div>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <div className="text-[22px] font-semibold leading-none tracking-tight tabular-nums">
            {prefix}{shown}{suffix}
          </div>
          <div className={`mt-1.5 flex items-center gap-1 text-[9.5px] font-semibold ${featured ? 'text-[#A0E8AF]' : 'text-emerald-600'}`}>
            {live ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> : <TrendingUp size={10} />}
            {delta}
          </div>
        </div>
        {right}
      </div>
    </div>
  );
}

function DashboardWindow() {
  return (
    <div className="flex overflow-hidden rounded-[13px] bg-[#F4F7F7] text-slate-900" style={{ width: DASH_W, height: DASH_H }}>
      {/* Sidebar */}
      <aside className="flex w-[142px] shrink-0 flex-col bg-gradient-to-b from-[#07262e] to-[#031a20] px-3 py-4 text-white">
        <div className="flex items-center gap-2 px-1.5">
          <span className="h-[18px] w-[18px] rounded-[999px_999px_999px_4px] bg-gradient-to-br from-[#A0E8AF] to-[#0a7c83]" />
          <span className="text-[15px] font-semibold tracking-tight">origin</span>
        </div>

        <nav className="mt-6 space-y-0.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] font-medium ${
                  item.active ? 'bg-white/10 text-white' : 'text-white/50'
                }`}
              >
                <Icon size={13} />
                {item.label}
                {item.active && <span className="ml-auto h-1 w-1 rounded-full bg-[#A0E8AF]" />}
              </div>
            );
          })}
        </nav>

        <div className="mt-auto rounded-lg border border-white/10 bg-white/[0.04] p-2">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#A0E8AF] text-[9px] font-bold text-[#03171d]">
              SM
            </span>
            <div className="min-w-0">
              <div className="truncate text-[10px] font-medium">Sarah M.</div>
              <div className="truncate text-[9px] text-white/45">Global Benefits</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-[18px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[15px] font-semibold tracking-tight text-slate-900">Good morning, Sarah</div>
            <div className="text-[10px] text-slate-500">Here's what's happening across your global benefits</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-[168px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 text-[10px] text-slate-400">
              <Search size={12} />
              Search policies
              <span className="ml-auto rounded border border-slate-200 px-1 text-[8.5px] text-slate-400">⌘K</span>
            </div>
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500">
              <Bell size={13} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#0a7c83] ring-2 ring-white" />
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-2.5">
          <Kpi
            label="Total benefits spend" to={24.3} prefix="$" suffix="M" delta="+12% YoY" delay={500}
            right={<Sparkline id="hsp1" stroke="#0a7c83" d="M0 21 L12 18 L24 19 L36 13 L48 15 L60 9 L72 11 L90 4" />}
          />
          <Kpi
            featured label="Identified savings" to={3.2} prefix="$" suffix="M" delta="+8% QoQ" delay={700}
            right={<Sparkline id="hsp2" stroke="#A0E8AF" d="M0 22 L14 20 L28 21 L42 14 L56 12 L70 7 L90 3" />}
          />
          <Kpi
            live label="Countries" to={100} decimals={0} suffix="+" delta="Active" delay={900}
            right={
              <div className="flex h-7 items-end gap-[3px]">
                {[8, 12, 10, 16, 20, 25].map((h, i) => (
                  <span key={i} style={{ height: h }} className="w-[5px] rounded-sm bg-[#0a7c83]/70" />
                ))}
              </div>
            }
          />
        </div>

        {/* Lower grid */}
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-2.5">
          {/* Left column */}
          <div className="grid min-h-0 grid-rows-[minmax(0,1.3fr)_minmax(0,1fr)] gap-2.5">
            <div className={CARD}>
              <div className="mb-1 flex items-center justify-between text-[10.5px] font-semibold text-slate-800">
                Global spend by region
                <span className="flex items-center gap-1 text-[9px] font-medium text-slate-500">
                  <span className="h-1 w-1 rounded-full bg-emerald-500" /> Live
                </span>
              </div>
              <div className="min-h-0 flex-1">
                <svg viewBox={`0 0 ${MAP_COLS} ${MAP_ROWS}`} className="h-full w-full overflow-visible" preserveAspectRatio="xMidYMid meet" aria-hidden>
                  {MAP_DOTS.map(({ c, r }) => (
                    <circle
                      key={`${c}-${r}`}
                      cx={c + 0.5}
                      cy={r + 0.5}
                      r={0.27}
                      fill="#C5D2D6"
                      className="orig-dot"
                      style={{ animationDelay: `${300 + c * 18 + r * 6}ms` }}
                    />
                  ))}
                  {ARCS.map((d, i) => (
                    <path
                      key={i}
                      d={d}
                      fill="none"
                      stroke="#0a7c83"
                      strokeWidth={0.14}
                      strokeLinecap="round"
                      pathLength={1}
                      className="orig-arc"
                      style={{ animationDelay: `${1100 + i * 180}ms` }}
                    />
                  ))}
                  {HUBS.map((h, i) => (
                    <g key={h.name}>
                      <circle cx={h.x} cy={h.y} r={0.6} fill="#0a7c83" opacity={0.2}>
                        <animate attributeName="r" values="0.5;1.7;0.5" dur="3s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.35;0;0.35" dur="3s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
                      </circle>
                      <circle cx={h.x} cy={h.y} r={0.42} fill="#0a7c83" stroke="#fff" strokeWidth={0.15} />
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            <div className={CARD}>
              <div className="mb-2 text-[10.5px] font-semibold text-slate-800">Spend by category</div>
              <div className="flex flex-1 flex-col justify-between">
                {CATEGORIES.map((c, i) => (
                  <div key={c.label} className="flex items-center gap-2 text-[9.5px]">
                    <span className="w-[78px] truncate text-slate-500">{c.label}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(c.pct / 42) * 100}%` }}
                        transition={{ delay: 0.9 + i * 0.12, duration: 0.9, ease: EASE }}
                        className="h-full rounded-full"
                        style={{ background: c.color }}
                      />
                    </div>
                    <span className="w-6 text-right font-medium tabular-nums text-slate-700">{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="grid min-h-0 grid-rows-[minmax(0,1.3fr)_minmax(0,1fr)] gap-2.5">
            <div className={CARD}>
              <div className="mb-2 flex items-center justify-between text-[10.5px] font-semibold text-slate-800">
                Top opportunities
                <span className="text-[9px] font-medium text-[#0a7c83]">$3.2M</span>
              </div>
              <div className="flex flex-1 flex-col justify-between">
                {OPPS.map((o, i) => (
                  <div key={o.label} className="min-w-0">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="truncate text-slate-600">{o.label}</span>
                      <span className="font-semibold tabular-nums text-slate-900">{o.val}</span>
                    </div>
                    <div className="mt-1 h-[3px] overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${o.w}%` }}
                        transition={{ delay: 0.9 + i * 0.12, duration: 0.9, ease: EASE }}
                        className="h-full rounded-full bg-gradient-to-r from-[#0a7c83] to-[#5cc5b5]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex min-h-0 flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br from-[#06303a] to-[#031a20] p-3 text-white ring-1 ring-white/10">
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#A0E8AF]/15 blur-2xl" />
              <div className="relative flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#A0E8AF]">
                <Sparkles size={11} /> Cuido insight
              </div>
              <p className="relative mt-1.5 text-[10.5px] leading-snug text-white/80">
                Group Life in Singapore is priced 26% above market benchmark. Renewal opens in 90 days.
              </p>
              <div className="relative mt-2 flex items-center gap-1 text-[10px] font-semibold text-[#A0E8AF]">
                Review benchmark <ArrowRight size={11} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroDashboard() {
  return (
    <div className="relative mx-auto w-full max-w-[680px]">
      <style>{HERO_CSS}</style>

      {/* Orbit rings behind the window */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0a7c83]/35 blur-[110px]" />

      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="rounded-[18px] bg-white/[0.06] p-1.5 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10 backdrop-blur-sm">
          <ScaledStage>
            <DashboardWindow />
          </ScaledStage>
        </div>
      </motion.div>

 

  
    </div>
  );
}

// ---------- Hero ----------

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#031a20] pb-24 pt-32 lg:pb-32 lg:pt-40">
      {/* Background: fading grid + soft glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 65% 45%, #000 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 65% 45%, #000 30%, transparent 75%)',
          }}
        />
        {/* Soft teal wash centred on the dashboard */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_70%_45%,rgba(10,124,131,0.28),transparent_70%)]" />
        <div className="absolute right-[-8%] top-[5%] h-[620px] w-[620px] rounded-full bg-[#0a7c83]/30 blur-[140px]" />
        {/* Dark vignette at the edges so the centre feels lit */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_60%_45%,transparent_55%,rgba(2,21,29,0.85)_100%)]" />
        {/* Globe lines, shifted so the globe sits behind the dashboard */}
        <GlobeLines className="translate-y-10 lg:-translate-x-[18%]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[400px] w-[400px] rounded-full bg-[#A0E8AF]/[0.04] blur-[120px]" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-20 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
        {/* Left: copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex flex-col items-start"
        >
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A0E8AF]" />
            Enterprise Benefits Intelligence
          </div>

          <h1 className="text-[34px] font-semibold leading-[1.06] tracking-[-0.035em] text-white sm:text-5xl lg:text-[46px] xl:text-[60px]">
            <span className="block">Our global benefits</span>
            <span className="block text-white/45">out of the dark.</span>
          </h1>

          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-white/60">
            Benefits are your second-biggest people cost. Stop managing them in spreadsheets. Origin unifies data
            across 100+ countries into a single, AI-powered command center.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0a7c83] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0d8f98] hover:shadow-[0_12px_40px_-10px_#0a7c83]">
              Explore the Platform
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-white/10">
              Read the Whitepaper
            </button>
          </div>

          <div className="mt-14 w-full max-w-lg border-t border-white/10 pt-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
              Trusted by global benefits teams
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-10 gap-y-5">
              {[
                { name: 'BP', src: '/images/bplogo.webp', h: 'h-8' },
                { name: 'EA', src: '/images/fifaealogo.webp', h: 'h-5' },
                { name: 'Gilead', src: '/images/gilead.png', h: 'h-6' },
                { name: 'Organon', src: '/images/organon.webp', h: 'h-6' },
              ].map((logo) => (
                <img
                  key={logo.name}
                  src={logo.src}
                  alt={logo.name}
                  className={`${logo.h} w-auto max-w-[120px] object-contain opacity-60 brightness-0 invert transition-opacity duration-300 hover:opacity-100`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: coded dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="w-full"
        >
          <HeroDashboard />
        </motion.div>
      </div>
    </section>
  );
}




// ==========================================
// STORY SECTION — "MEET PROYA" CAROUSEL
// ==========================================

const CHAPTER_MS = 9000;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ---------- tiny hooks ----------

function useSequence(times: number[]) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const ids = times.map((t, i) => setTimeout(() => setStep(i + 1), t));
    return () => ids.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return step;
}

function useTypewriter(text: string, delay = 0, speed = 28) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined;
    const t = setTimeout(() => {
      id = setInterval(() => {
        setN((c) => {
          if (c >= text.length) {
            if (id) clearInterval(id);
            return c;
          }
          return c + 1;
        });
      }, speed);
    }, delay);
    return () => {
      clearTimeout(t);
      if (id) clearInterval(id);
    };
  }, [text, delay, speed]);
  return text.slice(0, n);
}

function useCountUp(to: number, duration = 1600, delay = 0) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    let start = 0;
    const t = setTimeout(() => {
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        setV(to * (1 - Math.pow(1 - p, 4)));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, [to, duration, delay]);
  return v;
}

// ---------- shared UI ----------

function Rise({ d = 0, className = '', children }: { d?: number; className?: string; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.15 + d, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AppCard({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
      className="relative w-full overflow-hidden rounded-none bg-white text-[#0A1128] border border-slate-200"
    >
      {children}
    </motion.div>
  );
}

function CardHeader({ title, sub, right }: { title: string; sub: string; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100  px-5 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none border border-slate-200 text-slate-800">
          <Sparkles size={15} strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <div className="truncate text-[14px] font-semibold leading-tight text-slate-800">{title}</div>
          <div className="truncate text-[12px] leading-tight text-slate-500">{sub}</div>
        </div>
      </div>
      {right}
    </div>
  );
}

// ---------- CARD 1: INGEST ----------

const INGEST_FILES = [
  { name: 'Handbook_Poland_2025.pdf', lang: 'PL', icon: FilePdf },
  { name: 'Contrato_Seguro_Vida_MX.pdf', lang: 'ES', icon: FilePdf },
  { name: 'Betriebsrente_Richtlinie_DE.docx', lang: 'DE', icon: FileDoc },
  { name: 'Plano_de_Saude_BR.pdf', lang: 'PT', icon: FilePdf },
];


function IngestCard() {
  const step = useSequence([1100, 1800, 2500, 3200, 3900]);
  const count = useCountUp(312, 4200, 300);

  return (
    <AppCard className="w-[125%] max-w-[720px] self-center lg:self-start">
      <CardHeader
        title="Document Ingestion"
        sub="43 countries · 9 languages"
        right={
          <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-1 px-3 py-4">
        {INGEST_FILES.map((f, i) => {
          const done = step > i;
          const Icon = f.icon;
          return (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.12, duration: 0.5, ease: EASE }}
              className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:bg-slate-50/80"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 border border-slate-200 shadow-sm">
                <Icon size={18} weight="duotone" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium text-slate-700">{f.name}</div>
                <div className="text-[11px] text-slate-400">
                  {done ? (
                    <span className="flex items-center gap-1 text-[#2E8A8A]">
                      <CheckCircle size={12} weight="fill" /> Structured successfully
                    </span>
                  ) : (
                    'Reading document...'
                  )}
                </div>
              </div>
              <span className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-slate-400 border border-slate-100">
                {f.lang}
              </span>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                {done ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0A1128] text-white"
                  >
                    <CheckCircle size={14} weight="fill" />
                  </motion.span>
                ) : (
                  <CircleNotch size={16} className="animate-spin text-slate-300" />
                )}
              </span>
            </motion.div>
          );
        })}
      </div>
      <div className="border-t border-slate-100 bg-white px-5 py-4 rounded-b-[1.5rem]">
        <div className="flex items-end justify-between">
          <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            Total documents structured
          </div>
          <div className="text-2xl font-semibold tabular-nums text-slate-800">{Math.round(count)}</div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-800 transition-all duration-300"
            style={{ width: `${(count / 312) * 100}%` }}
          />
        </div>
      </div>
    </AppCard>
  );
}

// ---------- CARD 2: ASK CUIDO ----------

const ASK_QUERY = 'What is our maternity leave policy in Poland, and how does it compare to the legal minimum?';
const ASK_TYPE_END = 500 + ASK_QUERY.length * 24;

function AskCard() {
  const typed = useTypewriter(ASK_QUERY, 500, 24);
  const step = useSequence([ASK_TYPE_END + 300, ASK_TYPE_END + 1600]);
  
  const rows = [
    { label: 'Your policy', val: '26 weeks · 100% pay', w: 100, color: 'bg-[#0A1128]' },
    { label: 'Statutory minimum', val: '20 weeks · 100% pay', w: 77, color: 'bg-slate-200' },
  ];

  return (
    <AppCard>
      <CardHeader
        title="Ask Cuido"
        sub="All countries · any language"
      />
      <div className="min-h-[290px] space-y-3 px-5 py-5 text-[12.5px]">
        {typed && (
          <div className="ml-auto max-w-[90%] rounded-2xl rounded-tr-md bg-slate-100 border border-slate-200 px-4 py-3 leading-snug text-slate-700">
            {typed}
            {step < 1 && (
              <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse bg-[#2E8A8A]" />
            )}
          </div>
        )}
        
        <AnimatePresence>
          {step === 1 && (
            <motion.div
              key="think"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex w-fit gap-1.5 rounded-2xl rounded-tl-md bg-slate-50 border border-slate-100 px-4 py-3"
            >
              <CircleNotch size={14} className="animate-spin text-[#2E8A8A]" />
            </motion.div>
          )}
        
          {step >= 2 && (
            <motion.div
              key="answer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 rounded-2xl rounded-tl-md bg-white p-5 border border-slate-200 shadow-sm"
            >
              <p className="font-semibold leading-snug text-slate-800">
                Your policy exceeds the statutory minimum.
              </p>
              
              <div className="space-y-4">
                {rows.map((r, i) => (
                  <div key={r.label}>
                    <div className="mb-2 flex justify-between text-[11px] font-medium">
                      <span className="text-slate-500">{r.label}</span>
                      <span className="text-slate-700">{r.val}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: `${r.w}%` }}
                        transition={{ delay: 0.3 + i * 0.2, duration: 0.9, ease: EASE }}
                        className={`h-full rounded-full ${r.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 border border-slate-200 px-2.5 py-1.5 text-[10.5px] font-medium text-slate-600">
                  <FileTxt size={12} weight="duotone" /> Polish handbook v2025 · p.14
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 border border-slate-200 px-2.5 py-1.5 text-[10.5px] font-medium text-slate-600">
                  <ShieldCheck size={12} weight="fill" /> Compliant
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppCard>
  );
}



// ---------- CARD 3: INVENTORY ----------

type Cell = 'ok' | 'overlap' | 'gap';
const INV_COLS = ['Medical', 'Life', 'Pension', 'Leave'];
const INV_ROWS = ['United Kingdom', 'Germany', 'Poland', 'Singapore', 'Brazil'];
const INV_GRID: Cell[][] = [
  ['ok', 'ok', 'overlap', 'ok'],
  ['ok', 'ok', 'ok', 'ok'],
  ['ok', 'gap', 'ok', 'ok'],
  ['overlap', 'ok', 'ok', 'overlap'],
  ['ok', 'ok', 'gap', 'ok'],
];


function InventoryCard() {
  const step = useSequence([2200]);
  return (
    <AppCard>
      <CardHeader
        title="Benefits inventory"
        sub="Live · 5 of 43 markets shown"
        right={
          <span className="rounded-full border border-slate-200/80 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 shadow-sm">
            Synced
          </span>
        }
      />
      <div className="px-5 pb-2 pt-5">
        <div className="grid grid-cols-[100px_repeat(4,1fr)] gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          <span />
          {INV_COLS.map((col) => (
            <span key={col} className="text-center">{col}</span>
          ))}
        </div>
        
        <div className="mt-3 space-y-2">
          {INV_ROWS.map((row, r) => (
            <div key={row} className="grid grid-cols-[100px_repeat(4,1fr)] items-center gap-2">
              <span className="truncate text-[11.5px] font-medium text-slate-600">{row}</span>
              {INV_GRID[r].map((cell, c) => (
                <motion.div
                  key={c}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + (r * 4 + c) * 0.03, duration: 0.4, ease: EASE }}
                  className={`relative flex h-10 items-center justify-center rounded-lg text-[11px] font-semibold transition-colors border ${
                    cell === 'ok'
                      ? 'bg-white border-slate-200 text-slate-400'
                      : cell === 'overlap'
                      ? 'bg-white border-slate-300 text-slate-800'
                      : 'bg-white border-slate-300 text-slate-800'
                  }`}
                >
                  {cell === 'ok' && <CheckCircle size={16} weight="duotone" className="text-slate-300" />}
                  {cell === 'overlap' && <span className="flex items-center gap-1"><Lightning size={12} weight="fill" /> 2x</span>}
                  {cell === 'gap' && <span className="flex items-center gap-1"><Clock size={12} weight="bold" /> Gap</span>}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 8 }}
        className="mx-5 mb-5 mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-[11.5px] leading-snug text-slate-700 shadow-sm"
      >
        <Sparkle size={16} weight="fill" className="mt-0.5 shrink-0 text-amber-500" />
        <span>
          <b className="text-amber-900">3 overlaps and 2 gaps flagged.</b> Singapore has two vendors covering medical — a consolidation opportunity.
        </span>
      </motion.div>
    </AppCard>
  );
}



// ---------- CARD 4: TRUE COST ----------
function CostCard() {
  const step = useSequence([1500, 2800]);
  const amount = useCountUp(1, 1400, 2800);

  const parts = [
    { label: 'Premium', w: 79, color: 'bg-slate-800' },
    { label: 'Admin', w: 7, color: 'bg-slate-200' },
    { label: 'Hidden commission', w: 14, color: 'bg-slate-400' },
  ];

  return (
    <AppCard>
      <CardHeader
        title="Broker_Agreement_Local.pdf"
        sub="Contract analysis · auto-translated"
        right={
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors border ${
            step >= 1 
              ? 'border-amber-200 bg-amber-50 text-amber-700' 
              : 'border-slate-200 bg-slate-50 text-slate-400'
          }`}>
            {step >= 1 ? '1 flag' : 'Reading'}
          </span>
        }
      />
      <div className="space-y-2.5 px-6 py-5">
        {[92, 78].map((w, i) => (
          <motion.div
            key={i}
            initial={{ width: '0%' }}
            animate={{ width: `${w}%` }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.7, ease: EASE }}
            className="h-1.5 rounded-full bg-slate-100"
          />
        ))}
        
        <div className="relative rounded-lg px-3 py-2.5 text-[12px] leading-relaxed text-slate-600">
          <motion.span
            aria-hidden
            initial={{ width: '0%' }}
            animate={{ width: step >= 1 ? '100%' : '0%' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="absolute inset-y-0 left-0 rounded-lg bg-slate-100 border border-slate-300"
          />
          <span className="relative">
            <b className="text-slate-800">7.3</b> The Insurer shall remit <b className="text-slate-900 underline decoration-slate-400">14%</b> of gross premium to the Broker as a service fee, not itemised on client invoices.
          </span>
        </div>
        
        {[84, 60].map((w, i) => (
          <motion.div
            key={i}
            initial={{ width: '0%' }}
            animate={{ width: `${w}%` }}
            transition={{ delay: 0.6 + i * 0.1, duration: 0.7, ease: EASE }}
            className="h-1.5 rounded-full bg-slate-100"
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 8 }}
        className="mx-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
      >
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Undisclosed commission</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Clause 7.3 · local broker contract</div>
        </div>
        <div className="text-2xl font-semibold tabular-nums text-slate-900">
          ${amount.toFixed(1)}M<span className="text-xs font-normal text-slate-400"> / yr</span>
        </div>
      </motion.div>

      <div className="px-6 pb-6 pt-5">
        <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          True cost of the programme
        </div>
        <div className="flex h-2 gap-1 overflow-hidden rounded-full">
          {parts.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ width: '0%' }}
              animate={{ width: `${p.w}%` }}
              transition={{ delay: 0.8 + i * 0.15, duration: 0.9, ease: EASE }}
              className={`${p.color} rounded-full`}
            />
          ))}
        </div>
        <div className="mt-3 flex justify-between text-[10.5px] font-medium text-slate-500">
          {parts.map((p) => (
            <span key={p.label} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${p.color}`} />
              {p.label}
            </span>
          ))}
        </div>
      </div>
    </AppCard>
  );
}



// ---------- CARD 5: VENDORS / RENEWAL ----------
function RenewalCard() {
  const step = useSequence([1600]);
  const quotes = [
    { label: 'Incumbent broker', val: 'Baseline', w: 100, color: 'bg-slate-200' },
    { label: 'Cuido benchmark', val: '−26% cost', w: 74, color: 'bg-[#0A1128]' },
  ];

  return (
    <AppCard>
      <CardHeader
        title="Renewal · Group Life"
        sub="Singapore · renews in 90 days"
        right={
          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Auto-started
          </span>
        }
      />
      <div className="px-6 pt-6">
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '55%' }}
            transition={{ delay: 0.5, duration: 1.4, ease: EASE }}
            className="h-full rounded-full bg-[#0A1128]"
          />
        </div>
        <div className="mt-3 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          <span className="text-[#2E8A8A]">Day 90 · Benchmark</span>
          <span>Day 45 · Negotiate</span>
          <span>Day 0 · Renew</span>
        </div>
        
        <div className="mt-6 space-y-4">
          {quotes.map((q, i) => (
            <div key={q.label}>
              <div className="mb-2 flex justify-between text-[11px] font-medium">
                <span className="text-slate-500">{q.label}</span>
                <span className="text-slate-800">{q.val}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${q.w}%` }}
                  transition={{ delay: 0.6 + i * 0.25, duration: 1, ease: EASE }}
                  className={`h-full rounded-full ${q.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 10 }}
        className="mx-6 my-6 flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-800 shadow-sm border border-slate-200">
          <Lightning size={18} weight="fill" />
        </div>
        <div>
          <div className="text-[13px] font-semibold leading-tight text-slate-800">
            $200k/yr redirected to new benefits
          </div>
          <div className="mt-1 text-[11px] font-medium text-slate-500">
            Approved · Friday 16:15
          </div>
        </div>
      </motion.div>
    </AppCard>
  );
}




// ---------- CHAPTERS ----------

type Chapter = {
  id: string;
  tab: string;
  eyebrow: string;
  title: string;
  body: string;
  stat: { value: string; label: string };
  accent: string;
  scene: string;
  image?: string; // optional photo, e.g. '/images/proya-1.jpg'
  Card: React.ComponentType;
};

const CHAPTERS: Chapter[] = [
  {
    id: 'ingest',
    tab: 'Ingest',
    eyebrow: 'Monday · 08:52',
    title: 'Proya inherits 43 countries of paperwork.',
    body: 'Policies in PDFs. Contracts in six languages. Commission schedules buried in inboxes. Cuido reads, translates and organizes all of it into one authoritative source, before her coffee gets cold.',
    stat: { value: '312', label: 'documents structured in minutes' },
accent: '#0A1128',
  scene: 'transparent',
      Card: IngestCard,
  },
  {
    id: 'ask',
    tab: 'Ask Cuido',
    eyebrow: 'Tuesday · 11:20',
    title: 'A last-minute question. Answered in seconds.',
    body: 'Warsaw needs the maternity policy before a noon call. Proya asks Cuido in plain English and gets the answer translated, compared to local law, with the source document attached.',
    stat: { value: '6 sec', label: 'from question to cited answer' },
accent: '#0A1128',
  scene: 'transparent',
      Card: AskCard,
  },
  {
    id: 'inventory',
    tab: 'Inventory',
    eyebrow: 'Wednesday · 14:40',
    title: 'Every benefit. Every country. One clear picture.',
    body: "For the first time Proya can see what's actually offered, where programs overlap, and where employees aren't covered at all. No more spreadsheets stitched together by hand.",
    stat: { value: '100%', label: 'of benefits inventoried, country by country' },
accent: '#0A1128',
  scene: 'transparent',
      Card: InventoryCard,
  },
  {
    id: 'cost',
    tab: 'True cost',
    eyebrow: 'Thursday · 10:05',
    title: 'Hidden commissions have nowhere to hide.',
    body: 'Cuido reads a local broker contract and surfaces a commission that never appeared on the invoice, with the exact clause that proves it. Proya finally sees the true cost of a benefit.',
    stat: { value: '$1M/yr', label: 'undisclosed commission found in one local contract' },
 accent: '#0A1128',
  scene: 'transparent',
      Card: CostCard,
  },
  {
    id: 'vendors',
    tab: 'Vendors',
    eyebrow: 'Friday · 16:15',
    title: 'She walks into the room leading, not chasing.',
    body: 'Ninety days before every renewal, Cuido benchmarks the market. Proya negotiates from evidence, brings brokerage costs down, and redirects the savings to benefits her people actually want.',
    stat: { value: '$1.1M/yr', label: 'brokerage cost reduced across 20 countries' },
 accent: '#0A1128',
  scene: 'transparent', 
  Card: RenewalCard,
  },
];

const slideVariants: Variants = {
  enter: (d: number) => ({ opacity: 0, x: d * 80 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
  exit: (d: number) => ({ opacity: 0, x: d * -80, transition: { duration: 0.28 } }),
};


// ---------- SECTION ----------

function StorySection() {
  const [[index, dir], setPage] = useState<[number, number]>([0, 1]);
  const [hovered, setHovered] = useState(false);
  const [started, setStarted] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.35 });
  const reduce = useReducedMotion();
  const N = CHAPTERS.length;
  const chapter = CHAPTERS[index];
  const Card = chapter.Card;
  const paused = hovered || !inView || !!reduce;

  useEffect(() => {
    if (inView) setStarted(true);
  }, [inView]);

  const go = (i: number) =>
    setPage(([cur, d]): [number, number] => (i === cur ? [cur, d] : [i, i > cur ? 1 : -1]));
  const next = () => setPage(([cur]): [number, number] => [(cur + 1) % N, 1]);
  const prev = () => setPage(([cur]): [number, number] => [(cur - 1 + N) % N, -1]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <section id="story" className="relative bg-white pt-12 pb-28 md:pt-24 md:pb-36">
      <style>{`@keyframes proya-progress { from { width: 0% } to { width: 100% } }`}</style>

      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-14 max-w-4xl md:mb-20">
        
        
        
       <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
  <span className="h-px w-8 bg-slate-300" />
  How Origin works
</div>
  <h2 className="text-5xl font-semibold leading-[1.02] tracking-tighter text-[#0A1128] md:text-7xl">
  Meet Proya.
  <br />
  <span className="font-normal text-[#0A1128]/60">Here's her week with Origin.</span>
</h2>
<p className="mt-6 max-w-2xl text-lg text-slate-500 md:text-xl">

            Proya runs global benefits across 43 countries. From Monday's scramble to Friday's strategy,
            Cuido, Origin's Artificial Benefits Intelligence, is working behind the scenes.
          </p>
        </div>

        {/* Stage */}
        <div
          ref={stageRef}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
          }}
          onMouseMove={onMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="group relative h-[960px] overflow-hidden rounded-xl border border-[#0a7c83] bg-[#0a7c83] outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:h-[900px] lg:h-[540px]"
        >
          {/* Scene (crossfades) */}
          <AnimatePresence>
            <motion.div
              key={chapter.id}
              className="absolute inset-0"
              style={{ background: chapter.scene }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              // 0.99 keeps the old scene visible underneath while the new one fades in
              exit={{ opacity: 0.99, transition: { duration: 1, ease: 'linear' } }}
              transition={{ duration: 0.9 }}
            >
              {chapter.image && (
                <img src={chapter.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
              )}
               
            </motion.div>
          </AnimatePresence>

            

          {/* Mouse spotlight */}
            

          {/* Slide */}
          {started && (
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={chapter.id}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) next();
                  else if (info.offset.x > 80) prev();
                }}
                className="absolute inset-0 flex flex-col justify-center gap-8 p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-center lg:gap-16 lg:px-12 xl:gap-24 xl:px-20"
              >
                <span className="pointer-events-none absolute -bottom-12 left-6 select-none text-[240px] font-bold leading-none tracking-tighter text-white/[0.05]">
                  0{index + 1}
                </span>

                {/* Copy */}
                <div className="relative z-10 max-w-[480px] lg:max-w-[420px] xl:max-w-[480px]">
                  <Rise>
                    <div
                      className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/70"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-white/70"
                      />
                      {chapter.eyebrow}
                    </div>
                  </Rise>
                  <Rise d={0.08}>
                    <h3 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[38px] xl:text-[44px]">
                      {chapter.title}
                    </h3>
                  </Rise>
                  <Rise d={0.16}>
                    <p className="mt-5 text-[15px] leading-relaxed text-white/70 lg:text-[16px] xl:text-[17px]">
                      {chapter.body}
                    </p>
                  </Rise>
                  <Rise d={0.24} className="mt-8 flex items-center gap-5 border-t border-white/20 pt-6">
                    <span className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                      {chapter.stat.value}
                    </span>
                    <span className="max-w-[190px] text-[11px] font-medium uppercase leading-snug tracking-widest text-white/50">
                      {chapter.stat.label}
                    </span>
                  </Rise>
                </div>

                {/* Product card */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10 w-full max-w-[560px] lg:max-w-[520px] lg:shrink-0 xl:max-w-[580px]"
                >
                  <Card />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Nav */}
        <div className="mt-10 flex flex-col items-center gap-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous chapter"
              className="hidden h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#0A1128] sm:flex"
            >
              <ArrowLeft size={16} />
            </button>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {CHAPTERS.map((c, i) => {
                const active = i === index;
                return (
                  <motion.button
                    layout
                    key={c.id}
                    type="button"
                    aria-label={c.tab}
                    aria-current={active}
                    onClick={() => go(i)}
                    style={{ borderRadius: 999 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  
                 className={`relative flex h-11 items-center overflow-hidden border text-sm font-medium ${
  active
    ? 'border-[#0a7c83] bg-white pl-1.5 pr-5 text-[#0a7c83]'
    : 'border-slate-200 bg-white p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#0a7c83]'
}`}

                  >
                    <motion.span
                      layout="position"
                   className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
  active ? 'bg-[#0a7c83] text-white' : ''
}`}
                  
                  >
                      {i + 1}
                    </motion.span>
                    {active && (
                      <motion.span
                        layout="position"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ml-2 whitespace-nowrap"
                      >
                        {c.tab}
                      </motion.span>
                    )}
                    {active && (
                      <span
                        key={index}
                        onAnimationEnd={next}
                        className="absolute bottom-0 left-0 h-[2px] bg-[#0a7c83]"
                        style={{
                          animation: `proya-progress ${CHAPTER_MS}ms linear forwards`,
                          animationPlayState: paused ? 'paused' : 'running',
                        }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next chapter"
              className="hidden h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#0A1128] sm:flex"
            >
              <ArrowRight size={16} />
            </button>
          </div>
<p className="text-sm text-slate-400">Cuido is Spanish for "I take care."</p>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// CUIDO AI INTERACTIVE TERMINAL
// ==========================================

function CuidoTerminal() {
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    const sequence = async () => {
      await new Promise(r => setTimeout(r, 1000));
      setStep(1); // User asks
      await new Promise(r => setTimeout(r, 1500));
      setStep(2); // AI thinking
      await new Promise(r => setTimeout(r, 2000));
      setStep(3); // AI answers
    };
    sequence();
  }, []);

  return (
    <section className="bg-[#0A1128] py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2E8A8A] bg-[#2E8A8A]/10 px-4 py-2 text-sm font-bold text-[#A0E8AF]">
              <MessageSquare size="{16}"/> Natural Language Query
            </div>
            <h2 className="mt-8 text-4xl font-bold text-white md:text-5xl">Ask Cuido™.<br/>Get answers instantly.</h2>
            <p className="mt-6 text-xl text-white/60">
              Stop digging through share drives. Cuido cross-references legal PDFs, billing data, and compliance guidelines in real-time, in any language.
            </p>
            <ul className="mt-10 space-y-4">
              {['Trained on enterprise benefits logic', 'Cites exact document sources', 'Enterprise-grade data isolation'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#A0E8AF]/20 text-[#A0E8AF]">
                    <Check size={12} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-2 shadow-2xl">
            <div className="flex flex-col gap-6 rounded-[1.8rem] border border-slate-100 bg-slate-50 p-6 lg:p-8">
              
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A1128] text-white">
                  <Sparkles size={20}/>
                </div>
                <div>
                  <div className="font-bold text-slate-800">Cuido™ Assistant</div>
                  <div className="text-xs text-emerald-600 font-medium">Online • Context: Global Benefits</div>
                </div>
              </div>

              {/* Chat Area */}
              <div className="min-h-[300px] space-y-6 text-sm">
                
                <AnimatePresence>
                  {step >= 1 && (
                    <motion.div 
                    key="user-msg" initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#0A1128] p-4 text-white"
                    >
                      "What is our exact parental leave policy in Poland, and how does it compare to the local statutory requirement?"
                    </motion.div>
                  )}
                  
                  {step >= 2 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      key="ai-msg" className="max-w-[90%] rounded-2xl rounded-tl-sm border border-slate-200 bg-white p-4 text-slate-700 shadow-sm"
                    >
                      {step === 2 ? (
                        <div className="flex gap-2">
                           <span className="h-2 w-2 animate-bounce rounded-full bg-[#A0E8AF]" />
                           <span className="h-2 w-2 animate-bounce rounded-full bg-[#A0E8AF] [animation-delay:0.2s]" />
                           <span className="h-2 w-2 animate-bounce rounded-full bg-[#A0E8AF] [animation-delay:0.4s]" />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p>Based on the <span className="cursor-pointer border-b border-dashed border-[#A0E8AF] text-[#A0E8AF]">Polish Employee Handbook (v2025)</span> translated from Polish:</p>
                          <ul className="list-inside list-disc space-y-1 text-white/70">
                            <li><strong className="text-white">Origin Policy:</strong> 26 weeks paid at 100%.</li>
                            <li><strong className="text-white">Statutory:</strong> 20 weeks at 100% (or 32 weeks at 81.5%).</li>
                          </ul>
                          <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700">
                            <ShieldCheck className="inline mr-1" size={14}/> Fully compliant. Last verified: 2 days ago.
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


// ==========================================
// IMPACT — STATS + TESTIMONIALS (WHITE SECTION)
// ==========================================


// ==========================================
// IMPACT — STATS + TESTIMONIALS (WHITE SECTION)
// ==========================================

type Testimonial = {
  name: string;
  role: string;
  initials: string;
  quote: string;
  context: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Rob Hamer',
    role: 'Global Benefits Lead',
    initials: 'RH',
    quote: '…already identified around £150-200,000 worth of savings.',
    context: 'On what Origin uncovered across a large Singapore operation.',
  },
  {
    name: 'Amy Manning',
    role: 'Senior Director, Retirement Programs and International Benefits',
    initials: 'AM',
    quote: 'Time is money and Origin helps with speed.',
    context: 'On pairing strong technology with real benefits expertise.',
  },
  {
    name: 'Angela Sim',
    role: 'Senior Director of Global Benefits',
    initials: 'AS',
    quote: 'We have over 520 policies around the world…',
    context: 'On keeping leave policies current as local laws change, and reading them all in English.',
  },
  {
    name: 'Carolina Vertel',
    role: 'Benefits Leader US and LATAM',
    initials: 'CV',
    quote: '…urgent questions about how we operate in different countries.',
    context: 'On why one global view of benefits matters.',
  },
  {
    name: 'Katie Archer',
    role: 'Global Benefits Lead',
    initials: 'KA',
    quote: '…empowered to shift from being reactive … to being proactive and more strategic.',
    context: 'On moving from gathering information to shaping what employees are offered.',
  },
];

function Stat({
  i,
  to,
  decimals = 0,
  suffix,
  label,
}: {
  i: number;
  to: number;
  decimals?: number;
  suffix: string;
  label: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
      className={`flex flex-col border-t border-white/15 pt-6 ${['lg:mt-0', 'lg:mt-14', 'lg:mt-28'][i]}`}
    >
      <span className="mb-4 text-[11px] font-medium tabular-nums tracking-[0.18em] text-[#A0E8AF]">
        {String(i + 1).padStart(2, '0')}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[40px] font-medium leading-none tracking-tight text-white xl:text-[48px]">
          <AnimatedCounter prefix="$" to={to} decimals={decimals} suffix={suffix} duration={1.6} />
        </span>
        <span className="text-[18px] font-normal text-white/45">/yr</span>
      </div>
      <p className="mt-4 max-w-[220px] text-[13px] leading-relaxed text-white/55">
        {label}
      </p>
    </motion.div>
  );
}

function TestimonialRow() {
  const scroller = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) =>
    scroller.current?.scrollBy({ left: dir * 380, behavior: 'smooth' });

  return (
    <div className="mt-32">
      <div className="mb-10 flex items-end justify-between border-b border-slate-200 pb-5">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400 mb-3">Testimonials</div>
          <h3 className="text-[28px] font-medium tracking-[-0.02em] text-[#fafafa] md:text-[34px]">
            What benefits leaders say
          </h3>
        </div>
        <div className="hidden gap-3 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Previous"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-[#0A1128] hover:text-[#0A1128] hover:shadow-md"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Next"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-[#0A1128] hover:text-[#0A1128] hover:shadow-md"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
                className="-mx-6 flex  scroll-px-6 gap-6 overflow-x-auto overflow-y-visible px-6 pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    
    >

              {TESTIMONIALS.map((t, i) => (
          <div
            key={t.name}
            className="group relative flex h-[360px] w-[calc((100%-4.5rem)/4)] min-w-[300px] shrink-0 snap-start flex-col justify-between bg-[#0a7c83] p-7 shadow-none border-none transition-colors duration-300"
          >
            {/* Decorative Quote Mark */}
            <div className="absolute top-5 right-6 text-5xl font-serif leading-none text-white/10 select-none transition-colors duration-500 group-hover:text-white/20">
              &ldquo;
            </div>

            <blockquote className="relative z-10">
              <p className="text-[15.5px] font-medium leading-snug tracking-tight text-white">
                “{t.quote}”
              </p>
              <p className="mt-4 text-[13px] leading-relaxed text-white/70">{t.context}</p>
            </blockquote>
            
            <figcaption className="relative z-10 mt-6 flex items-center gap-3.5 border-t border-white/20 pt-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-[11px] font-semibold text-white">
                {t.initials}
              </div>
              <div className="min-w-0">
                <div className="text-[13.5px] font-semibold text-white">{t.name}</div>
                <div className="line-clamp-2 text-[12px] leading-snug text-white/60">{t.role}</div>
              </div>
            </figcaption>
          </div>
        ))}
      </div>
    </div>
  );
}

function GlobeLines({ className = '' }: { className?: string }) {
  const cx = 900, cy = 380, R = 340;
  const lats = [-0.8, -0.55, -0.3, 0, 0.3, 0.55, 0.8];
  const meridians = [0.2, 0.42, 0.66, 0.88];
  const nodes = [
    { x: 760, y: 270 }, { x: 900, y: 230 }, { x: 1010, y: 330 },
    { x: 830, y: 420 }, { x: 960, y: 480 }, { x: 700, y: 400 },
  ];
  const arcs = [[0, 1], [1, 2], [0, 3], [3, 4], [2, 4], [5, 0], [5, 3]].map(([a, b]) => {
    const A = nodes[a], B = nodes[b];
    const mx = (A.x + B.x) / 2;
    const my = Math.min(A.y, B.y) - Math.hypot(B.x - A.x, B.y - A.y) * 0.35;
    return `M${A.x} ${A.y} Q${mx} ${my} ${B.x} ${B.y}`;
  });

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-0 top-0 h-[800px] ${className}`}>
      <style>{`
        @keyframes globe-travel { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
        .globe-travel { stroke-dasharray: 0.18 0.82; animation: globe-travel 5s linear infinite; }
      `}</style>
      <svg viewBox="0 0 1200 800" className="h-full w-full" preserveAspectRatio="xMaxYMin meet" fill="none">
        <defs>
          <radialGradient id="globeFade" cx="75%" cy="47%" r="55%">
            <stop offset="0" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.6" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="globeMask">
            <rect width="1200" height="800" fill="url(#globeFade)" />
          </mask>
          <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#0a7c83" stopOpacity="0.35" />
            <stop offset="1" stopColor="#0a7c83" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={cx} cy={cy} r={R * 1.35} fill="url(#globeGlow)" />

        <g mask="url(#globeMask)" stroke="#A0E8AF">
          <circle cx={cx} cy={cy} r={R} strokeOpacity="0.22" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={R * 1.18} strokeOpacity="0.08" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={R * 1.42} strokeOpacity="0.05" strokeWidth="1" />

          {/* latitudes */}
          {lats.map((l) => {
            const rx = R * Math.sqrt(1 - l * l);
            return <ellipse key={l} cx={cx} cy={cy + R * l} rx={rx} ry={rx * 0.16} strokeOpacity="0.14" strokeWidth="1" />;
          })}

          {/* meridians */}
          {meridians.map((m) => (
            <ellipse key={m} cx={cx} cy={cy} rx={R * m} ry={R} strokeOpacity="0.14" strokeWidth="1" />
          ))}
          <line x1={cx} y1={cy - R} x2={cx} y2={cy + R} strokeOpacity="0.14" strokeWidth="1" />

          {/* arcs: faint base + travelling pulse */}
          {arcs.map((d, i) => (
            <g key={i}>
              <path d={d} strokeOpacity="0.25" strokeWidth="1" />
              <path
                d={d}
                pathLength={1}
                stroke="#A0E8AF"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="globe-travel"
                style={{ animationDelay: `${i * 0.7}s` }}
              />
            </g>
          ))}

          {/* nodes */}
          {nodes.map((n, i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r="4" fill="#A0E8AF" stroke="none">
                <animate attributeName="r" values="4;16;4" dur="3.2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.35;0;0.35" dur="3.2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={n.x} cy={n.y} r="3" fill="#A0E8AF" stroke="#031a20" strokeWidth="1.5" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}


function ImpactSection({ onOpenCalculator }: { onOpenCalculator: () => void }) {
  return (

    <section id="impact" className="relative isolate overflow-hidden bg-[#031a20]">
      {/* Background: grid + glows + globe lines */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 70% 50% at 75% 20%, #000 25%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 75% 20%, #000 25%, transparent 75%)',
          }}
        />
        <div className="absolute bottom-[-10%] left-[-10%] h-[420px] w-[420px] rounded-full bg-[#A0E8AF]/[0.05] blur-[120px]" />
        <GlobeLines className="!h-[520px]" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:py-32">
        {/* Editorial header + stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)] lg:items-start lg:gap-16"
        >
          <div className="lg:-mt-12">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#A0E8AF]">
              Proven Impact
            </span>
            <h2 className="mt-5 text-[38px] font-medium leading-[1.05] tracking-[-0.02em] text-white md:text-[52px]">
              Real teams. <span className="text-white/45">Real savings.</span>
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/55">
              Benefits leaders use Origin to find money hiding in plain sight, then put it back into their people.
            </p>
          </div>

          <div className="grid items-start gap-10 sm:grid-cols-3">
            <Stat i={0} to={200} suffix="k" label="saved and redirected to new benefits" />
            <Stat i={1} to={1.1} decimals={1} suffix="M" label="brokerage cost reduced across 20 countries" />
            <Stat i={2} to={1} suffix="M" label="of undisclosed commission found in one local contract" />
          </div>
        </motion.div>

        {/* Testimonials */}
        <TestimonialRow />

        {/* ROI Estimator — quiet inline CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-24 grid gap-8 border-t border-white/15 pt-12 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-center md:gap-16"
        >
          <div>
            <div className="flex items-center gap-2.5">
              <BarChart3 size={13} className="text-[#A0E8AF]" />
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#A0E8AF]">
                ROI Estimator
              </span>
            </div>
            <h3 className="mt-4 text-[28px] font-medium leading-[1.15] tracking-[-0.02em] text-white md:text-[34px]">
              How much could you be saving?
            </h3>
            <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-white/55">
              Model your enterprise optimization potential. Our calculator uses real-world benchmarks from global benefits data to estimate your hidden leakage.
            </p>
          </div>

          <div className="flex md:justify-end">
            <button
              onClick={onOpenCalculator}
              className="group inline-flex h-12 items-center gap-2.5 border border-white/20 bg-transparent px-7 text-[14px] font-medium text-white transition-colors duration-300 hover:border-[#A0E8AF] hover:text-[#A0E8AF] shadow-none"
            >
              Calculate your savings
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// PREMIUM SAVINGS CALCULATOR MODAL
// ==========================================

function SavingsCalculator({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [employees, setEmployees] = useState(5000);
  const [avgCost, setAvgCost] = useState(15000);
  const [countries, setCountries] = useState(15);
  
  // Enhanced logic for a more realistic enterprise model
  const baseOptimizationRate = 0.08; 
  const complexityFactor = 1 + (countries * 0.005); // More countries = more fragmentation = more savings
  const optimizationRate = Math.min(baseOptimizationRate * complexityFactor, 0.15); // Cap at 15%
  
  const estimatedSavings = employees * avgCost * optimizationRate;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A1128]/60 p-4 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-[#0A1128]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          {/* Left Column: Inputs */}
          <div className="flex w-full flex-col p-10 md:w-1/2 md:p-14">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#fafafa]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#fafafa]">
                <BarChart3 size={14} /> ROI Estimator
              </div>
              <h3 className="mt-6 text-3xl font-semibold tracking-tight text-[#0A1128] md:text-4xl">
                Model your savings.
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-500">
                Adjust the variables below to see how Origin can impact your bottom line.
              </p>
            </div>

            <div className="flex-1 space-y-10">
              {/* Slider 1 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Global Headcount
                  </label>
                  <span className="text-lg font-semibold tabular-nums text-[#0A1128]">
                    {employees.toLocaleString()}
                  </span>
                </div>
                <input 
                  type="range" min="1000" max="50000" step="500"
                  value={employees}
                  onChange={(e) => setEmployees(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#0A1128]"
                />
                <div className="mt-2 flex justify-between text-xs text-slate-400 font-medium">
                  <span>1,000</span>
                  <span>50,000+</span>
                </div>
              </div>

              {/* Slider 2 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Avg. Cost per Employee
                  </label>
                  <span className="text-lg font-semibold tabular-nums text-[#0A1128]">
                    ${avgCost.toLocaleString()}
                  </span>
                </div>
                <input 
                  type="range" min="5000" max="30000" step="1000"
                  value={avgCost}
                  onChange={(e) => setAvgCost(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#0A1128]"
                />
                <div className="mt-2 flex justify-between text-xs text-slate-400 font-medium">
                  <span>$5,000</span>
                  <span>$30,000+</span>
                </div>
              </div>

              {/* Slider 3 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Countries with Employees
                  </label>
                  <span className="text-lg font-semibold tabular-nums text-[#0A1128]">
                    {countries}
                  </span>
                </div>
                <input 
                  type="range" min="1" max="100" step="1"
                  value={countries}
                  onChange={(e) => setCountries(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#0A1128]"
                />
                <div className="mt-2 flex justify-between text-xs text-slate-400 font-medium">
                  <span>1</span>
                  <span>100+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Results & CTA */}
          <div className="relative flex w-full flex-col justify-between bg-[#0A1128] p-10 text-white md:w-1/2 md:p-14">
            {/* Decorative background element */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#2E8A8A]/20 blur-[100px]" />
            
            <div className="relative z-10">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                Estimated Annual Optimization
              </h4>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-6xl font-bold tracking-tight text-[#A0E8AF] md:text-7xl">
                  $<AnimatedCounter to={estimatedSavings / 1000000} decimals={1} duration={1.2} from={0} suffix="M" />
                </span>
                <span className="text-lg font-medium text-white/40">/yr</span>
              </div>
              <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-white/60">
                Based on an estimated {((optimizationRate)*100).toFixed(1)}% optimization rate. This accounts for fragmented data, hidden commissions, and overlapping coverage across {countries} {countries === 1 ? 'country' : 'countries'}.
              </p>

              <div className="mt-10 space-y-4 border-t border-white/10 pt-8">
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-white/50">Total Benefit Spend</span>
                  <span className="font-medium text-white">${((employees * avgCost) / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-white/50">Optimization Rate</span>
                  <span className="font-medium text-[#A0E8AF]">{((optimizationRate)*100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-12">
              <button 
                onClick={onClose}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#A0E8AF] px-8 py-4 text-[16px] font-semibold text-[#0A1128] transition-all hover:bg-[#8ED9A0] hover:shadow-lg"
              >
                Discuss your results with our team
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
              <p className="mt-4 text-center text-xs text-white/40">
                This is an estimate. Actual savings depend on your specific vendor contracts.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


// ==========================================
// ENTERPRISE TRUST & FOOTER
// ==========================================

function TrustSection() {
  return (
    <section className="border-y border-white/5 bg-[#050505] py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 md:flex-row md:justify-between">
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-white">Bank-grade security. Enterprise scale.</h3>
          <p className="mt-2 text-white/50">SOC2 Type II • ISO 27001 • GDPR Compliant</p>
        </div>
        <div className="flex gap-4">
          <div className="flex h-16 w-32 items-center justify-center rounded-xl border border-white/10 bg-white/5 grayscale transition-all hover:grayscale-0">
             {/* Simulated Logo */}
             <span className="font-bold text-white/50">SOC 2</span>
          </div>
          <div className="flex h-16 w-32 items-center justify-center rounded-xl border border-white/10 bg-white/5 grayscale transition-all hover:grayscale-0">
             <span className="font-bold text-white/50">GDPR</span>
          </div>
        </div>
      </div>
    </section>
  );
}


function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#031a20] pb-12 pt-24">
      {/* Background: fading grid + soft teal glow (matching the Hero) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, #000 10%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, #000 10%, transparent 80%)',
          }}
        />
        <div className="absolute -top-[200px] left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[#0a7c83]/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5">
          
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <img
              src="https://originbenefits.com/hubfs/assets-s2/logo.svg"
              alt="Origin"
              className="h-7 w-auto brightness-0 invert opacity-90"
            />
            <p className="mt-6 max-w-xs text-[14px] leading-relaxed text-white/50">
              The authoritative system of record for global benefits. Turning fragmented vendor data into strategic enterprise intelligence.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A0E8AF]">Platform</h4>
            <ul className="mt-6 space-y-3.5 text-[14px] text-white/60">
              <li><a href="#" className="transition-colors hover:text-white">Global Dashboard</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Cuido™ AI</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Compliance Engine</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Vendor Benchmarking</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A0E8AF]">Company</h4>
            <ul className="mt-6 space-y-3.5 text-[14px] text-white/60">
              <li><a href="#" className="transition-colors hover:text-white">About Us</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Careers</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Security</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Contact Sales</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A0E8AF]">Legal</h4>
            <ul className="mt-6 space-y-3.5 text-[14px] text-white/60">
              <li><a href="#" className="transition-colors hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-[13px] text-white/40 md:flex-row">
          <span>© {new Date().getFullYear()} Origin Benefits Intelligence.</span>
          <span>Speculative enterprise design.</span>
        </div>
      </div>
    </footer>
  );
}
// Helper icons
function CheckIcon(props: any) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12" /></svg>;
}

 




// ==========================================
// SECURITY SECTION
// ==========================================

const SECURITY_ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Aligned to ISO 27001',
    desc: 'Security practices follow ISO 27001, the international standard for information security management.',
  },
  {
    icon: Lock,
    title: 'Secure cloud hosting',
    desc: 'Client data is stored on secure servers managed by cloud providers, in line with international data protection laws.',
  },
  {
    icon: Users,
    title: 'You stay in control',
    desc: 'Data can be deleted on verified request from your authorised representatives.',
  },
  {
    icon: Globe,
    title: 'Your platform, your infrastructure',
    desc: 'Origin is the source of truth for benefits data, passing verified information to the systems in your landscape that need it.',
  },
];


// ==========================================
// COMMUNITY & TEAM SECTION
// ==========================================

const COMMUNITY_PILLARS = [
  'Client experience',
  'Exclusive events',
  'Real conversations',
  'Shared progress',
];

function CommunitySection() {
  return (
    <section id="community" className="relative overflow-hidden bg-white pt-28 pb-16 md:pt-40 md:pb-24">
      {/* Subtle top gradient separator to blend with the previous dark section */}
      <div className="absolute left-1/2 top-0 h-px w-full max-w-[1600px] -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Editorial Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-4xl"
        >
          <div className="mb-8 flex items-center gap-3 -mt-16">
            <span className="h-px w-8 bg-slate-300" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0a7c83]">
              The Community
            </span>
          </div>
          <h3 className="text-4xl font-semibold leading-[1.05] tracking-tight text-[#0A1128] md:text-5xl lg:text-[56px]">
            When you join us,
            <br />
            <span className="text-slate-400">you join a community.</span>
          </h3>
          <p className="mt-8 max-w-2xl text-[18px] leading-relaxed text-slate-500">
            When you join Origin, you're not just buying software. You're joining a community of like-minded
            innovators. We bring together benefits leaders who are rewriting the rules, with an innovative client
            experience, exclusive events, real conversations, and a space to share ideas, challenges, and progress.
          </p>
        </motion.div>

        {/* The Manifesto Layout: Clean, Transparent, Editorial */}
        <div className="mt-20 grid gap-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-24">
          
          {/* Left Column: The Pillars as a refined list */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="flex flex-col justify-center"
          >
            <div className="space-y-0">
              {COMMUNITY_PILLARS.map((pillar, i) => (
                <div
                  key={pillar}
                  className="group flex items-center gap-6 border-b border-slate-100 py-6 transition-colors duration-500 hover:border-[#0a7c83] last:border-b-0"
                >
                  <span className="text-[12px] font-bold tabular-nums tracking-[0.1em] text-slate-300 transition-colors duration-500 group-hover:text-[#0a7c83]">
                    0{i + 1}
                  </span>
                  <span className="text-[18px] font-medium tracking-tight text-[#0A1128] transition-colors duration-500 group-hover:text-[#0a7c83]">
                    {pillar}
                  </span>
                  <ArrowRight
                    size={16}
                    className="ml-auto opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100 text-[#0a7c83]"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: The Transparent, Editorial Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="relative flex flex-col justify-center"
          >
            {/* The vertical line anchoring the quote */}
            <div className="absolute -left-6 top-0 bottom-0 w-px bg-slate-100 hidden lg:block" />

            <div className="relative pl-6 lg:pl-10">
              <span
                aria-hidden
                className="absolute -top-8 -left-2 select-none font-serif text-[100px] leading-none text-[#0a7c83]/10"
              >
                &ldquo;
              </span>
              
              <blockquote className="relative text-[24px] font-medium leading-[1.4] tracking-[-0.02em] text-[#0A1128] md:text-[30px]">
                It's been so wonderful to find a family of like-minded benefit professionals.{' '}
                <span className="text-slate-400">
                  The brainstorming, the challenging each other, is what I'll take away from this. It's helping me
                  already to think broadly.
                </span>
              </blockquote>

              {/* Author Footer with subtle underline */}
              <div className="mt-10 flex items-center gap-5 border-t border-slate-200 pt-8">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-50 text-[13px] font-semibold text-[#0A1128] ring-1 ring-slate-200">
                  KA
                </span>
                <div>
                  <div className="text-[16px] font-semibold text-[#0A1128]">Katie Archer</div>
                  <div className="mt-1 text-[14px] font-medium text-slate-500">Global Benefits Lead</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SecuritySection() {
  return (
    <section id="security" className="relative overflow-hidden bg-[#031a20] py-28 md:py-40">
      {/* Background: fading grid + soft glow (same as hero) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 80% 30%, #000 20%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 80% 30%, #000 20%, transparent 75%)',
          }}
        />
        <div className="absolute right-[-10%] top-[-10%] h-[520px] w-[520px] rounded-full bg-[#0a7c83]/25 blur-[140px]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[360px] w-[360px] rounded-full bg-[#A0E8AF]/[0.04] blur-[120px]" />
  
      </div>
      {/* Simple top hairline separator */}
       

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="grid gap-10 lg:grid-cols-2 lg:items-end -mt-16 "
        >
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#A0E8AF]">
              Security and data
            </span>
            <h2 className="mt-5 text-[38px] font-medium leading-[1.05] tracking-[-0.02em] text-white md:text-[52px]">
              Your data.
              <br />
              <span className="text-white/45">Protected by design.</span>
            </h2>
          </div>
          <p className="max-w-lg text-lg leading-relaxed text-white/55 lg:justify-self-end">
            Benefits data spans contracts, costs and people. Origin is built to keep it secure, and to make security
            reviews straightforward for your IT and procurement teams.
          </p>
        </motion.div>

        {/* Points */}
        <div className="mt-20 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {SECURITY_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
                className="border-t border-white/10 pt-8 transition-colors duration-500 hover:border-white/40"
              >
                <Icon size={22} strokeWidth={1.5} className="text-white/70" />
                <h3 className="mt-12 text-lg font-medium tracking-tight text-white">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/50">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Footer line */}
        <div className="mt-24 -mb-16 flex flex-col items-start justify-between gap-5 border-t border-white/10 pt-8 md:flex-row md:items-center">
          <p className="max-w-xl text-[15px] leading-relaxed text-white/50">
            Need details for a security review? The team can walk your IT and procurement teams through how Origin
            handles your data.
          </p>
          
          <a  href="#contact"
            className="group inline-flex items-center gap-2 border-b border-white/30 pb-0.5 text-[15px] font-medium text-white transition-colors hover:border-white"
          >
            Talk to us about security
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}



// ==========================================
// FAQ SECTION
// ==========================================


type Faq = { q: string; a: string; cta?: string };

const FAQS: Faq[] = [
  {
    q: 'How long does implementation take?',
    a: 'You start with the documents you already have: policies, contracts, commission schedules and vendor information. Cuido ingests, translates and organizes them into one source of truth. Timelines depend on the number of countries and the volume of documents, so the team scopes a plan with you before you commit.',
    cta: 'Get a scoped timeline',
  },
  {
    q: 'Which languages does Origin support?',
    a: 'Cuido ingests, translates and organizes data in any language. Local policies and contracts can stay in their original language while your global team reads and queries them in English.',
  },
  {
    q: 'Where is our data stored?',
    a: 'Client data is stored on secure servers managed by cloud providers, in line with international data protection laws. If you have specific residency requirements, raise them early so they can be covered in your security review.',
    cta: 'Discuss your requirements',
  },
  {
    q: 'Which security standards does Origin follow?',
    a: 'Origin’s security practices are aligned to ISO 27001, the international standard for information security management. For certification documents and your security questionnaire, the team can work directly with your IT and procurement teams.',
    cta: 'Request security details',
  },
  {
    q: 'How does Origin fit with our existing systems?',
    a: 'Origin is designed as your source of truth for benefits data, passing verified information to the systems in your landscape that need it. It is built to work alongside your existing platforms rather than replace them. Specific connections are confirmed during scoping.',
  },
  {
    q: 'Who in our organisation will use it?',
    a: 'Origin is built around the whole benefits ecosystem: global and local benefits teams, HR leaders and shared services, and functions such as procurement, finance, risk and legal. It also supports partners such as benefit administrators, local brokers, global consultants and vendors.',
  },
  {
    q: 'Does Origin replace our brokers or consultants?',
    a: 'No. Origin gives you visibility into every vendor, cost, fee and commission, so you manage those relationships with evidence rather than assumption. Your advisers keep their role, and you gain the data to hold them to it.',
  },
  {
    q: 'Can we have our data deleted?',
    a: 'Yes. Data can be deleted on verified request from your authorised representatives, sent to privacy@originbenefits.com. Retention terms are set out in Origin’s privacy policy.',
  },
];

function FaqRow({
  faq,
  open,
  onToggle,
}: {
  faq: Faq;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="group border-b border-slate-100 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-7 text-left transition-colors duration-300"
      >
        <span
          className={`text-[18px] font-medium tracking-tight transition-colors duration-300 md:text-[20px] ${
            open ? 'text-[#0A1128]' : 'text-slate-700 group-hover:text-[#0A1128]'
          }`}
        >
          {faq.q}
        </span>

        {/* Minimalist Toggle Icon */}
        <span
          className={`ml-6 flex h-6 w-6 shrink-0 items-center justify-center transition-transform duration-500 ${
            open ? 'rotate-45 text-[#0a7c83]' : 'text-slate-400 group-hover:text-[#0A1128]'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="7" y1="1" x2="7" y2="13" />
            <line x1="1" y1="7" x2="13" y2="7" />
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-10 pr-4 md:pr-12">
              <p className="max-w-2xl text-[16px] leading-relaxed text-slate-500">{faq.a}</p>
              {faq.cta && (
                <a
                  href="#contact"
                  className="group/cta mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-[#0a7c83] transition-colors hover:text-[#0A1128]"
                >
                  {faq.cta}
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover/cta:translate-x-1" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-white py-28 md:py-36">
      {/* Elegant Separator Line */}
      <div className="absolute top-0 left-1/2 h-px w-full max-w-[1600px] -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-400 to-transparent" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-24">
          
          {/* Left Column: Editorial Pitch */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <div className="flex items-center gap-3 mb-8 -mt-16">
              <span className="h-px w-8 bg-slate-300" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0a7c83]">
                FAQ
              </span>
            </div>
            
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-[#0A1128] md:text-6xl">
              Answers for IT, procurement and legal.
            </h2>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-slate-500">
              The questions enterprise teams ask before they say yes. If yours isn’t here, the team will answer it directly.
            </p>

            <div className="mt-16 max-w-md border-t border-slate-100 pt-10">
              <h3 className="text-[16px] font-semibold text-[#0A1128]">See it on your own benefits data.</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-500">
                Walk through Origin with the team, using your own countries, vendors and documents.
              </p>
              
              <button
                onClick={() => { /* scroll to contact logic or leave as is */ }}
                className="group mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-[#0A1128] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[#1C3F60] hover:shadow-lg"
              >
                Book a demo
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>

          {/* Right Column: Seamless Accordion */}
          <div className="pt-2">
            {FAQS.map((faq, i) => (
              <FaqRow
                key={faq.q}
                faq={faq}
                index={i}
                open={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}

// ==========================================
// CONTACT SECTION
// ==========================================

const FREE_EMAIL = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'live.com', 'msn.com', 'proton.me', 'protonmail.com'];
const SIZES = ['Under 1,000', '1,000 – 4,999', '5,000 – 19,999', '20,000+'];
const COUNTRY_RANGES = ['1 – 5', '6 – 20', '21 – 50', '50+'];
const SOURCES = ['Search', 'LinkedIn', 'Colleague or referral', 'Event', 'Other'];

type ContactData = {
  first: string;
  last: string;
  email: string;
  title: string;
  company: string;
  size: string;
  countries: string;
  goal: string;
  source: string;
};

const EMPTY_CONTACT: ContactData = {
  first: '',
  last: '',
  email: '',
  title: '',
  company: '',
  size: '',
  countries: '',
  goal: '',
  source: '',
};

const stepVariants: Variants = {
  enter: (d: number) => ({ opacity: 0, x: d * 20 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } },
  exit: (d: number) => ({ opacity: 0, x: d * -20, transition: { duration: 0.18 } }),
};

const FIELD_BASE =
  'h-14 w-full rounded-lg border bg-white px-4 text-[16px] text-[#050505] outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-black/5';
const fieldCls = (err?: string) =>
  `${FIELD_BASE} ${err ? 'border-rose-400' : 'border-slate-300 focus:border-[#050505]'}`;

function validateStep(step: number, d: ContactData): Record<string, string> {
  const e: Record<string, string> = {};
  if (step === 0) {
    if (!d.first.trim()) e.first = 'Required';
    if (!d.last.trim()) e.last = 'Required';
    const mail = d.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) e.email = 'Enter a valid email address';
    else if (FREE_EMAIL.includes(mail.split('@')[1])) e.email = 'Please use your work email';
    if (!d.title.trim()) e.title = 'Required';
  }
  if (step === 1) {
    if (!d.company.trim()) e.company = 'Required';
    if (!d.size) e.size = 'Select a range';
    if (!d.countries) e.countries = 'Select a range';
  }
  if (step === 2) {
    if (!d.goal.trim()) e.goal = 'Tell us a little about what you need';
    if (!d.source) e.source = 'Select an option';
  }
  return e;
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[14px] font-semibold text-[#050505]">{label}</span>
      {hint && <span className="-mt-1 mb-2 block text-[13px] italic text-slate-500">{hint}</span>}
      {children}
      {error && <span className="mt-1.5 block text-[13px] text-rose-600">{error}</span>}
    </label>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  error?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${fieldCls(error)} appearance-none pr-11 ${value ? '' : 'text-slate-400'}`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} className="text-[#050505]">
            {o}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}


function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center" role="img" aria-label={`Step ${step + 1} of 3`}>
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-1 items-center last:flex-none">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold transition-colors duration-300 ${
              i <= step ? 'bg-[#0a7c83] text-white' : 'bg-slate-200 text-slate-400'
            }`}
          >
            {i + 1}
          </span>
          {i < 2 && (
            <span 
              className={`mx-3 h-px flex-1 border-t border-dotted transition-colors duration-300 ${
                i < step ? 'border-[#0a7c83]' : 'border-slate-300'
              }`} 
            />
          )}
        </div>
      ))}
    </div>
  );
}


function ContactSection() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<ContactData>(EMPTY_CONTACT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const set = <K extends keyof ContactData>(k: K, v: ContactData[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const next = () => {
    if (status === 'sending') return;
    const e = validateStep(step, data);
    setErrors(e);
    if (Object.keys(e).length) return;
    if (step < 2) {
      setDir(1);
      setStep(step + 1);
    } else {
      setStatus('sending');
      timer.current = setTimeout(() => setStatus('done'), 1400);
    }
  };
  const back = () => {
    setErrors({});
    setDir(-1);
    setStep(step - 1);
  };
  const reset = () => {
    setData(EMPTY_CONTACT);
    setErrors({});
    setStep(0);
    setDir(1);
    setStatus('idle');
  };

  return (
    <section id="contact" className="relative scroll-mt-24 bg-white py-20 md:py-28">

      {/* Clean top separator */}
      <div className="absolute top-0 left-1/2 h-px w-full max-w-[1600px] -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-400 to-transparent" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-2xl bg-[#0a7c83] p-8 sm:p-10 lg:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] lg:gap-14">
            {/* Left: pitch */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: EASE }}
              className="flex flex-col justify-end lg:pb-6 lg:pl-6"
            >
              <span className="inline-flex w-fit items-center gap-2.5 rounded-full bg-white/80 px-4 py-2 text-[14px] font-medium text-[#0A1128]">
                <span className="h-2 w-2 rounded-full bg-[#0A1128]" />
                Talk to the team
              </span>
              <h2 className="mt-8 text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white lg:text-6xl">
                Real data.
                <br />
                No spreadsheets.
                <br />
                Benefits you can govern.
              </h2>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/80">
                Tell us where your benefits data lives today. The team will show you how Origin brings it together
                across your countries, vendors and documents.
              </p>
            </motion.div>

            {/* Right: form card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
     className="relative overflow-hidden rounded-xl bg-white p-7 pb-10 md:p-10 md:pb-12"
            >
              {status === 'done' ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="flex min-h-[420px] flex-col justify-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#050505] text-white">
                    <Check size={24} strokeWidth={2.25} />
                  </div>
                  <h3 className="mt-8 text-3xl font-semibold tracking-tight text-[#050505]">Thanks, {data.first}.</h3>
                  <p className="mt-3 max-w-sm text-[16px] leading-relaxed text-slate-600">
                    We have your request. The team will be in touch at {data.email} to arrange your walkthrough.
                  </p>

                  <dl className="mt-8 divide-y divide-slate-200 border-y border-slate-200 text-[15px]">
                    <div className="flex justify-between gap-6 py-3.5">
                      <dt className="text-slate-500">Company</dt>
                      <dd className="text-right font-medium text-[#050505]">{data.company}</dd>
                    </div>
                    <div className="flex justify-between gap-6 py-3.5">
                      <dt className="text-slate-500">Employees</dt>
                      <dd className="text-right font-medium text-[#050505]">{data.size}</dd>
                    </div>
                    <div className="flex justify-between gap-6 py-3.5">
                      <dt className="text-slate-500">Countries</dt>
                      <dd className="text-right font-medium text-[#050505]">{data.countries}</dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    onClick={reset}
                    className="mt-8 self-start text-[15px] font-medium text-slate-600 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-[#0a7c83]"
                  >
                    Send another request
                  </button>
                  <p className="mt-5 text-[13px] text-slate-500">Concept design: nothing is submitted.</p>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-[22px] font-semibold leading-tight tracking-[-0.03em] text-[#0a7c83] md:text-[26px]">
                    Ready to see Origin on your data?
                  </h3>

                  <div className="mt-8">
                    <Stepper step={step} />
                  </div>

                  <div
                    className="mt-8 min-h-[280px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') {
                        e.preventDefault();
                        next();
                      }
                    }}
                  >
                    <AnimatePresence mode="wait" custom={dir} initial={false}>
                      <motion.div
                        key={step}
                        custom={dir}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="space-y-5"
                      >
                        {step === 0 && (
                          <>
                            <div className="grid gap-5 sm:grid-cols-2">
                              <Field label="First name*" error={errors.first}>
                                <input
                                  className={fieldCls(errors.first)}
                                  value={data.first}
                                  onChange={(e) => set('first', e.target.value)}
                                  autoComplete="given-name"
                                />
                              </Field>
                              <Field label="Last name*" error={errors.last}>
                                <input
                                  className={fieldCls(errors.last)}
                                  value={data.last}
                                  onChange={(e) => set('last', e.target.value)}
                                  autoComplete="family-name"
                                />
                              </Field>
                            </div>
                            <Field label="Work email*" error={errors.email}>
                              <input
                                type="email"
                                className={fieldCls(errors.email)}
                                value={data.email}
                                onChange={(e) => set('email', e.target.value)}
                                autoComplete="email"
                              />
                            </Field>
                            <Field label="Job title*" error={errors.title}>
                              <input
                                className={fieldCls(errors.title)}
                                value={data.title}
                                onChange={(e) => set('title', e.target.value)}
                                autoComplete="organization-title"
                              />
                            </Field>
                          </>
                        )}

                        {step === 1 && (
                          <>
                            <Field label="Company*" error={errors.company}>
                              <input
                                className={fieldCls(errors.company)}
                                value={data.company}
                                onChange={(e) => set('company', e.target.value)}
                                autoComplete="organization"
                              />
                            </Field>
                            <Field label="Company size (total employees worldwide)*" error={errors.size}>
                              <Select
                                value={data.size}
                                onChange={(v) => set('size', v)}
                                options={SIZES}
                                placeholder="Select a range"
                                error={errors.size}
                              />
                            </Field>
                            <Field label="Countries with employees*" error={errors.countries}>
                              <Select
                                value={data.countries}
                                onChange={(v) => set('countries', v)}
                                options={COUNTRY_RANGES}
                                placeholder="Select a range"
                                error={errors.countries}
                              />
                            </Field>
                          </>
                        )}

                        {step === 2 && (
                          <>
                            <Field
                              label="What can we help with?*"
                              hint="Tell us what you're trying to fix."
                              error={errors.goal}
                            >
                              <textarea
                                className={`${fieldCls(errors.goal)} h-28 resize-none py-3`}
                                value={data.goal}
                                onChange={(e) => set('goal', e.target.value)}
                              />
                            </Field>
                            <Field label="How did you hear about us?*" error={errors.source}>
                              <Select
                                value={data.source}
                                onChange={(v) => set('source', v)}
                                options={SOURCES}
                                placeholder="Select an option"
                                error={errors.source}
                              />
                            </Field>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="mt-6 flex gap-3">
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={back}
                        disabled={status === 'sending'}
                        className="h-14 flex-[0.8] rounded-lg bg-slate-100 text-[16px] font-semibold text-[#050505] transition-colors hover:bg-slate-200 disabled:opacity-50"
                      >
                        Previous
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={next}
                      disabled={status === 'sending'}
                      className="flex h-14 flex-1 items-center justify-center gap-2.5 rounded-lg bg-[#0a7c83] text-[16px] font-semibold text-[#fff] transition-colors hover:bg-[#4ab59a] disabled:opacity-80"
                    >
                      {status === 'sending' ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Sending
                        </>
                      ) : step === 2 ? (
                        'Request a demo'
                      ) : (
                        'Next step'
                      )}
                    </button>
                  </div>
                  <p className="mt-5 text-[13px] leading-snug text-slate-500">Concept design: nothing is submitted.</p>
                </>
              )}

              {/* Clean white/slate accent strip */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5 bg-slate-800" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// MAIN APP EXPORT
// ==========================================

export default function App() {
  const [calcOpen, setCalcOpen] = useState(false);

  useEffect(() => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}, []);

  return (
    <div
  className="relative min-h-screen bg-[#050505] selection:bg-[#A0E8AF] selection:text-[#050505]"
  style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
>

      
      <main>
        <Hero/>
        <StorySection/>
        <ImpactSection onOpenCalculator={() => setCalcOpen(true)} />
                 <CommunitySection />  
        <SecuritySection/>
        <FaqSection/>
        <ContactSection/>
      </main>

      <Footer/>
      
      {/* Premium Calculator Modal */}
      <SavingsCalculator isOpen={calcOpen} onClose={() => setCalcOpen(false)} />
    </div>
  );
}