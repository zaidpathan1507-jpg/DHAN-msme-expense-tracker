import { Link, useRouterState } from '@tanstack/react-router'
import { useToast } from '@/components/ui/Toast'
import type { NavItem } from './nav-items'

export function NavList({
  items,
  onOpenModal,
  onNavigate,
}: {
  items: NavItem[]
  onOpenModal: (modal: 'expense' | 'income') => void
  onNavigate?: () => void
}) {
  const { show } = useToast()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = item.action.type === 'route' && item.action.to === pathname

        if (item.action.type === 'route') {
          return (
            <Link
              key={item.key}
              to={item.action.to}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              {item.label}
            </Link>
          )
        }

        return (
          <button
            key={item.key}
            onClick={() => {
              if (item.action.type === 'modal') {
                onOpenModal(item.action.modal)
                onNavigate?.()
              } else {
                show(`${item.label} arrives in the next milestone`, 'info')
              }
            }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
