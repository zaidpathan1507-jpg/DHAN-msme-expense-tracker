import { createFileRoute } from '@tanstack/react-router'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { BudgetsPage } from '@/components/pages/BudgetsPage'

export const Route = createFileRoute('/budgets')({
  component: Page,
})

function Page() {
  return (
    <DashboardShell>
      <BudgetsPage />
    </DashboardShell>
  )
}
