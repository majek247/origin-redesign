import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useInView, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, ShieldCheck, Globe, Zap, LineChart, 
  MessageSquare, FileText, Lock, ChevronRight, BarChart3, 
  Building2, Users, Briefcase, Search, Sparkles, Check, Languages
} from 'lucide-react';

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
        <div className="mb-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#A0E8AF] backdrop-blur-sm">
          <Sparkles size="{14}"/>
          Enterprise Benefits Intelligence
        </div>
        
        <h1 className="max-w-5xl text-6xl font-bold leading-[1.1] tracking-tighter text-white md:text-8xl">
          Bring your global benefits <span className="bg-gradient-to-r from-[#A0E8AF] to-[#D2F898] bg-clip-text text-transparent">out of the dark.</span>
        </h1>
        
        <p className="mt-8 max-w-2xl text-lg text-white/60 md:text-xl">
          Benefits are your second-biggest people cost. Stop managing them in spreadsheets. 
          Origin unifies data across 100+ countries into a single, AI-powered command center.
        </p>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
          <button className="group flex h-14 items-center gap-2 rounded-full bg-[#A0E8AF] px-8 font-bold text-[#050505] transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_#A0E8AF]">
            Explore the Platform
            <ArrowRight className="transition-transform group-hover:translate-x-1" size="{18}"/>
          </button>
          <button className="flex h-14 items-center rounded-full border border-white/20 bg-white/5 px-8 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10">
            Read the Whitepaper
          </button>
        </div>
      </motion.div>

      {/* Abstract Dashboard Preview */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, type: 'spring' }}
        className="relative mt-24 h-[40vh] w-full max-w-6xl px-6"
      >
        <div className="absolute inset-x-6 top-0 h-full rounded-t-[2.5rem] border-x border-t border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-xl shadow-2xl">
          <div className="flex h-12 items-center border-b border-white/10 px-6">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-white/20" />
              <div className="h-3 w-3 rounded-full bg-white/20" />
              <div className="h-3 w-3 rounded-full bg-white/20" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-3">
             <div className="h-32 rounded-2xl bg-white/5 border border-white/5" />
             <div className="h-32 rounded-2xl bg-[#A0E8AF]/10 border border-[#A0E8AF]/20" />
             <div className="h-32 rounded-2xl bg-white/5 border border-white/5" />
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
      className="relative w-full overflow-hidden rounded-2xl bg-white text-[#0A1128] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)] ring-1 ring-black/5"
    >
      {children}
    </motion.div>
  );
}

function CardHeader({ title, sub, right }: { title: string; sub: string; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0A1128] text-[#A0E8AF]">
          <Sparkles size={15} />
        </div>
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold leading-tight">{title}</div>
          <div className="truncate text-[11px] leading-tight text-slate-400">{sub}</div>
        </div>
      </div>
      {right}
    </div>
  );
}

// ---------- CARD 1: INGEST ----------

const INGEST_FILES = [
  { name: 'Handbook_Poland_2025.pdf', lang: 'PL' },
  { name: 'Contrato_Seguro_Vida_MX.pdf', lang: 'ES' },
  { name: 'Betriebsrente_Richtlinie_DE.docx', lang: 'DE' },
  { name: 'Plano_de_Saude_BR.pdf', lang: 'PT' },
  { name: 'Group_Life_Contract_SG.pdf', lang: 'EN' },
];

function IngestCard() {
  const step = useSequence([1100, 1800, 2500, 3200, 3900]);
  const count = useCountUp(312, 4200, 300);
  return (
    <AppCard>
      <CardHeader
        title="Cuido is reading"
        sub="43 countries · 9 languages"
        right={<span className="rounded-full bg-[#A0E8AF]/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1C3F60]">Live</span>}
      />
      <div className="space-y-1 px-3 py-3">
        {INGEST_FILES.map((f, i) => {
          const done = step > i;
          return (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.12, duration: 0.5, ease: EASE }}
              className="flex items-center gap-3 rounded-xl px-2.5 py-2"
            >
              <FileText size={16} className="shrink-0 text-slate-400" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12px] font-medium">{f.name}</div>
                <div className="text-[10px] text-slate-400">
                  {done ? (f.lang === 'EN' ? 'Structured' : `Translated ${f.lang} → EN · structured`) : 'Reading…'}
                </div>
              </div>
              <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">{f.lang}</span>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                {done ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2E8A8A] text-white"
                  >
                    <Check size={12} strokeWidth={3} />
                  </motion.span>
                ) : (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-[#2E8A8A]" />
                )}
              </span>
            </motion.div>
          );
        })}
      </div>
      <div className="border-t border-slate-100 px-5 py-4">
        <div className="flex items-end justify-between">
          <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Documents structured</div>
          <div className="text-2xl font-semibold tabular-nums">{Math.round(count)}</div>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2E8A8A] to-[#A0E8AF]"
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
    { label: 'Your policy', val: '26 weeks · 100% pay', w: 100, color: 'bg-[#2E8A8A]' },
    { label: 'Statutory minimum', val: '20 weeks · 100% pay', w: 77, color: 'bg-slate-300' },
  ];
  return (
    <AppCard>
      <CardHeader
        title="Ask Cuido"
        sub="All countries · any language"
        right={<Languages size={16} className="text-slate-300" />}
      />
      <div className="min-h-[290px] space-y-3 px-4 py-4 text-[12.5px]">
        {typed && (
          <div className="ml-auto max-w-[90%] rounded-2xl rounded-tr-md bg-[#0A1128] px-3.5 py-2.5 leading-snug text-white">
            {typed}
            {step < 1 && <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse bg-[#A0E8AF]" />}
          </div>
        )}
        <AnimatePresence>
          {step === 1 && (
            <motion.div
              key="think"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex w-fit gap-1.5 rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3"
            >
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#2E8A8A]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#2E8A8A] [animation-delay:0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#2E8A8A] [animation-delay:0.3s]" />
            </motion.div>
          )}
          {step >= 2 && (
            <motion.div
              key="answer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 rounded-2xl rounded-tl-md bg-slate-50 p-3.5 ring-1 ring-slate-100"
            >
              <p className="font-semibold leading-snug">Your policy exceeds the statutory minimum.</p>
              <div className="space-y-2.5">
                {rows.map((r, i) => (
                  <div key={r.label}>
                    <div className="mb-1 flex justify-between text-[11px]">
                      <span className="font-medium text-slate-500">{r.label}</span>
                      <span className="font-semibold">{r.val}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200/70">
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
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10.5px] font-medium text-[#1C3F60] ring-1 ring-slate-200">
                  <FileText size={11} /> Polish handbook v2025 · p.14
                </span>
                <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-[#2E8A8A]">
                  <ShieldCheck size={12} /> Compliant · verified 2 days ago
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
        right={<span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">Synced</span>}
      />
      <div className="px-4 pb-1 pt-4">
        <div className="grid grid-cols-[92px_repeat(4,1fr)] gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          <span />
          {INV_COLS.map((col) => (
            <span key={col} className="text-center">{col}</span>
          ))}
        </div>
        <div className="mt-2 space-y-1.5">
          {INV_ROWS.map((row, r) => (
            <div key={row} className="grid grid-cols-[92px_repeat(4,1fr)] items-center gap-1.5">
              <span className="truncate text-[11.5px] font-medium">{row}</span>
              {INV_GRID[r].map((cell, c) => (
                <motion.div
                  key={c}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + (r * 4 + c) * 0.035, duration: 0.4, ease: EASE }}
                  className={`relative flex h-9 items-center justify-center rounded-lg text-[10px] font-bold ${
                    cell === 'ok'
                      ? 'bg-[#A0E8AF]/40 text-[#2E8A8A]'
                      : cell === 'overlap'
                      ? 'bg-[#FFC857]/40 text-[#8A5A00]'
                      : 'bg-rose-100 text-rose-600'
                  }`}
                >
                  {cell === 'ok' ? <Check size={13} strokeWidth={3} /> : cell === 'overlap' ? '×2' : '—'}
                  {cell !== 'ok' && step >= 1 && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                      className={`absolute inset-0 rounded-lg ring-2 ${cell === 'overlap' ? 'ring-[#FFC857]' : 'ring-rose-400'}`}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 8 }}
        className="mx-4 mb-4 mt-3 flex items-start gap-2.5 rounded-xl bg-[#0A1128] p-3 text-[11.5px] leading-snug text-white/70"
      >
        <Sparkles size={14} className="mt-0.5 shrink-0 text-[#A0E8AF]" />
        <span>
          <b className="text-white">3 overlaps and 2 gaps flagged.</b> Singapore has two vendors covering medical — a consolidation opportunity.
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
    { label: 'Premium', w: 79, color: 'bg-[#1C3F60]' },
    { label: 'Admin', w: 7, color: 'bg-[#2E8A8A]' },
    { label: 'Hidden commission', w: 14, color: 'bg-[#FFC857]' },
  ];
  return (
    <AppCard>
      <CardHeader
        title="Broker_Agreement_Local.pdf"
        sub="Contract analysis · auto-translated"
        right={
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${step >= 1 ? 'bg-[#FFC857]/40 text-[#8A5A00]' : 'bg-slate-100 text-slate-400'}`}>
            {step >= 1 ? '1 flag' : 'Reading'}
          </span>
        }
      />
      <div className="space-y-2 px-5 py-4">
        {[92, 78].map((w, i) => (
          <motion.div
            key={i}
            initial={{ width: '0%' }}
            animate={{ width: `${w}%` }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.7, ease: EASE }}
            className="h-2 rounded-full bg-slate-100"
          />
        ))}
        <div className="relative rounded-lg px-2.5 py-2 text-[12px] leading-snug">
          <motion.span
            aria-hidden
            initial={{ width: '0%' }}
            animate={{ width: step >= 1 ? '100%' : '0%' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="absolute inset-y-0 left-0 rounded-lg bg-[#FFC857]/40"
          />
          <span className="relative">
            <b>7.3</b> The Insurer shall remit 14% of gross premium to the Broker as a service fee, not itemised on client invoices.
          </span>
        </div>
        {[84, 60].map((w, i) => (
          <motion.div
            key={i}
            initial={{ width: '0%' }}
            animate={{ width: `${w}%` }}
            transition={{ delay: 0.6 + i * 0.1, duration: 0.7, ease: EASE }}
            className="h-2 rounded-full bg-slate-100"
          />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 8 }}
        className="mx-5 flex items-center justify-between rounded-xl bg-[#0A1128] px-4 py-3 text-white"
      >
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#FFC857]">Undisclosed commission</div>
          <div className="text-[11px] text-white/50">Clause 7.3 · local broker contract</div>
        </div>
        <div className="text-xl font-semibold tabular-nums">
          ${amount.toFixed(1)}M<span className="text-xs font-normal text-white/50"> / yr</span>
        </div>
      </motion.div>
      <div className="px-5 pb-5 pt-4">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">True cost of the programme</div>
        <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-full">
          {parts.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ width: '0%' }}
              animate={{ width: `${p.w}%` }}
              transition={{ delay: 0.8 + i * 0.15, duration: 0.9, ease: EASE }}
              className={p.color}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10.5px] text-slate-500">
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
    { label: 'Incumbent broker', val: 'Baseline', w: 100, color: 'bg-slate-300' },
    { label: 'Cuido benchmark', val: '−26% cost', w: 74, color: 'bg-[#2E8A8A]' },
  ];
  return (
    <AppCard>
      <CardHeader
        title="Renewal · Group Life"
        sub="Singapore · renews in 90 days"
        right={<span className="shrink-0 rounded-full bg-[#A0E8AF]/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1C3F60]">Auto-started</span>}
      />
      <div className="px-5 pt-5">
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '55%' }}
            transition={{ delay: 0.5, duration: 1.4, ease: EASE }}
            className="h-full rounded-full bg-gradient-to-r from-[#2E8A8A] to-[#A0E8AF]"
          />
        </div>
        <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          <span className="text-[#2E8A8A]">Day 90 · Benchmark</span>
          <span>Day 45 · Negotiate</span>
          <span>Day 0 · Renew</span>
        </div>
        <div className="mt-5 space-y-3">
          {quotes.map((q, i) => (
            <div key={q.label}>
              <div className="mb-1 flex justify-between text-[11px]">
                <span className="font-medium text-slate-500">{q.label}</span>
                <span className="font-semibold">{q.val}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
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
        className="mx-5 my-5 flex items-center gap-3 rounded-xl bg-[#0A1128] p-3.5 text-white"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#A0E8AF] text-[#0A1128]">
          <Zap size={16} />
        </div>
        <div>
          <div className="text-[13px] font-semibold leading-tight">$200k/yr redirected to new benefits</div>
          <div className="mt-0.5 text-[11px] text-white/50">Approved · Friday 16:15</div>
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
    accent: '#A0E8AF',
    scene:
      'radial-gradient(120% 90% at 85% 10%, rgba(46,138,138,0.55), transparent 55%), radial-gradient(90% 80% at 0% 100%, rgba(28,63,96,0.9), transparent 60%), linear-gradient(160deg,#0A1128 0%,#050505 100%)',
    Card: IngestCard,
  },
  {
    id: 'ask',
    tab: 'Ask Cuido',
    eyebrow: 'Tuesday · 11:20',
    title: 'A last-minute question. Answered in seconds.',
    body: 'Warsaw needs the maternity policy before a noon call. Proya asks Cuido in plain English and gets the answer translated, compared to local law, with the source document attached.',
    stat: { value: '6 sec', label: 'from question to cited answer' },
    accent: '#7FD8CF',
    scene:
      'radial-gradient(100% 90% at 80% 20%, rgba(127,216,207,0.28), transparent 55%), radial-gradient(90% 90% at 10% 90%, rgba(46,138,138,0.5), transparent 60%), linear-gradient(160deg,#0B1B2B 0%,#050505 100%)',
    Card: AskCard,
  },
  {
    id: 'inventory',
    tab: 'Inventory',
    eyebrow: 'Wednesday · 14:40',
    title: 'Every benefit. Every country. One clear picture.',
    body: "For the first time Proya can see what's actually offered, where programs overlap, and where employees aren't covered at all. No more spreadsheets stitched together by hand.",
    stat: { value: '100%', label: 'of benefits inventoried, country by country' },
    accent: '#D2F898',
    scene:
      'radial-gradient(100% 90% at 85% 15%, rgba(210,248,152,0.20), transparent 55%), radial-gradient(90% 90% at 0% 100%, rgba(28,63,96,0.85), transparent 60%), linear-gradient(160deg,#0A1128 0%,#050505 100%)',
    Card: InventoryCard,
  },
  {
    id: 'cost',
    tab: 'True cost',
    eyebrow: 'Thursday · 10:05',
    title: 'Hidden commissions have nowhere to hide.',
    body: 'Cuido reads a local broker contract and surfaces a commission that never appeared on the invoice, with the exact clause that proves it. Proya finally sees the true cost of a benefit.',
    stat: { value: '$1M/yr', label: 'undisclosed commission found in one local contract' },
    accent: '#FFC857',
    scene:
      'radial-gradient(90% 90% at 80% 15%, rgba(255,200,87,0.28), transparent 55%), radial-gradient(90% 90% at 5% 100%, rgba(28,63,96,0.85), transparent 60%), linear-gradient(160deg,#120F0A 0%,#050505 100%)',
    Card: CostCard,
  },
  {
    id: 'vendors',
    tab: 'Vendors',
    eyebrow: 'Friday · 16:15',
    title: 'She walks into the room leading, not chasing.',
    body: 'Ninety days before every renewal, Cuido benchmarks the market. Proya negotiates from evidence, brings brokerage costs down, and redirects the savings to benefits her people actually want.',
    stat: { value: '$1.1M/yr', label: 'brokerage cost reduced across 20 countries' },
    accent: '#A0E8AF',
    scene:
      'radial-gradient(100% 100% at 85% 0%, rgba(160,232,175,0.32), transparent 55%), radial-gradient(100% 90% at 0% 100%, rgba(46,138,138,0.55), transparent 60%), linear-gradient(160deg,#0A1128 0%,#050505 100%)',
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
    <section id="story" className="relative bg-[#050505] py-28 md:py-36">
      <style>{`@keyframes proya-progress { from { width: 0% } to { width: 100% } }`}</style>

      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-14 max-w-4xl md:mb-20">
          <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#A0E8AF]">
            <span className="h-px w-8 bg-[#A0E8AF]/60" />
            How Origin works
          </div>
          <h2 className="text-5xl font-semibold leading-[1.02] tracking-tighter text-white md:text-7xl">
            Meet Proya.
            <br />
            <span className="text-white/40">Here's her week with Origin.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-white/50 md:text-xl">
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
          className="group relative h-[960px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#050505] shadow-[0_40px_120px_-40px_rgba(46,138,138,0.35)] outline-none focus-visible:ring-2 focus-visible:ring-[#A0E8AF]/60 sm:h-[900px] lg:h-[540px]"
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
              <motion.div
                className="absolute -right-20 -top-24 h-[420px] w-[420px] rounded-full blur-[110px]"
                style={{ background: chapter.accent, opacity: 0.2 }}
                animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Dot grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              maskImage: 'linear-gradient(to right, transparent 10%, black 80%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 10%, black 80%)',
            }}
          />

          {/* Mouse spotlight */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                'radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.07), transparent 45%)',
            }}
          />

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
                className="absolute inset-0 flex flex-col justify-center gap-8 p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-12 xl:px-16"
              >
                <span className="pointer-events-none absolute -bottom-12 left-6 select-none text-[240px] font-bold leading-none tracking-tighter text-white/[0.03]">
                  0{index + 1}
                </span>

                {/* Copy */}
                <div className="relative z-10 max-w-[480px] lg:max-w-[420px] xl:max-w-[480px]">
                  <Rise>
                    <div
                      className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em]"
                      style={{ color: chapter.accent }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: chapter.accent, boxShadow: `0 0 12px ${chapter.accent}` }}
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
                    <p className="mt-5 text-[15px] leading-relaxed text-white/65 lg:text-[16px] xl:text-[17px]">
                      {chapter.body}
                    </p>
                  </Rise>
                  <Rise d={0.24} className="mt-8 flex items-center gap-5 border-t border-white/10 pt-6">
                    <span className="text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: chapter.accent }}>
                      {chapter.stat.value}
                    </span>
                    <span className="max-w-[190px] text-[11px] font-medium uppercase leading-snug tracking-widest text-white/40">
                      {chapter.stat.label}
                    </span>
                  </Rise>
                </div>

                {/* Product card */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10 w-full max-w-[400px] lg:max-w-[380px] lg:shrink-0 xl:max-w-[400px]"
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
              className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition-colors hover:bg-white/10 hover:text-white sm:flex"
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
                        ? 'border-white/20 bg-white/10 pl-1.5 pr-5 text-white'
                        : 'border-white/10 bg-white/[0.03] p-1.5 text-white/50 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <motion.span
                      layout="position"
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        active ? 'bg-[#A0E8AF] text-[#050505]' : ''
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
                        className="absolute bottom-0 left-0 h-[2px] bg-[#A0E8AF]"
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
              className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition-colors hover:bg-white/10 hover:text-white sm:flex"
            >
              <ArrowRight size={16} />
            </button>
          </div>
          <p className="text-sm text-white/30">Cuido is Spanish for “I take care.”</p>
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

          <div className="rounded-[2rem] border border-white/10 bg-[#050505] p-2 shadow-2xl">
            <div className="flex flex-col gap-6 rounded-[1.8rem] border border-white/5 bg-[#111] p-6 lg:p-8">
              
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A0E8AF] text-[#050505]">
                  <Sparkles size="{20}"/>
                </div>
                <div>
                  <div className="font-bold text-white">Cuido™ Assistant</div>
                  <div className="text-xs text-[#A0E8AF]">Online • Context: Global Benefits</div>
                </div>
              </div>

              {/* Chat Area */}
              <div className="min-h-[300px] space-y-6 text-sm">
                
                <AnimatePresence>
                  {step >= 1 && (
                    <motion.div 
                    key="user-msg" initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#1C3F60] p-4 text-white"
                    >
                      "What is our exact parental leave policy in Poland, and how does it compare to the local statutory requirement?"
                    </motion.div>
                  )}
                  
                  {step >= 2 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      key="ai-msg" className="max-w-[90%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 p-4 text-white"
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
                          <div className="rounded-lg bg-[#2E8A8A]/20 p-3 text-xs text-[#A0E8AF]">
                            <ShieldCheck className="inline mr-1" size="{14}"/> Fully compliant. Last verified: 2 days ago.
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
  company: string; // Added for enterprise logo feel
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Rob Hamer',
    role: 'Global Benefits Lead',
    initials: 'RH',
    quote: '…already identified around £150-200,000 worth of savings.',
    context: 'On what Origin uncovered across a large Singapore operation.',
    company: 'SIGMA CONNECTED'
  },
  {
    name: 'Amy Manning',
    role: 'Senior Director, Retirement Programs and International Benefits',
    initials: 'AM',
    quote: 'Time is money and Origin helps with speed.',
    context: 'On pairing strong technology with real benefits expertise.',
    company: 'BRITISH AIRWAYS'
  },
  {
    name: 'Angela Sim',
    role: 'Senior Director of Global Benefits',
    initials: 'AS',
    quote: 'We have over 520 policies around the world…',
    context: 'On keeping leave policies current as local laws change, and reading them all in English.',
    company: 'HALFORDS'
  },
  {
    name: 'Carolina Vertel',
    role: 'Benefits Leader US and LATAM',
    initials: 'CV',
    quote: '…urgent questions about how we operate in different countries.',
    context: 'On why one global view of benefits matters.',
    company: 'PLEO'
  },
  {
    name: 'Katie Archer',
    role: 'Global Benefits Lead',
    initials: 'KA',
    quote: '…empowered to shift from being reactive … to being proactive and more strategic.',
    context: 'On moving from gathering information to shaping what employees are offered.',
    company: 'WPP'
  },
];


type StatTone = 'light' | 'teal' | 'amber';

const STAT_STYLES: Record<StatTone, { card: string; num: string; label: string }> = {
  light: {
    card: 'bg-white border border-slate-200 shadow-sm',
    num: 'text-[#0A1128]',
    label: 'text-slate-500',
  },
  teal: {
    card: 'bg-[#F8FCFB] border border-[#D6EBDD] shadow-sm',
    num: 'text-[#2E8A8A]',
    label: 'text-slate-500',
  },
  amber: {
    card: 'bg-[#FFFDF8] border border-[#F6E3B0] shadow-sm',
    num: 'text-[#0A1128]',
    label: 'text-slate-500',
  },
};

function StatCard({
  i,
  tone,
  to,
  decimals = 0,
  suffix,
  label,
  children,
}: {
  i: number;
  tone: StatTone;
  to: number;
  decimals?: number;
  suffix: string;
  label: string;
  children: ReactNode;
}) {
  const s = STAT_STYLES[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
      className={`relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-2xl p-8 ${s.card}`}
    >
      <div className="h-24">{children}</div>
      <div>
        <div className={`text-5xl font-semibold tracking-tight xl:text-6xl ${s.num}`}>
          <AnimatedCounter prefix="$" to={to} decimals={decimals} suffix={suffix} duration={1.5} />
          <span className="ml-1 text-xl font-medium text-slate-400">/yr</span>
        </div>
        <p className={`mt-4 max-w-[270px] text-[15px] leading-relaxed ${s.label}`}>{label}</p>
      </div>
    </motion.div>
  );
}


const BAR_H = [28, 40, 34, 56, 72, 92];


function Avatar({ initials, active = true, big = false }: { initials: string; active?: boolean; big?: boolean }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${
        big ? 'h-14 w-14 text-lg' : 'h-12 w-12 text-sm'
      } ${active ? 'bg-[#0A1128] text-[#A0E8AF]' : 'bg-slate-100 text-slate-400'}`}
    >
      {initials}
    </div>
  );
}

function TestimonialShowcase() {
  const [active, setActive] = useState(0);
  const t = TESTIMONIALS[active];

  return (
    <div className="mt-20 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      {/* Featured Quote - Left Side */}
      <div className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
        <div>
          <div className="mb-8 text-sm font-bold tracking-widest text-slate-400 uppercase">
            {t.company}
          </div>
          <p className="text-2xl font-medium leading-snug tracking-tight text-[#0A1128] md:text-3xl lg:text-[32px]">
            “{t.quote}”
          </p>
          <p className="mt-6 max-w-md text-base leading-relaxed text-slate-500">{t.context}</p>
        </div>
        
        <div className="mt-12 flex items-center gap-4 border-t border-slate-100 pt-8">
          <Avatar initials={t.initials} big />
          <div>
            <div className="font-semibold text-[#0A1128]">{t.name}</div>
            <div className="text-sm text-slate-500">{t.role}</div>
          </div>
        </div>
      </div>

      {/* People Picker - Right Side */}
      <div className="flex flex-col gap-2">
        {TESTIMONIALS.map((p, i) => {
          const on = i === active;
          return (
            <button
              key={p.name}
              type="button"
              onClick={() => setActive(i)}
              className={`flex items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all duration-200 ${
                on
                  ? 'border-[#0A1128] bg-[#0A1128] shadow-md'
                  : 'border-transparent bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <Avatar initials={p.initials} active={on} />
              <div className="min-w-0">
                <div className={`text-[15px] font-semibold ${on ? 'text-white' : 'text-[#0A1128]'}`}>
                  {p.name}
                </div>
                <div className={`truncate text-[13px] ${on ? 'text-white/60' : 'text-slate-500'}`}>
                  {p.role}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ImpactSection() {
  return (
    <section id="impact" className="relative bg-white py-28 md:py-36">
      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#2E8A8A]">
            <span className="h-px w-8 bg-[#2E8A8A]/30" />
            Origin's impact
            <span className="h-px w-8 bg-[#2E8A8A]/30" />
          </div>
          <h2 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-[#0A1128] md:text-5xl lg:text-6xl">
            Real teams. <span className="text-[#2E8A8A]">Real savings.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-500 md:text-xl">
            Benefits leaders use Origin to find money hiding in plain sight, then put it back into their people.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          <StatCard i={0} tone="teal" to={200} suffix="k" label="saved and redirected to new benefits">
            <div className="flex h-24 items-end gap-2">
              {BAR_H.map((h, k) => (
                <motion.div
                  key={k}
                  initial={{ height: 0 }}
                  whileInView={{ height: h }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + k * 0.08, duration: 0.7, ease: EASE }}
                  className={`w-7 rounded-t-md ${
                    k === BAR_H.length - 1 ? 'bg-[#2E8A8A]' : 'bg-[#2E8A8A]/20'
                  }`}
                />
              ))}
            </div>
          </StatCard>

          <StatCard i={1} tone="light" to={1.1} decimals={1} suffix="M" label="brokerage cost reduced across 20 countries">
            <div className="grid h-24 grid-cols-[repeat(10,14px)] content-end gap-2">
              {Array.from({ length: 20 }).map((_, k) => (
                <motion.span
                  key={k}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + k * 0.04, duration: 0.35 }}
                  className={`h-3.5 w-3.5 rounded-full ${k % 3 === 0 ? 'bg-[#2E8A8A]' : 'bg-slate-200'}`}
                />
              ))}
            </div>
          </StatCard>

          <StatCard i={2} tone="amber" to={1} suffix="M" label="of undisclosed commission found in one local contract">
            <div className="flex h-24 flex-col justify-end gap-2.5">
              <div className="h-2 w-[85%] rounded-full bg-slate-100" />
              <div className="relative h-6 w-full">
                <motion.div
                  initial={{ width: '0%' }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.9, ease: EASE }}
                  className="absolute inset-y-0 left-0 rounded-md bg-[#FFC857]/40"
                />
                <div className="absolute inset-x-2 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#0A1128]/30" />
              </div>
              <div className="h-2 w-[65%] rounded-full bg-slate-100" />
            </div>
          </StatCard>
        </div>

        {/* Testimonials */}
        <TestimonialShowcase />

        {/* CTA */}
        <div className="mt-20 flex flex-col items-start justify-between gap-6 rounded-2xl border border-slate-200 bg-slate-50 px-8 py-10 md:flex-row md:items-center md:px-12">
          <div>
            <div className="text-2xl font-semibold tracking-tight text-[#0A1128]">See what Origin could find in your benefits.</div>
            <div className="mt-2 text-slate-500">Talk to the team about your own numbers.</div>
          </div>
          <button
            type="button"
            className="group inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-[#0A1128] px-7 font-semibold text-white transition-all hover:bg-[#1C3F60]"
          >
            Let's have a chat
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}





// ==========================================
// PLATFORM BENTO GRID
// ==========================================

function BentoGrid() {
  return (
    <section id="platform" className="bg-[#050505] py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Infrastructure for modern leaders.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-white/50">Everything required to govern, analyze, and optimize your global benefits footprint.</p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-3 md:grid-rows-2">
          {FEATURES.map((feature, i) => (
            <motion.div 
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group relative overflow-hidden rounded-[2rem] border border-white/10 ${feature.bg} ${feature.colSpan} p-8 transition-colors hover:border-white/20`}
            >
              <feature.icon className="h-8 w-8 text-[#A0E8AF]" />
              <h3 className="mt-16 text-2xl font-bold text-white">{feature.title}</h3>
              <p className="mt-4 text-white/60">{feature.desc}</p>
              
              {/* Decorative Background Elements based on item */}
              {i === 0 && (
                <div className="absolute -bottom-10 -right-10 opacity-20 transition-transform duration-700 group-hover:scale-110">
                  <Globe size="{240}" strokeWidth="{0.5}"/>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// C-SUITE ROI CALCULATOR
// ==========================================

function ROICalculator() {
  const [employees, setEmployees] = useState(5000);
  const averageBenefitCost = 15000; // Arbitrary enterprise avg
  const optimizationRate = 0.08; // 8% avg savings found by Origin
  
  const estimatedSavings = employees * averageBenefitCost * optimizationRate;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#050505] to-[#0A1128] py-32">
      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-[3rem] border border-[#2E8A8A]/30 bg-gradient-to-br from-[#1C3F60]/40 to-transparent p-10 text-center shadow-[0_0_80px_-20px_#1C3F60] backdrop-blur-xl md:p-20">
          <Lock className="mx-auto h-12 w-12 text-[#A0E8AF]"/>
          <h2 className="mt-6 text-3xl font-bold text-white md:text-5xl">Calculate your hidden leakage.</h2>
          <p className="mt-4 text-white/60">On average, global enterprises overpay by 8% due to fragmented data, hidden commissions, and overlapping coverage.</p>
          
          <div className="mt-16 space-y-8">
            <div className="flex items-center justify-between text-sm font-bold uppercase tracking-wider text-[#A0E8AF]">
              <span>Global Headcount</span>
              <span>{employees.toLocaleString()} Employees</span>
            </div>
            
            <input 
              type="range" 
              min="1000" 
              max="50000" 
              step="500"
              value={employees}
              onChange={(e) => setEmployees(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#A0E8AF]"
            />
            
            <div className="rounded-2xl bg-[#050505]/50 p-8 border border-white/5">
              <div className="text-sm font-medium text-white/50">Estimated Annual Optimization Potential</div>
              <div className="mt-2 text-5xl font-bold text-white md:text-7xl">
                $<AnimatedCounter to={estimatedSavings / 1000000} decimals={1} duration={1} from={0} suffix="M" />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
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
              <Globe className="text-[#A0E8AF]" size="{24}"/>
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
// MAIN APP EXPORT
// ==========================================

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#050505] font-sans selection:bg-[#A0E8AF] selection:text-[#050505]">
      <NoiseOverlay/>
      
      <main>
        <Hero/>
        <StorySection/>
        <ImpactSection/>
        <BentoGrid/>
        <ROICalculator/>
        <TrustSection/>
      </main>

      <Footer/>
    </div>
  );
}