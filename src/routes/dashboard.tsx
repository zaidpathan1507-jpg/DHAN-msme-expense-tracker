import { createFileRoute } from '@tanstack/react-router'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { DashboardOverview } from '@/components/dashboard/DashboardOverview'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardOverview />
    </DashboardShell>
  )
}
