import { useEffect, useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { TrendingUp, TrendingDown, PieChart as PieIcon, Store } from 'lucide-react'
import {
  fetchAnalyticsOverview,
  fetchAnalyticsMonthly,
  fetchAnalyticsCategories,
  fetchAnalyticsVendors,
  type AnalyticsOverview,
} from '@/lib/api'
import { formatCompactINR, formatINR } from '@/lib/format'
import { LoadingCard, ErrorCard, EmptyCard, isOfflineError } from '@/components/ui/StateViews'

type Monthly = { year: number; month: number; label: string; income: number; expenses: number; net: number }
type CategoryRow = { category: string; amount: number; percentage: number; transaction_count: number; average_transaction: number }
type VendorRow = { vendor: string; amount: number; transaction_count: number }

export function AnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [monthly, setMonthly] = useState<Monthly[]>([])
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [vendors, setVendors] = useState<VendorRow[]>([])
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function load() {
    setLoading(true)
    Promise.all([fetchAnalyticsOverview(), fetchAnalyticsMonthly(), fetchAnalyticsCategories(), fetchAnalyticsVendors()])
      .then(([o, m, c, v]) => {
        setOverview(o)
        setMonthly(m)
        setCategories(c)
        setVendors(v)
        setOffline(false)
        setError(null)
      })
      .catch((err) => {
        if (isOfflineError(err)) setOffline(true)
        else setError(err instanceof Error ? err.message : 'Failed to load analytics')
      })
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">Trends and breakdowns calculated from your real transaction data.</p>
      </div>

      {loading ? (
        <LoadingCard label="Crunching the numbers…" />
      ) : offline ? (
        <ErrorCard offline onRetry={load} />
      ) : error ? (
        <ErrorCard message={error} onRetry={load} />
      ) : (
        <>
          {overview && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Profit margin" value={`${overview.profit_margin}%`} icon={overview.profit_margin >= 0 ? TrendingUp : TrendingDown} />
              <StatCard label="Avg monthly expense" value={formatINR(overview.average_monthly_expense)} icon={TrendingDown} />
              <StatCard label="Revenue trend" value={`${overview.revenue_trend > 0 ? '+' : ''}${overview.revenue_trend}%`} icon={TrendingUp} />
              <StatCard label="Top expense category" value={overview.highest_expense_category ?? '—'} icon={PieIcon} />
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="mb-4 text-base font-semibold text-slate-900">Income vs Expenses — last 12 months</h3>
            {monthly.length === 0 ? (
              <EmptyCard label="Not enough data yet" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthly} margin={{ top: 5, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef0f2" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompactINR(v)} width={56} />
                  <Tooltip formatter={(v: number) => formatINR(v)} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="expenses" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="mb-4 text-base font-semibold text-slate-900">Category breakdown</h3>
              {categories.length === 0 ? (
                <EmptyCard label="No expense categories yet" />
              ) : (
                <div className="space-y-1.5">
                  {categories.map((c) => (
                    <div key={c.category} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-stone-50">
                      <span className="flex-1 text-sm font-medium text-slate-700">{c.category}</span>
                      <span className="text-xs text-slate-400">{c.transaction_count} txns</span>
                      <span className="w-24 shrink-0 text-right text-sm font-semibold text-slate-800">{formatINR(c.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
                <Store className="h-4 w-4 text-emerald-600" /> Vendor spending
              </h3>
              {vendors.length === 0 ? (
                <EmptyCard label="No vendor spending yet" />
              ) : (
                <div className="space-y-1.5">
                  {vendors.map((v) => (
                    <div key={v.vendor} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-stone-50">
                      <span className="flex-1 text-sm font-medium text-slate-700">{v.vendor}</span>
                      <span className="text-xs text-slate-400">{v.transaction_count} txns</span>
                      <span className="w-24 shrink-0 text-right text-sm font-semibold text-slate-800">{formatINR(v.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {overview && overview.insights.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="mb-3 text-base font-semibold text-slate-900">Insights</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                {overview.insights.map((line, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof TrendingUp }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
      </div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 truncate text-xl font-bold text-slate-900">{value}</p>
    </div>
  )
}
