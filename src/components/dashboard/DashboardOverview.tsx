import { MetricCards } from './MetricCards'
import { CashFlowChart } from './CashFlowChart'
import { SpendingBreakdown } from './SpendingBreakdown'
import { InsightsSection } from './InsightsSection'
import { BUSINESS_PROFILE } from '@/data/fixtures'
import { useAppStore } from '@/lib/store'
import { LoadingCard, ErrorCard } from '@/components/ui/StateViews'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function DashboardOverview() {
  const { loading, offline, error, refresh } = useAppStore()

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="animate-slide-up">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {greeting()}, {BUSINESS_PROFILE.ownerGreetingName}
        </h1>
        <p className="mt-1 text-sm text-slate-500 sm:text-base">Here's how your business is doing.</p>
      </div>

      {loading ? (
        <LoadingCard label="Loading your dashboard…" />
      ) : offline ? (
        <ErrorCard offline onRetry={refresh} />
      ) : error ? (
        <ErrorCard message={error} onRetry={refresh} />
      ) : (
        <>
          <MetricCards />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <CashFlowChart />
            </div>
            <div className="lg:col-span-2">
              <SpendingBreakdown />
            </div>
          </div>

          <InsightsSection />
        </>
      )}
    </div>
  )
}
