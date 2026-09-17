import { createFileRoute } from '@tanstack/react-router'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { CashFlowPage } from '@/components/pages/CashFlowPage'

export const Route = createFileRoute('/cashflow')({
  component: Page,
})

function Page() {
  return (
    <DashboardShell>
      <CashFlowPage />
    </DashboardShell>
  )
}
