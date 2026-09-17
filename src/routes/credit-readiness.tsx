import { createFileRoute } from '@tanstack/react-router'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { CreditReadinessPage } from '@/components/pages/CreditReadinessPage'

export const Route = createFileRoute('/credit-readiness')({
  component: Page,
})

function Page() {
  return (
    <DashboardShell>
      <CreditReadinessPage />
    </DashboardShell>
  )
}
