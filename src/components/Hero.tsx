import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useInView, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, Globe, Zap, LineChart, 
  MessageSquare, Lock, ChevronRight, BarChart3, 
  Building2, Users, Briefcase, Search, FileText,
  Sparkles, Check 
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

// ==========================================
// HERO SECTION
// ==========================================

function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050505] pt-32 text-center">
      {/* Ambient Glow Effects */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#2E8A8A]/20 to-[#1C3F60]/20 blur-[120px]" />
      <div className="absolute left-[20%] top-[20%] -z-10 h-[400px] w-[400px] rounded-full bg-[#A0E8AF]/10 blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 flex flex-col items-center px-6"
      >
        <div className="mb-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
          <Sparkles size={14} />
          Enterprise Benefits Intelligence
        </div>
        
        <h1 className="max-w-[1400px] text-6xl font-bold leading-[1.1] tracking-tighter text-white md:text-8xl">
          Bring your global benefits <span className="bg-gradient-to-r from-[#A0E8AF] to-[#D2F898] bg-clip-text text-transparent">out of the dark.</span>
        </h1>
        
        <p className="mt-8 max-w-3xl text-lg text-white/60 md:text-xl">
          Benefits are your second-biggest people cost. Stop managing them in spreadsheets. 
          Origin unifies data across 100+ countries into a single, AI-powered command center.
        </p>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
          <button className="group flex h-14 items-center gap-2 rounded-full bg-[#A0E8AF] px-8 font-bold text-[#050505] transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_#A0E8AF]">
            Explore the Platform
            <ArrowRight className="shrink-0 transition-transform group-hover:translate-x-1" size={18} />
          </button>
          <button className="flex h-14 items-center rounded-full border border-white/20 bg-white/5 px-8 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10">
            Read the Whitepaper
          </button>
        </div>
      </motion.div>

      {/* Hero Video */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        className="relative mt-24 w-full max-w-[1600px] px-6 pb-28"
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0A1128] shadow-[0_40px_120px_-40px_rgba(46,138,138,0.35)]">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src="https://play-eu1.hubspotvideo.com/v/144187838/id/357609122007?loop=true"
              title="Origin product video"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>
      </motion.div>
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
      className="relative w-full overflow-hidden rounded-none bg-white text-[#0A1128] shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-200"
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
    <section id="story" className="relative bg-white py-28 md:py-36">
      <style>{`@keyframes proya-progress { from { width: 0% } to { width: 100% } }`}</style>

      <div className="mx-auto max-w-[1600px] px-6">
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





const CARD_TINTS = ['bg-[#EEF6F1]', 'bg-[#F6F3EC]', 'bg-[#EEF2F7]', 'bg-[#F1F5F0]', 'bg-[#F5F1EE]'];

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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
      className="flex flex-col border-t border-slate-200 pt-8"
    >
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-semibold tracking-tight text-[#0A1128] xl:text-6xl">
          <AnimatedCounter prefix="$" to={to} decimals={decimals} suffix={suffix} duration={1.6} />
        </span>
        <span className="text-lg font-medium text-slate-400">/yr</span>
      </div>
      <p className="mt-4 max-w-[260px] text-[15px] leading-relaxed text-slate-500">{label}</p>
    </motion.div>
  );
}

function TestimonialRow() {
  const scroller = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) =>
    scroller.current?.scrollBy({ left: dir * 380, behavior: 'smooth' });

  return (
    <div className="mt-32">
      <div className="mb-10 flex items-end justify-between border-b border-slate-200 pb-6">
        <h3 className="text-2xl font-semibold tracking-tight text-[#0A1128] md:text-3xl">
          What benefits leaders say
        </h3>
        <div className="hidden gap-3 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Previous"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-[#0A1128] hover:text-[#0A1128]"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Next"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-[#0A1128] hover:text-[#0A1128]"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-6 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {TESTIMONIALS.map((t, i) => (
          <figure
            key={t.name}
            className="flex h-[380px] w-[calc((100%-4.5rem)/4)] min-w-[320px] shrink-0 snap-start flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
          >
            <blockquote>
              <p className="text-[20px] font-medium leading-snug tracking-tight text-[#0A1128]">
                “{t.quote}”
              </p>
              <p className="mt-5 text-[14px] leading-relaxed text-slate-500">{t.context}</p>
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4 border-t border-slate-100 pt-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0A1128] text-[13px] font-semibold text-white">
                {t.initials}
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-semibold text-[#0A1128]">{t.name}</div>
                <div className="line-clamp-2 text-[13px] leading-snug text-slate-500">{t.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function ImpactSection({ onOpenCalculator }: { onOpenCalculator: () => void }) {
  return (
    <section id="impact" className="bg-white py-28 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-semibold leading-[1.08] tracking-tight text-[#0A1128] md:text-6xl">
            Real teams. <span className="text-slate-400">Real savings.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-500">
            Benefits leaders use Origin to find money hiding in plain sight, then put it back into their people.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-20 grid gap-x-12 gap-y-12 md:grid-cols-3">
          <Stat i={0} to={200} suffix="k" label="saved and redirected to new benefits" />
          <Stat i={1} to={1.1} decimals={1} suffix="M" label="brokerage cost reduced across 20 countries" />
          <Stat i={2} to={1} suffix="M" label="of undisclosed commission found in one local contract" />
        </div>

        {/* Testimonials */}
        <TestimonialRow />

        {/* New Calculator CTA - Clean, Transparent, Pushed Up */}
        <div className="mt-16 border-t border-slate-200 pt-12">
          <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
            <div className="max-w-2xl">
              <h3 className="text-3xl font-semibold tracking-tight text-[#0A1128] md:text-4xl">
                How much could you be saving?
              </h3>
              <p className="mt-3 text-lg leading-relaxed text-slate-500">
                Model your enterprise optimization potential. Our calculator uses real-world benchmarks from global benefits data to estimate your hidden leakage.
              </p>
            </div>
            <button
              onClick={onOpenCalculator}
              className="group inline-flex h-16 shrink-0 items-center gap-3 rounded-full bg-[#0A1128] px-10 text-[16px] font-semibold text-white transition-all hover:bg-[#1C3F60] hover:shadow-xl hover:scale-105"
            >
              Calculate your savings
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
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
              <div className="inline-flex items-center gap-2 rounded-full bg-[#2E8A8A]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#2E8A8A]">
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
    <footer className="bg-[#050505] pb-12 pt-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 text-white">
              <Globe className="text-[#A0E8AF]" size={24} />
              <span className="text-2xl font-bold tracking-tight">origin</span>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/50">
              The authoritative system of record for global benefits. Turning fragmented vendor data into strategic enterprise intelligence.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white">Platform</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/50">
              <li><a href="#" className="hover:text-[#A0E8AF]">Global Dashboard</a></li>
              <li><a href="#" className="hover:text-[#A0E8AF]">Cuido™ AI</a></li>
              <li><a href="#" className="hover:text-[#A0E8AF]">Compliance Engine</a></li>
              <li><a href="#" className="hover:text-[#A0E8AF]">Vendor Benchmarking</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white">Company</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/50">
              <li><a href="#" className="hover:text-[#A0E8AF]">About Us</a></li>
              <li><a href="#" className="hover:text-[#A0E8AF]">Careers</a></li>
              <li><a href="#" className="hover:text-[#A0E8AF]">Security</a></li>
              <li><a href="#" className="hover:text-[#A0E8AF]">Contact Sales</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white">Legal</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/50">
              <li><a href="#" className="hover:text-[#A0E8AF]">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#A0E8AF]">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#A0E8AF]">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-24 border-t border-white/10 pt-8 text-center text-sm text-white/30">
          © {new Date().getFullYear()} Origin Benefits Intelligence. Speculative enterprise design.
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
// LOGO BAR
// ==========================================

const CLIENT_LOGOS = ['bp', 'EA', 'GILEAD', 'ORGANON'];

function LogoBar() {
  return (
    <section className="border-y border-white/5 bg-[#050505] py-14">
      <div className="mx-auto max-w-[1600px] px-6">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
          Trusted by global benefits teams
        </p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-16 gap-y-8 md:gap-x-24"
        >
          {CLIENT_LOGOS.map((name) => (
            <span
              key={name}
              className="text-2xl font-semibold tracking-tight text-white/35 transition-colors hover:text-white/70 md:text-3xl"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
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

function SecuritySection() {
  return (
    <section id="security" className="relative overflow-hidden bg-[#080A12] py-28 md:py-40">
      {/* depth: soft glows, faint grid, top hairline */}
      <div className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-[#2E8A8A]/20 blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[460px] w-[460px] rounded-full bg-[#1C3F60]/40 blur-[140px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)',
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div className="relative mx-auto max-w-[1600px] px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="grid gap-10 lg:grid-cols-2 lg:items-end"
        >
          <div>
            <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white/45">
              <span className="h-px w-8 bg-white/25" />
              Security and data
            </div>
            <h2 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl">
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
        <div className="mt-24 flex flex-col items-start justify-between gap-5 border-t border-white/10 pt-8 md:flex-row md:items-center">
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

type Faq = { tag: string; q: string; a: string; cta?: string };

const FAQS: Faq[] = [
  {
    tag: 'Implementation',
    q: 'How long does implementation take?',
    a: 'You start with the documents you already have: policies, contracts, commission schedules and vendor information. Cuido ingests, translates and organizes them into one source of truth. Timelines depend on the number of countries and the volume of documents, so the team scopes a plan with you before you commit.',
    cta: 'Get a scoped timeline',
  },
  {
    tag: 'Languages',
    q: 'Which languages does Origin support?',
    a: 'Cuido ingests, translates and organizes data in any language. Local policies and contracts can stay in their original language while your global team reads and queries them in English.',
  },
  {
    tag: 'Data residency',
    q: 'Where is our data stored?',
    a: 'Client data is stored on secure servers managed by cloud providers, in line with international data protection laws. If you have specific residency requirements, raise them early so they can be covered in your security review.',
    cta: 'Discuss your requirements',
  },
  {
    tag: 'Security',
    q: 'Which security standards does Origin follow?',
    a: 'Origin’s security practices are aligned to ISO 27001, the international standard for information security management. For certification documents and your security questionnaire, the team can work directly with your IT and procurement teams.',
    cta: 'Request security details',
  },
  {
    tag: 'Integration',
    q: 'How does Origin fit with our existing systems?',
    a: 'Origin is designed as your source of truth for benefits data, passing verified information to the systems in your landscape that need it. It is built to work alongside your existing platforms rather than replace them. Specific connections are confirmed during scoping.',
  },
  {
    tag: 'Stakeholders',
    q: 'Who in our organisation will use it?',
    a: 'Origin is built around the whole benefits ecosystem: global and local benefits teams, HR leaders and shared services, and functions such as procurement, finance, risk and legal. It also supports partners such as benefit administrators, local brokers, global consultants and vendors.',
  },
  {
    tag: 'Vendors',
    q: 'Does Origin replace our brokers or consultants?',
    a: 'No. Origin gives you visibility into every vendor, cost, fee and commission, so you manage those relationships with evidence rather than assumption. Your advisers keep their role, and you gain the data to hold them to it.',
  },
  {
    tag: 'Data control',
    q: 'Can we have our data deleted?',
    a: 'Yes. Data can be deleted on verified request from your authorised representatives, sent to privacy@originbenefits.com. Retention terms are set out in Origin’s privacy policy.',
  },
];

function FaqRow({
  faq,
  index,
  open,
  onToggle,
}: {
  faq: Faq;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-slate-200">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group flex w-full items-start gap-5 py-7 text-left md:gap-8 md:py-8"
      >
        <span className="mt-1.5 w-6 shrink-0 text-[12px] font-medium tabular-nums text-slate-300">
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">{faq.tag}</span>
          <span
            className={`mt-2 block text-xl font-medium leading-snug tracking-tight transition-colors md:text-2xl ${
              open ? 'text-[#0A1128]' : 'text-slate-600 group-hover:text-[#0A1128]'
            }`}
          >
            {faq.q}
          </span>
        </span>

        <span
          className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
            open
              ? 'border-[#0A1128] bg-[#0A1128] text-white'
              : 'border-slate-200 text-slate-400 group-hover:border-slate-400 group-hover:text-[#0A1128]'
          }`}
        >
          <span className="relative block h-3 w-3">
            <span className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-current" />
            <span
              className={`absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 bg-current transition-transform duration-300 ${
                open ? 'scale-y-0' : ''
              }`}
            />
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-9 pl-11 pr-4 md:pl-14 md:pr-16">
              <p className="max-w-2xl text-[16px] leading-relaxed text-slate-500">{faq.a}</p>
              {faq.cta && (
                
                 <a href="#contact"
                  className="group/cta mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-[#0A1128]"
                >
                  {faq.cta}
                  <ArrowRight size={14} className="transition-transform group-hover/cta:translate-x-1" />
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
    <section id="faq" className="bg-white py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-24">
          {/* Left: heading + conversion prompt */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">FAQ</div>
            <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-[#0A1128] md:text-6xl">
              Answers for IT, procurement and legal.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-500">
              The questions enterprise teams ask before they say yes. If yours isn’t here, the team will answer it
              directly.
            </p>

            <div className="mt-10 max-w-md border-t border-slate-200 pt-8">
              <div className="text-[15px] font-semibold text-[#0A1128]">See it on your own benefits data.</div>
              <p className="mt-1.5 text-[15px] leading-relaxed text-slate-500">
                Walk through Origin with the team, using your own countries, vendors and documents.
              </p>
              
              <a  href="#contact"
                className="group mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-[#0A1128] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[#1C3F60]"
              >
                Book a demo
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>

          {/* Right: accordion */}
          <div className="border-t border-slate-200">
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
    <section id="contact" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-6">
        <div className="rounded-[2rem] bg-[#0a7c83] p-6 sm:p-10 lg:p-14">
          <div className="grid items-stretch gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,700px)] lg:gap-16">
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
              className="relative overflow-hidden rounded-[1.75rem] bg-white p-8 pb-12 md:p-12 md:pb-14"
            >
              {status === 'done' ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="flex min-h-[520px] flex-col justify-center"
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
                  <h3 className="text-[32px] font-semibold leading-tight tracking-[-0.03em] text-[#0a7c83] md:text-4xl">
                    Ready to see Origin on your data?
                  </h3>

                  <div className="mt-8">
                    <Stepper step={step} />
                  </div>

                  <div
                    className="mt-8 min-h-[330px]"
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
      <NoiseOverlay/>
      
      <main>
        <Hero/>
        <LogoBar/>
        <StorySection/>
        <ImpactSection onOpenCalculator={() => setCalcOpen(true)} />
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