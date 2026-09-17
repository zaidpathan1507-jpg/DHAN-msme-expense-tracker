import { useNavigate } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { NAV_ITEMS, BOTTOM_NAV_ITEMS } from './nav-items'
import { NavList } from './NavList'
import { BUSINESS_PROFILE } from '@/data/fixtures'
import { setAuthToken } from '@/lib/api'

export function Sidebar({ onOpenModal }: { onOpenModal: (modal: 'expense' | 'income') => void }) {
  const navigate = useNavigate()

  function handleLogout() {
    setAuthToken(null)
    navigate({ to: '/' })
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="px-5 py-6">
        <Logo />
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-500" />
          Demo Mode
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <NavList items={NAV_ITEMS} onOpenModal={onOpenModal} />
      </div>
      <div className="border-t border-slate-100 px-3 py-3">
        <NavList items={BOTTOM_NAV_ITEMS} onOpenModal={onOpenModal} />
        <div className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-white">
            ST
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">{BUSINESS_PROFILE.name}</p>
            <p className="truncate text-xs text-slate-400">{BUSINESS_PROFILE.type}</p>
          </div>
          <button
            onClick={handleLogout}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
