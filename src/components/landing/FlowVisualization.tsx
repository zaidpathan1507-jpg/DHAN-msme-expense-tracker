import { TrendingUp, Receipt, Activity, HeartPulse, ArrowRight } from 'lucide-react'

const STEPS = [
  { label: 'Income', value: '₹2.48L', icon: TrendingUp, tint: 'from-emerald-500 to-emerald-600' },
  { label: 'Expenses', value: '₹1.32L', icon: Receipt, tint: 'from-slate-500 to-slate-600' },
  { label: 'Cash Flow', value: '₹1.16L', icon: Activity, tint: 'from-emerald-500 to-emerald-600' },
  { label: 'Business Health', value: '82/100', icon: HeartPulse, tint: 'from-emerald-600 to-emerald-700' },
]

export function FlowVisualization() {
  return (
    <div className="relative rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-sm sm:p-8">
      <p className="mb-6 text-sm font-medium text-slate-500">How DHAN sees your business, every day</p>
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-2">
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex flex-1 items-center gap-2">
            <div className="animate-slide-up flex-1 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-transform duration-300 hover:-translate-y-0.5" style={{ animationDelay: `${i * 120}ms` }}>
              <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${step.tint} text-white shadow-sm`}>
                <step.icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
              </div>
              <p className="text-xs font-medium text-slate-500">{step.label}</p>
              <p className="mt-0.5 text-lg font-bold text-slate-900">{step.value}</p>
            </div>
            {i < STEPS.length - 1 && (
              <div className="hidden shrink-0 items-center justify-center text-emerald-400 sm:flex">
                <ArrowRight className="h-5 w-5 animate-pulse-dot" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
