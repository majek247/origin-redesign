import { useEffect, useState, type ReactNode } from 'react'
import { CountUp, useInView } from '../hooks'

function Chapter({ day, title, body, flip, children }: { day: string; title: string; body: string; flip?: boolean; children: ReactNode }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.25)
  return (
    <div ref={ref} className={`reveal ${seen ? 'in' : ''} grid items-center gap-12 py-20 md:grid-cols-2 md:gap-20`}>
      <div className={flip ? 'md:order-2' : ''}>
        <span className="font-hand text-3xl text-amber">{day}</span>
        <h3 className="mt-2 text-4xl font-bold leading-tight tracking-tight md:text-5xl">{title}</h3>
        <p className="mt-6 text-lg leading-relaxed text-white/70">{body}</p>
      </div>
      <div className="glass rounded-[2rem] p-6 shadow-2xl md:p-8">{seen && children}</div>
    </div>
  )
}

const Dots = () => <span className="flex gap-1 py-1">{[0, 1, 2].map((i) => <i key={i} style={{ animationDelay: `${i * 0.2}s` }} className="h-2 w-2 animate-dot rounded-full bg-mint" />)}</span>

function AskCuido() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const t = [setTimeout(() => setStep(1), 900), setTimeout(() => setStep(2), 2600)]
    return () => t.forEach(clearTimeout)
  }, [])
  return (
    <div className="space-y-4 text-[15px]">
      <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-blue p-4">Ask Cuido: what's our parental leave policy in Poland? Legal needs it in English, urgently.</div>
      {step >= 1 && (
        <div className="max-w-[92%] rounded-2xl rounded-bl-sm bg-white p-4 text-ink">
          <b className="text-teal">Cuido™</b>
          {step === 1 ? <Dots /> : <p className="mt-1">26 weeks paid at 100%, translated from the Polish policy on file (p.4). Renewed in March. Want the full summary for Legal?</p>}
        </div>
      )}
      {step >= 2 && <div className="rounded-xl bg-mint/15 px-4 py-2 text-sm text-mint">Answered in 4 seconds. Priya had planned her whole morning around this one.</div>}
    </div>
  )
}

function Commission() {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-widest text-white/50">Local contract review · 1 flag</p>
      <div className="mt-4 text-7xl font-bold text-mint md:text-8xl"><CountUp to={1} prefix="$" suffix="m" dec={1} /></div>
      <p className="mt-2 text-white/70">of undisclosed commission, found inside a single local contract.</p>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-4/5 animate-rise rounded-full bg-gradient-to-r from-mint to-lime" /></div>
    </div>
  )
}

function Renewal() {
  const items = ['Renewal window opens in 90 days', 'Compliance check across 20 countries', 'Vendor scorecards compared', 'Broker fees benchmarked', 'Approved and filed']
  const [n, setN] = useState(0)
  useEffect(() => { const i = setInterval(() => setN((x) => Math.min(x + 1, items.length)), 700); return () => clearInterval(i) }, [items.length])
  return (
    <ul className="space-y-3">
      {items.map((t, i) => (
        <li key={t} className={`flex items-center gap-4 rounded-xl p-4 transition-all duration-500 ${i < n ? 'bg-mint/15' : 'bg-white/5 opacity-50'}`}>
          <span className={`grid h-7 w-7 place-items-center rounded-full text-sm font-bold ${i < n ? 'bg-mint text-ink' : 'border border-white/30'}`}>{i < n ? '✓' : ''}</span>{t}
        </li>
      ))}
    </ul>
  )
}

export default function Story() {
  return (
    <section id="how" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-mint">A decades-old problem. Finally solvable.</p>
        <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">Priya's week, with the lights on.</h2>
      </div>
      <Chapter day="Monday, 9:02am" title="The urgent question that used to eat her morning." body="Last-minute questions land from every country. Policies live in PDFs, in six languages, across a dozen inboxes. With Cuido, she just asks." ><AskCuido /></Chapter>
      <Chapter flip day="Wednesday, 2:40pm" title="The number nobody could find." body="Every benefit, every cost, every vendor and country is structured into one source of truth, so overpayments and hidden fees finally have nowhere to hide."><Commission /></Chapter>
      <Chapter day="Friday, 4:15pm" title="Renewals that run themselves." body="Automated workflows handle renewals, compliance and vendor management with central oversight. Priya leaves on time, and plans ahead instead of chasing."><Renewal /></Chapter>
    </section>
  )
}
