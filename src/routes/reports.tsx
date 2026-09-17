import { createFileRoute } from '@tanstack/react-router'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { ReportsPage } from '@/components/pages/ReportsPage'

export const Route = createFileRoute('/reports')({
  component: Page,
})

function Page() {
  return (
    <DashboardShell>
      <ReportsPage />
    </DashboardShell>
  )
}
