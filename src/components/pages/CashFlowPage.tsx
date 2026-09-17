import { useEffect, useState } from 'react'
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts'
import { Info } from 'lucide-react'
import { fetchCashFlowForecast, type ForecastResponse } from '@/lib/api'
import { formatCompactINR, formatINR } from '@/lib/format'
import { LoadingCard, ErrorCard, isOfflineError } from '@/components/ui/StateViews'

const SCENARIOS: { key: 'normal' | 'higher_spending' | 'lower_sales'; label: string }[] = [
  { key: 'normal', label: 'Normal' },
  { key: 'higher_spending', label: 'Higher Spending' },
  { key: 'lower_sales', label: 'Lower Sales' },
]

export function CashFlowPage() {
  const [scenario, setScenario] = useState<'normal' | 'higher_spending' | 'lower_sales'>('normal')
  const [data, setData] = useState<ForecastResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function load() {
    setLoading(true)
    fetchCashFlowForecast(scenario)
      .then((res) => {
        setData(res)
        setOffline(false)
        setError(null)
      })
      .catch((err) => {
        if (isOfflineError(err)) setOffline(true)
        else setError(err instanceof Error ? err.message : 'Failed to load forecast')
      })
      .finally(() => setLoading(false))
  }

  useEffect(load, [scenario])

  const chartData = data
    ? [
        ...data.historical.map((h) => ({ label: h.label, net: h.net, income: h.income, expenses: h.expenses, forecast: false })),
        ...data.forecast.map((f) => ({
          label: f.label,
          projected_balance: f.projected_balance,
          income: f.expected_income,
          expenses: f.expected_expenses,
          forecast: true,
        })),
      ]
    : []

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Cash Flow Forecast</h1>
          <p className="mt-1 text-sm text-slate-500">A simple, explainable projection based on your transaction history.</p>
        </div>
        <div className="flex gap-1 rounded-xl bg-stone-100 p-1">
          {SCENARIOS.map((s) => (
            <button
              key={s.key}
              onClick={() => setScenario(s.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                scenario === s.key ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {loading && !data ? (
        <LoadingCard label="Building forecast…" />
      ) : offline ? (
        <ErrorCard offline onRetry={load} />
      ) : error ? (
        <ErrorCard message={error} onRetry={load} />
      ) : (
        data && (
          <>
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{data.disclaimer}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="mb-1 text-base font-semibold text-slate-900">Historical vs projected ({data.scenario_label})</h3>
              <p className="mb-5 text-sm text-slate-400">Method: {data.method} · Trend: {data.trend_direction}</p>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData} margin={{ top: 5, right: 8, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef0f2" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompactINR(v)} width={56} />
                  {data.historical.length > 0 && (
                    <ReferenceLine
                      x={data.historical[data.historical.length - 1]?.label}
                      stroke="#10b981"
                      strokeDasharray="4 4"
                      label={{ value: 'Forecast starts', position: 'insideTopRight', fill: '#10b981', fontSize: 11, fontWeight: 600 }}
                    />
                  )}
                  <Tooltip formatter={(v: number) => formatINR(v)} />
                  <Line type="monotone" dataKey="net" stroke="#0f172a" strokeWidth={2} dot={false} name="Net (historical)" />
                  <Area type="monotone" dataKey="projected_balance" stroke="#10b981" strokeWidth={2} fill="url(#forecastFill)" strokeDasharray="4 4" name="Projected balance" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {data.forecast.map((f) => (
                <div key={f.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{f.label} (estimate)</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">{formatINR(f.projected_balance)}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Expected income {formatINR(f.expected_income)} · expenses {formatINR(f.expected_expenses)}
                  </p>
                </div>
              ))}
            </div>
          </>
        )
      )}
    </div>
  )
}
