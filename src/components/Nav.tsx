const links = [
  ['Platform', '#how'],
  ['Cuido', '#cuido'],
  ['Original thought', '#thought'],
  ['Our community', '#community'],
];

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 mx-auto w-[min(1280px,94%)] px-6">
      <div className="flex items-center justify-between rounded-full border border-white/10 bg-[#02151d]/70 px-6 py-3 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <a
          href="#top"
          className="flex items-center gap-2 text-[22px] font-medium lowercase tracking-tight text-white"
        >
          <span className="h-2 w-2 rounded-full bg-[#A0E8AF]" />
          origin
        </a>

        <nav className="hidden items-center gap-10 text-[14px] font-medium text-white/70 md:flex">
          {links.map(([l, h]) => (
            <a
              key={l}
              href={h}
              className="relative transition-colors duration-300 hover:text-white"
            >
              {l}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-[14px] font-medium text-white transition-all duration-300 hover:border-[#A0E8AF]/40 hover:bg-[#A0E8AF]/10"
        >
          Contact us
          <span className="text-[#A0E8AF] transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </a>
      </div>
    </header>
  );
}