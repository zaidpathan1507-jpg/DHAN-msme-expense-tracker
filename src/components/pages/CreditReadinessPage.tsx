import { useEffect, useState } from 'react'
import { ShieldAlert } from 'lucide-react'
import { fetchCreditReadiness, type CreditReadiness } from '@/lib/api'
import { LoadingCard, ErrorCard, isOfflineError } from '@/components/ui/StateViews'

const FACTOR_LABELS: Record<keyof CreditReadiness['factors'], string> = {
  income_consistency: 'Income consistency',
  expense_consistency: 'Expense consistency',
  cash_flow_stability: 'Cash flow stability',
  transaction_history: 'Transaction history',
}

function scoreColor(score: number) {
  if (score >= 70) return { ring: '#10b981', text: 'text-emerald-600', label: 'Strong' }
  if (score >= 40) return { ring: '#f59e0b', text: 'text-amber-600', label: 'Developing' }
  return { ring: '#f43f5e', text: 'text-rose-600', label: 'Needs work' }
}

export function CreditReadinessPage() {
  const [data, setData] = useState<CreditReadiness | null>(null)
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function load() {
    setLoading(true)
    fetchCreditReadiness()
      .then((res) => {
        setData(res)
        setOffline(false)
        setError(null)
      })
      .catch((err) => {
        if (isOfflineError(err)) setOffline(true)
        else setError(err instanceof Error ? err.message : 'Failed to load credit readiness')
      })
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const colors = data ? scoreColor(data.score) : scoreColor(0)

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Credit Readiness</h1>
        <p className="mt-1 text-sm text-slate-500">A transparent, explainable indicator of your business's financial consistency.</p>
      </div>

      {loading ? (
        <LoadingCard label="Calculating…" />
      ) : offline ? (
        <ErrorCard offline onRetry={load} />
      ) : error ? (
        <ErrorCard message={error} onRetry={load} />
      ) : (
        data && (
          <>
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              Prototype financial indicator — not an official credit score.
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center sm:gap-10">
                <div
                  className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full"
                  style={{ background: `conic-gradient(${colors.ring} ${data.score * 3.6}deg, #e2e8f0 0deg)` }}
                >
                  <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
                    <p className={`text-4xl font-bold ${colors.text}`}>{data.score}</p>
                    <p className="text-xs font-semibold text-slate-400">/ 100</p>
                  </div>
                </div>
                <div className="max-w-sm text-center sm:text-left">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colors.text} bg-current/10`} style={{ backgroundColor: `${colors.ring}1a` }}>
                    {colors.label}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{data.disclaimer}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="mb-5 text-base font-semibold text-slate-900">Factor breakdown</h3>
              <div className="space-y-5">
                {(Object.keys(data.factors) as Array<keyof CreditReadiness['factors']>).map((key) => {
                  const value = data.factors[key]
                  return (
                    <div key={key}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">{FACTOR_LABELS[key]}</span>
                        <span className="font-semibold text-slate-500">{value}/100</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all"
                          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="mt-6 text-xs leading-relaxed text-slate-400">{data.methodology}</p>
            </div>
          </>
        )
      )}
    </div>
  )
}
