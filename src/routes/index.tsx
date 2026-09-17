import { createFileRoute } from '@tanstack/react-router'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { DashboardOverview } from '@/components/dashboard/DashboardOverview'

export const Route = createFileRoute('/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardOverview />
    </DashboardShell>
  )
}
