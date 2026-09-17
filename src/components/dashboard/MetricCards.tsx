import { TrendingUp, TrendingDown, Wallet, HeartPulse, Receipt } from 'lucide-react'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { formatINR } from '@/lib/format'
import { useAppStore } from '@/lib/store'

export function MetricCards() {
  const { totalIncome, totalExpenses, netCashFlow, healthScore, transactionCount } = useAppStore()

  const cards = [
    {
      label: 'Total Income',
      value: totalIncome,
      badge: 'All-time',
      icon: TrendingUp,
      format: formatINR,
    },
    {
      label: 'Total Expenses',
      value: totalExpenses,
      badge: 'All-time',
      icon: TrendingDown,
      format: formatINR,
    },
    {
      label: 'Net Cash Flow',
      value: netCashFlow,
      badge: `${transactionCount} txns`,
      icon: Wallet,
      format: formatINR,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => (
        <div
          key={c.label}
          className="animate-slide-up group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
              <c.icon className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">{c.badge}</span>
          </div>
          <p className="text-sm font-medium text-slate-500">{c.label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            <AnimatedNumber value={c.value} format={c.format} />
          </p>
        </div>
      ))}

      <div
        className="animate-slide-up group rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        style={{ animationDelay: '240ms' }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-emerald-400">
            <HeartPulse className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-semibold text-emerald-300">
            <Receipt className="h-3 w-3" /> Prototype
          </span>
        </div>
        <p className="text-sm font-medium text-slate-300">Business Health</p>
        <p className="mt-1 text-2xl font-bold text-white">
          <AnimatedNumber value={healthScore} format={(n) => `${Math.round(n)}/100`} />
        </p>
      </div>
    </div>
  )
}
