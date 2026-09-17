import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileNav } from './MobileNav'
import { AddExpenseModal } from '@/components/expense/AddExpenseModal'
import { AddIncomeModal } from '@/components/expense/AddIncomeModal'
import { getAuthToken } from '@/lib/api'

export function DashboardShell({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<'expense' | 'income' | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!getAuthToken()) {
      navigate({ to: '/' })
    }
  }, [navigate])

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Sidebar onOpenModal={setModal} />
      <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden">
        <Topbar onOpenModal={setModal} onOpenMobileMenu={() => setDrawerOpen(true)} />
        <main className="flex-1 px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-10">{children}</main>
      </div>
      <MobileNav onOpenModal={setModal} drawerOpen={drawerOpen} onDrawerChange={setDrawerOpen} />

      <AddExpenseModal open={modal === 'expense'} onClose={() => setModal(null)} />
      <AddIncomeModal open={modal === 'income'} onClose={() => setModal(null)} />
    </div>
  )
}
