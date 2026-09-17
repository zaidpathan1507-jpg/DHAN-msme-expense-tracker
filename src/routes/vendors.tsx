import { createFileRoute } from '@tanstack/react-router'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { VendorsPage } from '@/components/pages/VendorsPage'

export const Route = createFileRoute('/vendors')({
  component: Page,
})

function Page() {
  return (
    <DashboardShell>
      <VendorsPage />
    </DashboardShell>
  )
}
