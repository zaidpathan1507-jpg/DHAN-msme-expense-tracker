import { useMemo, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Receipt, Calculator } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { formatINR } from '@/lib/format'
import { EmptyCard } from '@/components/ui/StateViews'

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#94a3b8', '#cbd5e1', '#e2e8f0', '#0f766e']

export function SpendingBreakdown() {
  const { categoryTotals, totalExpenses } = useAppStore()
  const [selected, setSelected] = useState(categoryTotals[0]?.category ?? '')

  const data = useMemo(() => categoryTotals.filter((c) => c.amount > 0), [categoryTotals])
  const active = data.find((d) => d.category === selected) ?? data[0]

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-base font-semibold text-slate-900">Spending Breakdown</h3>
      <p className="mb-5 text-sm text-slate-400">Where your money goes</p>

      {data.length === 0 ? (
        <EmptyCard label="No expenses yet" hint="Add an expense to see your spending breakdown" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
            <div className="relative mx-auto h-48 w-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="amount"
                    nameKey="category"
                    innerRadius={62}
                    outerRadius={88}
                    paddingAngle={2}
                    onClick={(d: any) => setSelected(d.category)}
                    cursor="pointer"
                  >
                    {data.map((d, i) => (
                      <Cell key={d.category} fill={COLORS[i % COLORS.length]} opacity={d.category === selected ? 1 : 0.55} stroke="white" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatINR(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xs font-medium text-slate-400">Total spent</p>
                <p className="text-lg font-bold text-slate-900">{formatINR(totalExpenses)}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              {data.map((d, i) => (
                <button
                  key={d.category}
                  onClick={() => setSelected(d.category)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                    selected === d.category ? 'bg-emerald-50' : 'hover:bg-stone-50'
                  }`}
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="flex-1 text-sm font-medium text-slate-700">{d.category}</span>
                  <span className="text-xs text-slate-400">{d.percentage}%</span>
                  <span className="w-24 shrink-0 text-right text-sm font-semibold text-slate-800">{formatINR(d.amount)}</span>
                </button>
              ))}
            </div>
          </div>

          {active && (
            <div className="animate-fade-in mt-5 rounded-2xl border border-slate-100 bg-stone-50 p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Category detail</p>
                  <p className="mt-0.5 text-lg font-bold text-slate-900">{active.category}</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-500">
                  {active.percentage}% of total spend
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Stat icon={Receipt} label="Amount" value={formatINR(active.amount)} />
                <Stat icon={Calculator} label="Avg transaction" value={formatINR(active.averageTransaction)} />
                <Stat icon={Receipt} label="Transactions" value={String(active.transactionCount)} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function Stat({ icon: Icon, label, value }: { icon: typeof Receipt; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5">
      <Icon className="h-4 w-4 shrink-0 text-emerald-600" />
      <div className="min-w-0">
        <p className="text-[11px] text-slate-400">{label}</p>
        <p className="truncate text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  )
}
