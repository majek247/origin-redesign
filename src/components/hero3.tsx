import { useEffect, useRef, useState, type ReactNode } from 'react'


function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, seen] as const
}

function CountUp({ to, prefix = '', suffix = '', dec = 0 }: { to: number; prefix?: string; suffix?: string; dec?: number }) {
  const [ref, seen] = useInView<HTMLSpanElement>()
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!seen) return
    const t0 = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min((t - t0) / 1600, 1)
      setV(to * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, to])
  return <span ref={ref}>{prefix}{v.toFixed(dec)}{suffix}</span>
}

const links = [['Platform', '#how'], ['Cuido', '#cuido'], ['Original thought', '#thought'], ['Our community', '#community']]

function Nav() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 mx-auto flex w-[min(1180px,94%)] items-center justify-between rounded-full glass px-7 py-3.5">
      <a href="#top" className="text-3xl font-medium lowercase tracking-tight text-mint">origin</a>
      <nav className="hidden gap-9 text-[15px] font-bold md:flex">
        {links.map(([l, h]) => <a key={l} href={h} className="transition hover:text-mint">{l}</a>)}
      </nav>
      <a href="#contact" className="group flex items-center gap-2 font-bold text-mint">
        Contact us <span className="text-amber transition group-hover:translate-x-1">→</span>
      </a>
    </header>
  )
}


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

function Story() {
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


const pillars = [
  ['Visibility', 'Every benefit, every cost, every vendor, every country. Structured into a single source of truth.'],
  ['Intelligence', "AI-powered insights: where you're overpaying, non-compliant, or missing savings. The more data, the smarter it gets."],
  ['Governance', 'Automated workflows for renewals, compliance and vendor management, with central oversight.'],
]

function Pillars() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">Benefits teams deserve the infrastructure to lead.</h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {pillars.map(([t, d], i) => (
          <div key={t} className="glass group rounded-3xl p-8 transition duration-500 hover:-translate-y-2 hover:border-mint/50">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint font-bold text-ink">0{i + 1}</span>
            <h3 className="mt-6 text-2xl font-bold">{t}</h3>
            <p className="mt-3 text-white/70">{d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Cuido() {
  const tags = ['Accurate benefits inventory', 'True costs, fees and commissions', 'Smarter vendor procurement', 'Ask Cuido, anything, in any language']
  return (
    <section id="cuido" className="relative overflow-hidden bg-gradient-to-br from-teal/30 via-navy to-ink px-6 py-28">
      <div className="mx-auto max-w-5xl text-center">
        <p className="font-hand text-3xl text-amber">"Cuido" is Spanish for "I take care."</p>
        <h2 className="mt-4 text-5xl font-bold tracking-tight md:text-7xl">At the heart of Origin is <span className="text-mint">Cuido™</span></h2>
        <p className="mx-auto mt-8 max-w-2xl text-lg text-white/70">The world's first Artificial Benefits Intelligence. It ingests, translates and organizes decentralized data from across your ecosystem into one authoritative source.</p>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {tags.map((t) => <span key={t} className="glass rounded-full px-5 py-3 text-sm font-bold">{t}</span>)}
        </div>
      </div>
    </section>
  )
}

function Impact() {
  const stats = [[200, '$', 'k/yr', 'saved and redirected to new benefits'], [1.1, '$', 'm/yr', 'brokerage cost reduced across 20 countries'], [1, '$', 'm/yr', 'of undisclosed commission identified']] as const
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="text-center text-4xl font-bold tracking-tight md:text-5xl">Origin's impact</h2>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {stats.map(([n, p, s, d]) => (
          <div key={d} className="rounded-3xl bg-mint p-8 text-ink">
            <div className="text-6xl font-bold"><CountUp to={n} prefix={p} suffix={s} dec={n % 1 ? 1 : 0} /></div>
            <p className="mt-3 font-bold">{d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const voices = [
  ['We identified around £150-200,000 worth of savings in Singapore alone.', 'Rob Hamer', 'Global Benefits Lead'],
  ["The team is excited to shift from reactive to proactive, and more strategic.", 'Katie Archer', 'Global Benefits Lead'],
  ['Strong technology, with an intense knowledge of how benefit structures work.', 'Amy Manning', 'Sr Director, Retirement & Intl Benefits'],
]

function Voices() {
  return (
    <section id="community" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-4xl font-bold tracking-tight md:text-5xl">When you join us, you join a community.</h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {voices.map(([q, n, r], i) => (
          <figure key={n} style={{ ['--r' as string]: `${i * 2 - 2}deg` }} className="rounded-3xl bg-white p-7 text-ink shadow-2xl transition hover:-translate-y-2">
            <blockquote className="text-lg font-medium leading-snug">“{q}”</blockquote>
            <figcaption className="mt-6 text-sm"><b>{n}</b><br />{r}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section id="contact" className="px-6 py-28 text-center">
      <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-gradient-to-br from-mint to-lime p-14 text-ink">
        <h2 className="text-4xl font-bold tracking-tight md:text-6xl">Ready to write your own chapter?</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg">Put the power of AI in your hands. Get in touch and see Origin on your own benefits data.</p>
        <a href="mailto:hello@originbenefits.com" className="mt-8 inline-block rounded-full bg-ink px-9 py-4 font-bold text-mint transition hover:scale-105">Keep in touch →</a>
      </div>
      <p className="mt-16 text-sm text-white/40">Speculative redesign concept. Not affiliated with Origin Benefits Ltd.</p>
    </section>
  )
}

const notes = [
  { t: 'Which broker covers Brazil??', c: 'bg-amber text-ink', p: 'left-[4%] top-[26%]', r: '-8deg' },
  { t: 'Poland parental leave (PDF, in Polish)', c: 'bg-lime text-ink', p: 'right-[5%] top-[24%]', r: '6deg' },
  { t: 'Renewal deadline… was it Friday?', c: 'bg-mint text-ink', p: 'left-[8%] bottom-[16%]', r: '5deg' },
  { t: 'Who signed off this commission?', c: 'bg-white text-ink', p: 'right-[7%] bottom-[20%]', r: '-6deg' },
]

function HeroSection() {
  return (
    <section id="top" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-blue via-navy to-ink px-6 pt-32 pb-24 text-center">
      <div className="absolute -right-40 top-10 h-[620px] w-[620px] rounded-full bg-teal/40 blur-3xl" />
      <div className="absolute -left-52 top-1/3 h-[520px] w-[520px] rounded-full border border-mint/30" />
      {notes.map((n) => (
        <div key={n.t} style={{ ['--r' as string]: n.r }} className={`absolute hidden max-w-[190px] animate-float rounded-md p-4 font-hand text-2xl leading-tight shadow-2xl lg:block ${n.c} ${n.p}`}>
          {n.t}
        </div>
      ))}
      <div className="relative max-w-4xl">
        <p className="animate-rise text-sm font-bold uppercase tracking-[0.25em] text-mint">A story about benefits</p>
        <h1 className="mt-6 animate-rise text-5xl font-bold leading-[1.02] tracking-tight [animation-delay:.1s] md:text-8xl">
          Meet Priya.<br /><span className="text-mint">43 countries.</span><br />One very long Monday.
        </h1>
        <p className="mx-auto mt-8 max-w-2xl animate-rise text-lg text-white/75 [animation-delay:.2s] md:text-xl">
          Benefits are your second-biggest people cost, and most teams are running them in the dark. Follow Priya through one week with Origin™, the world's first Enterprise Benefits Intelligence platform.
        </p>
        <div className="mt-10 flex animate-rise flex-wrap justify-center gap-4 [animation-delay:.3s]">
          <a href="#how" className="rounded-full bg-mint px-8 py-4 font-bold text-ink transition hover:scale-105 hover:shadow-[0_0_50px_-5px] hover:shadow-mint">Meet your benefits team's new best friend ↗</a>
          <a href="#contact" className="rounded-full border border-amber px-8 py-4 font-bold text-mint transition hover:bg-amber/10">Let's have a chat! ↗</a>
        </div>
      </div>
    </section>
  )
}

export default function Hero() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <Story />
        <Pillars />
        <Cuido />
        <Impact />
        <Voices />
        <CTA />
      </main>
    </>
  )
}