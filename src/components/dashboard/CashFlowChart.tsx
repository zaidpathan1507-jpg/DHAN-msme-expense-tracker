import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { fetchDashboardCashFlow, type CashFlowPoint } from '@/lib/api'
import { formatCompactINR, formatINR } from '@/lib/format'
import { LoadingCard, ErrorCard, isOfflineError } from '@/components/ui/StateViews'

const RANGES = ['7D', '30D', '3M', '1Y'] as const
type Range = (typeof RANGES)[number]
const RANGE_PARAM: Record<Range, '7d' | '30d' | '3m' | '1y'> = { '7D': '7d', '30D': '30d', '3M': '3m', '1Y': '1y' }

export function CashFlowChart() {
  const [range, setRange] = useState<Range>('30D')
  const [data, setData] = useState<CashFlowPoint[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchDashboardCashFlow(RANGE_PARAM[range])
      .then((points) => {
        if (cancelled) return
        setData(points.map((p) => ({ ...p, label: p.label ?? p.date })))
        setOffline(false)
        setError(null)
      })
      .catch((err) => {
        if (cancelled) return
        if (isOfflineError(err)) setOffline(true)
        else setError(err instanceof Error ? err.message : 'Failed to load cash flow')
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [range])

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Cash Flow Overview</h3>
          <p className="text-sm text-slate-400">Income, expenses and net cash flow over time</p>
        </div>
        <div className="flex gap-1 rounded-xl bg-stone-100 p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                range === r ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {r === '7D' ? '7 Days' : r === '30D' ? '30 Days' : r === '3M' ? '3 Months' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {loading && !data ? (
        <LoadingCard label="Loading cash flow…" />
      ) : offline ? (
        <ErrorCard offline onRetry={() => setRange((r) => r)} />
      ) : error ? (
        <ErrorCard message={error} onRetry={() => setRange((r) => r)} />
      ) : (
        <>
          <div className="mb-3 flex items-center gap-5 text-xs font-medium text-slate-500">
            <Legend color="#10b981" label="Income" />
            <Legend color="#94a3b8" label="Expenses" />
            <Legend color="#0f172a" label="Net Cash Flow" />
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data ?? []} margin={{ top: 5, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef0f2" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} minTickGap={20} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompactINR(v)} width={56} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fill="url(#incomeFill)" dot={false} />
              <Area type="monotone" dataKey="expenses" stroke="#94a3b8" strokeWidth={2} fill="url(#expenseFill)" dot={false} />
              <Line type="monotone" dataKey="net" stroke="#0f172a" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-0.5 w-3.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs shadow-lg">
      <p className="mb-1.5 font-semibold text-slate-700">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span className="capitalize text-slate-400">{p.dataKey === 'net' ? 'Net Cash Flow' : p.dataKey}</span>
          <span className="font-semibold text-slate-800">{formatINR(p.value)}</span>
        </div>
      ))}
    </div>
  )
}
