import { useState, useEffect } from 'react';

const links = [
  ['Platform', '#story'],
  ['Evidence', '#impact'],
  ['Community', '#community'],
  ['Security', '#security'],
  ['FAQ', '#faq'],
];

function ChevronDown({ className = '' }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronRight({ className = '' }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default function Nav() {
  const [active, setActive] = useState<string>('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sections = links
      .map(([, href]) => document.querySelector(href))
      .filter(Boolean) as Element[];

    const onScroll = () => {
      const y = window.scrollY + 140;
      let current = '';
      for (const el of sections) {
        if (el.getBoundingClientRect().top + window.scrollY <= y) {
          current = `#${el.id}`;
        }
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-4 z-50 mx-auto w-[min(1280px,94%)] px-4 sm:px-6">
      <div className="rounded-3xl border border-white/10 bg-[#031a20] md:rounded-full">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3.5 md:px-6">
          {/* Logo */}
          <a href="#top" className="flex items-center" onClick={() => setOpen(false)}>
            <img
              src="https://originbenefits.com/hubfs/assets-s2/logo.svg"
              alt="Origin"
              className="h-7 w-auto brightness-0 invert opacity-90 transition-opacity duration-300 hover:opacity-100"
            />
          </a>

          {/* Desktop links */}
          <nav className="hidden items-center gap-9 md:flex">
            {links.map(([label, href]) => {
              const isActive = active === href;
              return (
                <a
                  key={label}
                  href={href}
                  className="text-[13.5px] font-normal tracking-[-0.01em] transition-colors duration-300"
                  style={{ color: isActive ? '#22a9b2' : 'rgba(255,255,255,0.85)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#22a9b2')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = isActive ? '#22a9b2' : 'rgba(255,255,255,0.85)')
                  }
                >
                  {label}
                </a>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <a
            href="#contact"
            className="group hidden items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-5 py-2 text-[13.5px] font-normal tracking-[-0.01em] text-white/90 transition-all duration-300 hover:border-[#22a9b2]/40 hover:bg-[#22a9b2]/10 hover:text-white md:flex"
          >
            Contact us
            <span className="text-[#22a9b2] transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </a>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-white transition-colors hover:bg-white/10 md:hidden"
          >
            <ChevronDown
              className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out md:hidden ${
            open ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col border-t border-white/10 px-3 py-3">
            {links.map(([label, href]) => {
              const isActive = active === href;
              return (
                <a
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between rounded-2xl px-4 py-3.5 text-[15px] font-medium transition-colors duration-200 hover:bg-white/[0.06]"
                  style={{ color: isActive ? '#22a9b2' : 'rgba(255,255,255,0.9)' }}
                >
                  <span className="flex items-center gap-3">
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#22a9b2]" />}
                    {label}
                  </span>
                  <ChevronRight
                    className="opacity-40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </a>
              );
            })}

            {/* Mobile CTA */}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-between rounded-2xl bg-[#22a9b2]/10 px-4 py-3.5 text-[15px] font-semibold text-[#22a9b2] transition-colors hover:bg-[#22a9b2]/15"
            >
              Contact us
              <ChevronRight />
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}