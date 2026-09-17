import { createFileRoute } from '@tanstack/react-router'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { TransactionsPage } from '@/components/pages/TransactionsPage'

export const Route = createFileRoute('/transactions')({
  component: Page,
})

function Page() {
  return (
    <DashboardShell>
      <TransactionsPage />
    </DashboardShell>
  )
}
