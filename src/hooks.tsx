import { useEffect, useRef, useState } from 'react'

export function useInView<T extends HTMLElement>(threshold = 0.35) {
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

export function CountUp({ to, prefix = '', suffix = '', dec = 0 }: { to: number; prefix?: string; suffix?: string; dec?: number }) {
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
