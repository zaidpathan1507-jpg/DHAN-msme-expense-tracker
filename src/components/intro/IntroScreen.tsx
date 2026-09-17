import { useEffect, useState } from 'react'
import { Logo } from '@/components/ui/Logo'

// Fixed (non-random) particle positions so server and client render identically.
const PARTICLES = [
  { top: '12%', left: '8%', size: 6, cls: 'animate-float-slow', delay: '0s' },
  { top: '22%', left: '88%', size: 5, cls: 'animate-float-slower', delay: '0.6s' },
  { top: '68%', left: '6%', size: 4, cls: 'animate-float-slower', delay: '1.1s' },
  { top: '78%', left: '92%', size: 6, cls: 'animate-float-slow', delay: '0.3s' },
  { top: '38%', left: '16%', size: 3, cls: 'animate-pulse-dot', delay: '0.9s' },
  { top: '15%', left: '48%', size: 3, cls: 'animate-pulse-dot', delay: '1.4s' },
  { top: '85%', left: '45%', size: 4, cls: 'animate-float-slow', delay: '1.8s' },
  { top: '55%', left: '94%', size: 3, cls: 'animate-pulse-dot', delay: '0.4s' },
  { top: '48%', left: '3%', size: 5, cls: 'animate-float-slower', delay: '1.6s' },
]

export function IntroScreen({ onContinue }: { onContinue: () => void }) {
  const [phase, setPhase] = useState(0)
  const [textIndex, setTextIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const reduced = mq.matches
    setReducedMotion(reduced)

    if (reduced) {
      setPhase(3)
      setTextIndex(1)
      return
    }

    const timers = [
      setTimeout(() => setPhase(1), 850),
      setTimeout(() => setPhase(2), 1850),
      setTimeout(() => setTextIndex(1), 2750),
      setTimeout(() => setPhase(3), 3050),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-50/60 via-stone-50 to-stone-50 px-6 py-10 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden sm:block">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className={`absolute rounded-full bg-emerald-500/20 ${reducedMotion ? '' : p.cls}`}
            style={{ top: p.top, left: p.left, width: p.size, height: p.size, animationDelay: p.delay }}
          />
        ))}
      </div>

      <button
        onClick={onContinue}
        className="absolute right-5 top-5 rounded-full border border-slate-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-slate-500 backdrop-blur-sm transition hover:border-slate-300 hover:text-slate-700 sm:right-8 sm:top-8"
      >
        Skip
      </button>

      <div className="relative flex h-24 w-24 items-center justify-center">
        {phase >= 0 && !reducedMotion && (
          <>
            <span className="animate-pulse-ring absolute h-20 w-20 rounded-full border-2 border-emerald-300/70" />
            <span className="animate-pulse-ring absolute h-20 w-20 rounded-full border-2 border-emerald-300/50" style={{ animationDelay: '0.6s' }} />
          </>
        )}
        {phase >= 1 && (
          <div className={reducedMotion ? '' : 'animate-logo-in'}>
            <Logo size="lg" />
          </div>
        )}
      </div>

      <div className="mt-8 flex h-10 w-full max-w-md items-center justify-center">
        {phase >= 2 && (
          <p key={textIndex} className={`text-2xl font-bold text-slate-900 sm:text-3xl ${reducedMotion ? '' : 'animate-slide-up'}`}>
            {textIndex === 0 ? 'Know your money.' : 'Grow your business.'}
          </p>
        )}
      </div>

      <div className="flex min-h-[220px] flex-col items-center">
        {phase >= 3 && (
          <div className={reducedMotion ? 'flex flex-col items-center' : 'animate-slide-up flex flex-col items-center'}>
            <svg width="160" height="52" viewBox="0 0 160 52" fill="none" className="mb-1">
              <path
                d="M4 44 L40 34 L70 38 L100 18 L130 22 L156 6"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={reducedMotion ? '' : 'animate-graph-draw'}
              />
            </svg>
            <p className="max-w-xs text-sm text-slate-500 sm:text-base">Smart financial management for modern MSMEs</p>

            <button
              onClick={onContinue}
              className="group mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-900/25 active:translate-y-0"
            >
              Continue to DHAN
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </button>

            <p className="mt-6 text-xs font-medium text-slate-400">Built for India&apos;s MSMEs</p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Demo Mode
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
