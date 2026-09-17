import { Link, useRouterState } from '@tanstack/react-router'
import { LayoutDashboard, Receipt, Plus, BarChart3, Menu, X } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { NAV_ITEMS, BOTTOM_NAV_ITEMS } from './nav-items'
import { NavList } from './NavList'
import { BUSINESS_PROFILE } from '@/data/fixtures'

export function MobileNav({
  onOpenModal,
  drawerOpen,
  onDrawerChange,
}: {
  onOpenModal: (modal: 'expense' | 'income') => void
  drawerOpen: boolean
  onDrawerChange: (open: boolean) => void
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur-sm lg:hidden">
        <NavLinkButton to="/dashboard" icon={LayoutDashboard} label="Overview" active={pathname === '/dashboard'} />
        <NavLinkButton to="/transactions" icon={Receipt} label="Transactions" active={pathname === '/transactions'} />
        <button
          onClick={() => onOpenModal('expense')}
          className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-900/25 transition active:scale-95"
          aria-label="Add transaction"
        >
          <Plus className="h-6 w-6" />
        </button>
        <NavLinkButton to="/analytics" icon={BarChart3} label="Analytics" active={pathname === '/analytics'} />
        <NavIconButton icon={Menu} label="Menu" onClick={() => onDrawerChange(true)} />
      </nav>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="animate-fade-in absolute inset-0 bg-slate-900/40" onClick={() => onDrawerChange(false)} />
          <div className="animate-slide-in-right absolute right-0 top-0 flex h-full w-72 flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between px-5 py-5">
              <Logo size="sm" />
              <button onClick={() => onDrawerChange(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3">
              <NavList items={NAV_ITEMS} onOpenModal={onOpenModal} onNavigate={() => onDrawerChange(false)} />
            </div>
            <div className="border-t border-slate-100 px-3 py-3">
              <NavList items={BOTTOM_NAV_ITEMS} onOpenModal={onOpenModal} onNavigate={() => onDrawerChange(false)} />
              <div className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-white">ST</div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">{BUSINESS_PROFILE.name}</p>
                  <p className="truncate text-xs text-slate-400">{BUSINESS_PROFILE.type}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function NavLinkButton({ to, icon: Icon, label, active }: { to: string; icon: typeof LayoutDashboard; label: string; active?: boolean }) {
  return (
    <Link to={to} className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium ${active ? 'text-emerald-700' : 'text-slate-400'}`}>
      <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
      {label}
    </Link>
  )
}

function NavIconButton({
  icon: Icon,
  label,
  onClick,
  active,
}: {
  icon: typeof LayoutDashboard
  label: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <button onClick={onClick} className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium ${active ? 'text-emerald-700' : 'text-slate-400'}`}>
      <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
      {label}
    </button>
  )
}
