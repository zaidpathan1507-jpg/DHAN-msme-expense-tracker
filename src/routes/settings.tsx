import { createFileRoute } from '@tanstack/react-router'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { SettingsPage } from '@/components/pages/SettingsPage'

export const Route = createFileRoute('/settings')({
  component: Page,
})

function Page() {
  return (
    <DashboardShell>
      <SettingsPage />
    </DashboardShell>
  )
}
