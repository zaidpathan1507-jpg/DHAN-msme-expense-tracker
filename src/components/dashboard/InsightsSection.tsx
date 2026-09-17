import { useEffect, useState } from 'react'
import { TrendingUp, AlertTriangle, Lightbulb, ShieldCheck, ArrowRight, type LucideIcon } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { LoadingCard, ErrorCard, isOfflineError } from '@/components/ui/StateViews'
import { fetchAnomalies, fetchCashFlowForecast, fetchCreditReadiness, fetchAnalyticsOverview } from '@/lib/api'
import { formatINR } from '@/lib/format'

type Severity = 'positive' | 'watch' | 'warning'

interface InsightCard {
  id: string
  icon: LucideIcon
  title: string
  severity: Severity
  summary: string
  detail: string
}

const SEVERITY_STYLE: Record<Severity, { badge: string; iconWrap: string; label: string }> = {
  positive: { badge: 'bg-emerald-50 text-emerald-700', iconWrap: 'bg-emerald-50 text-emerald-600', label: 'Positive' },
  watch: { badge: 'bg-amber-50 text-amber-700', iconWrap: 'bg-amber-50 text-amber-600', label: 'Watch' },
  warning: { badge: 'bg-rose-50 text-rose-700', iconWrap: 'bg-rose-50 text-rose-600', label: 'Needs attention' },
}

export function InsightsSection() {
  const [openId, setOpenId] = useState<string | null>(null)
  const [insights, setInsights] = useState<InsightCard[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchCashFlowForecast('normal'), fetchAnomalies(), fetchCreditReadiness(), fetchAnalyticsOverview()])
      .then(([forecast, anomalies, credit, overview]) => {
        if (cancelled) return
        const cards: InsightCard[] = []

        const nextMonth = forecast.forecast[0]
        cards.push({
          id: 'forecast',
          icon: TrendingUp,
          title: 'Cash Flow Forecast',
          severity: forecast.trend_direction === 'declining' ? 'watch' : 'positive',
          summary: nextMonth
            ? `Projected balance for ${nextMonth.label}: ${formatINR(nextMonth.projected_balance)} (${forecast.trend_direction}).`
            : 'Add more transactions to unlock a forecast.',
          detail: `${forecast.disclaimer} Method: ${forecast.method}. This uses your historical income and expense pattern under the "${forecast.scenario_label}" scenario.`,
        })

        const topAnomaly = anomalies.items[0]
        cards.push({
          id: 'anomaly',
          icon: AlertTriangle,
          title: 'Anomaly Alert',
          severity: topAnomaly ? (topAnomaly.severity === 'high' ? 'warning' : 'watch') : 'positive',
          summary: topAnomaly
            ? `${topAnomaly.category}: ${topAnomaly.explanation}`
            : 'No unusual expenses detected in your recent transactions.',
          detail: topAnomaly
            ? `${topAnomaly.explanation} Typical spend in this category is around ${formatINR(topAnomaly.normal_average)}, this transaction was ${formatINR(topAnomaly.amount)} (${topAnomaly.deviation_percentage}% deviation). ${anomalies.note}`
            : anomalies.note,
        })

        cards.push({
          id: 'overview',
          icon: Lightbulb,
          title: 'Spending Insight',
          severity: 'watch',
          summary: overview.insights[0] ?? 'Add more transactions to unlock deeper trend insights.',
          detail: overview.insights.join(' '),
        })

        cards.push({
          id: 'credit',
          icon: ShieldCheck,
          title: 'Credit Readiness',
          severity: credit.score >= 70 ? 'positive' : credit.score >= 40 ? 'watch' : 'warning',
          summary: `Prototype financial indicator score: ${credit.score}/100.`,
          detail: `${credit.disclaimer} Factors — income consistency: ${credit.factors.income_consistency}, expense consistency: ${credit.factors.expense_consistency}, cash flow stability: ${credit.factors.cash_flow_stability}, transaction history: ${credit.factors.transaction_history}. ${credit.methodology}`,
        })

        setInsights(cards)
        setOffline(false)
        setError(null)
      })
      .catch((err) => {
        if (cancelled) return
        if (isOfflineError(err)) setOffline(true)
        else setError(err instanceof Error ? err.message : 'Failed to load insights')
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const active = insights?.find((i) => i.id === openId)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-[11px] font-bold text-white">D</span>
        <h3 className="text-base font-semibold text-slate-900">DHAN Insights</h3>
      </div>

      {loading ? (
        <LoadingCard label="Analyzing your finances…" />
      ) : offline ? (
        <ErrorCard offline />
      ) : error ? (
        <ErrorCard message={error} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {insights?.map((insight) => {
            const Icon = insight.icon
            const style = SEVERITY_STYLE[insight.severity]
            return (
              <div key={insight.id} className="flex flex-col rounded-2xl border border-slate-100 bg-stone-50 p-4 transition hover:border-slate-200 hover:bg-white hover:shadow-sm">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${style.iconWrap}`}>
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${style.badge}`}>{style.label}</span>
                </div>
                <p className="text-sm font-semibold text-slate-800">{insight.title}</p>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-500">{insight.summary}</p>
                <button
                  onClick={() => setOpenId(insight.id)}
                  className="mt-3 inline-flex items-center gap-1 self-start text-xs font-semibold text-emerald-700 hover:underline"
                >
                  View details <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={!!active} onClose={() => setOpenId(null)} title={active?.title ?? ''} maxWidth="max-w-md">
        {active && (
          <div>
            <p className={`mb-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${SEVERITY_STYLE[active.severity].badge}`}>
              {SEVERITY_STYLE[active.severity].label}
            </p>
            <p className="text-sm leading-relaxed text-slate-600">{active.detail}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}
