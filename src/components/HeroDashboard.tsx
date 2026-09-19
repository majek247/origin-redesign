// src/components/HeroDashboard.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Sparkles, ArrowUpRight, ArrowDownRight,
  TrendingUp, ShieldCheck, Users, Building2,
  MoreHorizontal, Filter, Download, AlertTriangle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

// ---------- DATA ----------

const spendTrend = [
  { m: 'Jan', spend: 1.8, bench: 2.1 },
  { m: 'Feb', spend: 1.85, bench: 2.1 },
  { m: 'Mar', spend: 1.92, bench: 2.15 },
  { m: 'Apr', spend: 1.88, bench: 2.2 },
  { m: 'May', spend: 1.95, bench: 2.25 },
  { m: 'Jun', spend: 2.02, bench: 2.3 },
  { m: 'Jul', spend: 1.98, bench: 2.35 },
  { m: 'Aug', spend: 2.08, bench: 2.4 },
  { m: 'Sep', spend: 2.15, bench: 2.45 },
  { m: 'Oct', spend: 2.12, bench: 2.5 },
  { m: 'Nov', spend: 2.18, bench: 2.55 },
  { m: 'Dec', spend: 2.24, bench: 2.6 },
];

const categoryMix = [
  { name: 'Health', value: 42, color: '#A0E8AF' },
  { name: 'Retirement', value: 24, color: '#2E8A8A' },
  { name: 'Life & Disability', value: 16, color: '#1C3F60' },
  { name: 'Wellbeing', value: 10, color: '#FFC857' },
  { name: 'Other', value: 8, color: '#4A5568' },
];

const countrySpend = [
  { country: 'USA', spend: 8.2 },
  { country: 'UK', spend: 4.1 },
  { country: 'DE', spend: 3.4 },
  { country: 'SG', spend: 2.8 },
  { country: 'BR', spend: 2.1 },
  { country: 'PL', spend: 1.6 },
];

const insights = [
  { tone: 'warn', text: 'Overlap detected · Singapore', detail: 'Two vendors cover medical.' },
  { tone: 'danger', text: 'Compliance risk · Brazil', detail: 'New statutory leave policy.' },
  { tone: 'info', text: 'Renewal window · Germany', detail: 'Group Life renews in 90 days.' },
];

// ---------- CHART TOOLTIP ----------

const ChartTooltip = ({ active, payload, label, unit = 'M' }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#0A1128]/95 px-3 py-2 shadow-xl backdrop-blur-md">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-white/50">{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-[12px] text-white">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-white/60 capitalize">{p.name}:</span>
          <span className="font-semibold">
            ${p.value}{unit}
          </span>
        </div>
      ))}
    </div>
  );
};

// ---------- KPI CARD ----------

const Kpi = ({
  label, value, change, up, icon: Icon, delay,
}: {
  label: string; value: string; change: string; up: boolean;
  icon: any; delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="relative overflow-hidden rounded-lg border border-white/5 bg-white/[0.02] p-3"
  >
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-medium uppercase tracking-wider text-white/40">{label}</span>
      <Icon size={12} className="text-white/30" />
    </div>
    <div className="mt-2 text-[17px] font-semibold tabular-nums leading-none text-white">{value}</div>
    <div className={`mt-1.5 flex items-center gap-0.5 text-[10px] font-medium ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
      {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
      {change}
      <span className="ml-1 text-white/30">vs last yr</span>
    </div>
  </motion.div>
);

// ---------- MAIN DASHBOARD ----------

const TABS = ['Overview', 'Spend', 'Compliance'] as const;
type Tab = (typeof TABS)[number];

export default function HeroDashboard() {
  const [tab, setTab] = useState<Tab>('Overview');

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0A1128]/80 shadow-[0_0_80px_-20px_rgba(46,138,138,0.45)] backdrop-blur-2xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#A0E8AF] to-[#2E8A8A]">
            <Globe size={14} className="text-[#050505]" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-[12.5px] font-semibold leading-tight text-white">Origin Command Center</div>
            <div className="text-[10px] leading-tight text-white/40">Global Benefits · FY 2025</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="hidden h-7 w-7 items-center justify-center rounded-md border border-white/10 text-white/50 transition-colors hover:bg-white/5 hover:text-white sm:flex">
            <Filter size={12} />
          </button>
          <button className="hidden h-7 w-7 items-center justify-center rounded-md border border-white/10 text-white/50 transition-colors hover:bg-white/5 hover:text-white sm:flex">
            <Download size={12} />
          </button>
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9.5px] font-semibold uppercase tracking-wider text-emerald-300">Live</span>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#A0E8AF] to-[#2E8A8A] text-[10px] font-bold text-[#050505] ring-2 ring-white/10">
            PS
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0.5 border-b border-white/5 px-5 pt-2.5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative px-3 pb-2.5 text-[11.5px] font-medium transition-colors ${
              tab === t ? 'text-white' : 'text-white/40 hover:text-white/70'
            }`}
          >
            {t}
            {tab === t && (
              <motion.div
                layoutId="hero-dash-tab"
                className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-[#A0E8AF]"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
        <button className="ml-auto mb-2 flex h-6 w-6 items-center justify-center text-white/30 hover:text-white/70">
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* Body */}
      <div className="p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            {tab === 'Overview' && <OverviewTab />}
            {tab === 'Spend' && <SpendTab />}
            {tab === 'Compliance' && <ComplianceTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom status */}
      <div className="flex items-center justify-between border-t border-white/5 px-5 py-2.5">
        <div className="flex items-center gap-2 text-[10px] text-white/40">
          <ShieldCheck size={11} className="text-[#A0E8AF]" />
          SOC2 · ISO 27001 · GDPR
        </div>
        <div className="text-[10px] text-white/30">Updated 2 min ago</div>
      </div>
    </div>
  );
}

// ---------- TAB 1: OVERVIEW ----------

function OverviewTab() {
  return (
    <>
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi label="Total Spend" value="$24.3M" change="+2.1%" up icon={TrendingUp} delay={0} />
        <Kpi label="Countries" value="104" change="+12" up icon={Globe} delay={0.05} />
        <Kpi label="Vendors" value="287" change="-3" up={false} icon={Building2} delay={0.1} />
        <Kpi label="Employees" value="11.5k" change="+4.2%" up icon={Users} delay={0.15} />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        {/* Spend Trend */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 lg:col-span-3">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                Spend vs Benchmark
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-lg font-semibold tabular-nums text-white">$2.24M</span>
                <span className="text-[10px] font-medium text-emerald-400">−13.8% under market</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1.5 text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-[#A0E8AF]" /> You
              </span>
              <span className="flex items-center gap-1.5 text-white/40">
                <span className="h-1.5 w-1.5 rounded-full bg-white/30" /> Market
              </span>
            </div>
          </div>
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendTrend} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="gSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A0E8AF" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#A0E8AF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="m" axisLine={false} tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }}
                  interval={2}
                />
                <YAxis
                  axisLine={false} tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }}
                  tickFormatter={(v) => `$${v}M`}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                <Area
                  type="monotone" dataKey="bench" name="Market"
                  stroke="rgba(255,255,255,0.25)" strokeWidth={1.5}
                  strokeDasharray="3 3" fill="none"
                />
                <Area
                  type="monotone" dataKey="spend" name="Spend"
                  stroke="#A0E8AF" strokeWidth={2}
                  fill="url(#gSpend)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Mix */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 lg:col-span-2">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
            Category Mix
          </div>
          <div className="flex items-center gap-4">
            <div className="h-[110px] w-[110px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryMix} dataKey="value"
                    innerRadius={32} outerRadius={50}
                    paddingAngle={2} stroke="none"
                  >
                    {categoryMix.map((c, i) => (
                      <Cell key={i} fill={c.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip unit="%" />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1.5">
              {categoryMix.slice(0, 4).map((c) => (
                <div key={c.name} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c.color }} />
                    <span className="truncate text-white/60">{c.name}</span>
                  </div>
                  <span className="font-medium tabular-nums text-white/90">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#A0E8AF]">
            <Sparkles size={12} /> AI Insights
          </div>
          <button className="flex items-center gap-1 text-[10px] font-medium text-white/40 hover:text-white/80">
            View all <ArrowUpRight size={11} />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {insights.map((ins, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="flex items-start gap-2.5 rounded-lg border border-white/5 bg-white/[0.02] p-2.5"
            >
              <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                ins.tone === 'warn' ? 'bg-amber-400/15 text-amber-300' :
                ins.tone === 'danger' ? 'bg-rose-400/15 text-rose-300' :
                'bg-[#A0E8AF]/15 text-[#A0E8AF]'
              }`}>
                <AlertTriangle size={10} />
              </div>
              <div className="min-w-0">
                <div className="truncate text-[11px] font-medium text-white">{ins.text}</div>
                <div className="truncate text-[10px] text-white/40">{ins.detail}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

// ---------- TAB 2: SPEND ----------

function SpendTab() {
  return (
    <>
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">
        Spend by Country (USD, Millions)
      </div>
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={countrySpend} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="gBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A0E8AF" stopOpacity={1} />
                  <stop offset="100%" stopColor="#2E8A8A" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="country" axisLine={false} tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
              />
              <YAxis
                axisLine={false} tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }}
                tickFormatter={(v) => `$${v}M`}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="spend" name="Spend" fill="url(#gBar)" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="text-[10px] font-medium uppercase tracking-wider text-white/40">Top Market</div>
          <div className="mt-1.5 text-[15px] font-semibold text-white">United States</div>
          <div className="mt-1 text-[11px] text-white/50">$8.2M · 4,200 employees</div>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="text-[10px] font-medium uppercase tracking-wider text-white/40">Fastest Growth</div>
          <div className="mt-1.5 text-[15px] font-semibold text-[#A0E8AF]">Singapore</div>
          <div className="mt-1 text-[11px] text-white/50">+18% YoY · 950 employees</div>
        </div>
      </div>
    </>
  );
}

// ---------- TAB 3: COMPLIANCE ----------

function ComplianceTab() {
  const items = [
    { region: 'European Union', status: 'ok', score: 99, note: 'GDPR · IORP II' },
    { region: 'United States', status: 'ok', score: 98, note: 'ERISA · HIPAA · ACA' },
    { region: 'Brazil', status: 'warn', score: 82, note: 'New leave policy pending' },
    { region: 'Singapore', status: 'ok', score: 97, note: 'CPF · MOM' },
    { region: 'United Kingdom', status: 'ok', score: 99, note: 'Auto-enrolment' },
  ];
  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
          Regional Compliance
        </div>
        <span className="rounded-full border border-[#A0E8AF]/20 bg-[#A0E8AF]/10 px-2 py-0.5 text-[10px] font-semibold text-[#A0E8AF]">
          98.2% overall
        </span>
      </div>
      <div className="space-y-1.5">
        {items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5"
          >
            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
              it.status === 'ok'
                ? 'bg-emerald-400/15 text-emerald-300'
                : 'bg-amber-400/15 text-amber-300'
            }`}>
              <ShieldCheck size={12} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] font-medium text-white">{it.region}</div>
              <div className="truncate text-[10.5px] text-white/40">{it.note}</div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="hidden h-1 w-24 overflow-hidden rounded-full bg-white/5 sm:block">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${it.score}%` }}
                  transition={{ delay: 0.2 + i * 0.06, duration: 0.6 }}
                  className={`h-full rounded-full ${
                    it.status === 'ok' ? 'bg-[#A0E8AF]' : 'bg-amber-400'
                  }`}
                />
              </div>
              <span className="w-8 text-right text-[12px] font-semibold tabular-nums text-white">
                {it.score}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}