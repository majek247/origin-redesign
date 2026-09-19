const links = [
  ['Platform', '#how'],
  ['Cuido', '#cuido'],
  ['Original thought', '#thought'],
  ['Our community', '#community'],
];

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 mx-auto w-[min(1280px,94%)] px-6">
      <div className="flex items-center justify-between rounded-full border border-white/10 bg-[#031a20] px-6 py-3.5">
        
        {/* Logo */}
        <a href="#top" className="flex items-center">
          <img
            src="https://originbenefits.com/hubfs/assets-s2/logo.svg"
            alt="Origin"
            className="h-7 w-auto brightness-0 invert opacity-90 transition-opacity duration-300 hover:opacity-100"
          />
        </a>

        {/* Nav Links */}
        <nav className="hidden items-center gap-9 md:flex">
          {links.map(([l, h]) => (
            <a
              key={l}
              href={h}
              className="text-[13.5px] font-normal tracking-[-0.01em] text-white/85 transition-colors duration-300 hover:text-white"
            >
              {l}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#contact"
          className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-5 py-2 text-[13.5px] font-normal tracking-[-0.01em] text-white/90 transition-all duration-300 hover:border-[#A0E8AF]/40 hover:bg-[#A0E8AF]/10 hover:text-white"
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