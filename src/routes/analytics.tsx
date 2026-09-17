import { createFileRoute } from '@tanstack/react-router'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { AnalyticsPage } from '@/components/pages/AnalyticsPage'

export const Route = createFileRoute('/analytics')({
  component: Page,
})

function Page() {
  return (
    <DashboardShell>
      <AnalyticsPage />
    </DashboardShell>
  )
}
