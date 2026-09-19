import { CountUp } from '../hooks'

const pillars = [
  ['Visibility', 'Every benefit, every cost, every vendor, every country. Structured into a single source of truth.'],
  ['Intelligence', "AI-powered insights: where you're overpaying, non-compliant, or missing savings. The more data, the smarter it gets."],
  ['Governance', 'Automated workflows for renewals, compliance and vendor management, with central oversight.'],
]

export function Pillars() {
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

export function Cuido() {
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

export function Impact() {
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

export function Voices() {
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

export function CTA() {
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
