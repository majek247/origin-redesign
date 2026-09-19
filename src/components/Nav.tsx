const links = [['Platform', '#how'], ['Cuido', '#cuido'], ['Original thought', '#thought'], ['Our community', '#community']]

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 mx-auto flex w-[min(1552px,94%)] items-center justify-between rounded-full nav-glass px-7 py-3.5">
      <a href="#top" className="text-3xl font-medium lowercase tracking-tight text-mint">origin</a>
      <nav className="hidden gap-12 text-[15px] font-bold md:flex">
        {links.map(([l, h]) => <a key={l} href={h} className="transition hover:text-mint">{l}</a>)}
      </nav>
      <a href="#contact" className="group flex items-center gap-2 font-bold text-mint">
        Contact us <span className="text-amber transition group-hover:translate-x-1">→</span>
      </a>
    </header>
  )
}
