import { Link } from '@tanstack/react-router'
import { ShieldCheck, Sparkles, Store, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { FlowVisualization } from '@/components/landing/FlowVisualization'

const FLOATING_METRICS = [
  { label: 'Revenue', value: '₹2.48L', position: 'top-2 -left-6 sm:top-4 sm:-left-10', delay: '0s' },
  { label: 'Expenses', value: '₹1.32L', position: 'top-20 -right-4 sm:top-24 sm:-right-8', delay: '1.2s' },
  { label: 'Net Cash Flow', value: '₹1.16L', position: 'bottom-16 -left-8 sm:bottom-20 sm:-left-12', delay: '2s' },
  { label: 'Business Health', value: '82/100', position: 'bottom-0 -right-2 sm:bottom-2 sm:-right-6', delay: '0.6s' },
]

const TRUST_ITEMS = [
  { icon: Sparkles, label: 'Simple' },
  { icon: ShieldCheck, label: 'Secure by design' },
  { icon: Store, label: 'Built for MSMEs' },
]

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-emerald-50/60 via-stone-50 to-stone-50">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <Logo />
        <Link
          to="/dashboard"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
        >
          Sign in
        </Link>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-24 pt-8 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-12">
          <div className="animate-slide-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" />
              Built for Indian small businesses
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem]">
              Your business money, finally in one place.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
              Track expenses, understand cash flow and make smarter business decisions — without accounting complexity.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/dashboard"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-900/25 active:translate-y-0"
              >
                Open DHAN Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 active:translate-y-0"
              >
                Explore Demo
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              {TRUST_ITEMS.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <item.icon className="h-4 w-4 text-emerald-600" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -inset-x-4 -inset-y-10 -z-10 hidden rounded-[3rem] bg-gradient-to-br from-emerald-100/60 via-transparent to-transparent blur-2xl sm:block" />
            {FLOATING_METRICS.map((m) => (
              <div
                key={m.label}
                className={`animate-float-slow absolute z-10 hidden rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-lg shadow-slate-900/10 lg:block ${m.position}`}
                style={{ animationDelay: m.delay }}
              >
                <p className="text-[11px] font-medium text-slate-400">{m.label}</p>
                <p className="text-base font-bold text-slate-900">{m.value}</p>
              </div>
            ))}
            <FlowVisualization />
            <div className="mt-4 grid grid-cols-2 gap-3 lg:hidden">
              {FLOATING_METRICS.map((m) => (
                <div key={m.label} className="rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
                  <p className="text-[11px] font-medium text-slate-400">{m.label}</p>
                  <p className="text-base font-bold text-slate-900">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/70 bg-white/50 py-6 text-center text-xs text-slate-400">
        DHAN is a frontend prototype built for demonstration purposes. All data shown is illustrative.
      </footer>
    </div>
  )
}
