import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search, Bell, ChevronDown, Plus, Menu, Loader2 } from 'lucide-react'
import { useClickOutside } from '@/lib/useClickOutside'
import { useToast } from '@/components/ui/Toast'
import { BUSINESS_PROFILE } from '@/data/fixtures'
import { searchGlobal, fetchNotifications, markNotificationRead, markAllNotificationsRead, type SearchResult, type NotificationItem } from '@/lib/api'

export function Topbar({
  onOpenModal,
  onOpenMobileMenu,
}: {
  onOpenModal: (modal: 'expense' | 'income') => void
  onOpenMobileMenu: () => void
}) {
  const { show } = useToast()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [addMenuOpen, setAddMenuOpen] = useState(false)

  const searchRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const addRef = useRef<HTMLDivElement>(null)

  useClickOutside(searchRef, () => setSearchOpen(false))
  useClickOutside(notifRef, () => setNotifOpen(false))
  useClickOutside(addRef, () => setAddMenuOpen(false))

  useEffect(() => {
    fetchNotifications()
      .then((res) => setNotifications(res.items))
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    const q = query.trim()
    if (!q) {
      setResults([])
      return
    }
    setSearching(true)
    const t = setTimeout(() => {
      searchGlobal(q)
        .then((res) => setResults(res.results))
        .catch(() => setResults([]))
        .finally(() => setSearching(false))
    }, 250)
    return () => clearTimeout(t)
  }, [query])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-sm sm:px-6">
      <button
        onClick={onOpenMobileMenu}
        className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div ref={searchRef} className="relative hidden max-w-xs flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSearchOpen(true)
          }}
          onFocus={() => setSearchOpen(true)}
          placeholder="Search transactions, vendors, categories…"
          className="w-full rounded-xl border border-slate-200 bg-stone-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        />
        {searchOpen && query.trim() && (
          <div className="animate-fade-in absolute left-0 top-full z-40 mt-2 w-full min-w-[280px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
            {searching ? (
              <p className="flex items-center justify-center gap-2 px-3 py-4 text-center text-sm text-slate-400">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Searching…
              </p>
            ) : results.length === 0 ? (
              <p className="px-3 py-4 text-center text-sm text-slate-400">No matches for "{query}"</p>
            ) : (
              results.map((r) => (
                <button
                  key={r.type + r.label + r.id}
                  onClick={() => {
                    setSearchOpen(false)
                    setQuery('')
                    if (r.type === 'Transaction') navigate({ to: '/transactions' })
                    else if (r.type === 'Vendor') navigate({ to: '/vendors' })
                    else navigate({ to: '/analytics' })
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-stone-50"
                >
                  <span className="font-medium text-slate-800">{r.label}</span>
                  <span className="text-xs text-slate-400">{r.meta ?? r.type}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="flex-1" />

      <div ref={notifRef} className="relative">
        <button
          onClick={() => setNotifOpen((v) => !v)}
          className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          )}
        </button>
        {notifOpen && (
          <div className="animate-fade-in absolute right-0 top-full z-40 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
            <div className="flex items-center justify-between px-3 py-2">
              <p className="text-sm font-semibold text-slate-800">Notifications</p>
              {unreadCount > 0 && (
                <button
                  onClick={() => {
                    markAllNotificationsRead()
                      .then(() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))))
                      .catch(() => show('Could not update notifications', 'warning'))
                  }}
                  className="text-xs font-medium text-emerald-600 hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-slate-400">You're all caught up</p>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      if (!n.read) {
                        markNotificationRead(n.id)
                          .then(() => setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x))))
                          .catch(() => undefined)
                      }
                    }}
                    className="flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left hover:bg-stone-50"
                  >
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.read ? 'bg-transparent' : 'bg-emerald-500'}`} />
                    <span>
                      <p className={`text-sm ${n.read ? 'text-slate-500' : 'font-medium text-slate-800'}`}>{n.title}</p>
                      <p className="text-xs text-slate-400">{n.message}</p>
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div className="hidden items-center gap-2 rounded-xl border border-slate-200 px-2.5 py-1.5 sm:flex">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-white">ST</div>
        <span className="text-sm font-medium text-slate-700">{BUSINESS_PROFILE.name}</span>
      </div>

      <div ref={addRef} className="relative flex">
        <button
          onClick={() => onOpenModal('expense')}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-900/15 transition hover:shadow-md active:scale-[0.98] sm:px-4"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Transaction</span>
        </button>
        <button
          onClick={() => setAddMenuOpen((v) => !v)}
          className="ml-0.5 flex items-center rounded-xl bg-emerald-700/90 px-1.5 text-white transition hover:bg-emerald-800"
          aria-label="Choose transaction type"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
        {addMenuOpen && (
          <div className="animate-fade-in absolute right-0 top-full z-40 mt-2 w-44 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10">
            <button
              onClick={() => {
                onOpenModal('expense')
                setAddMenuOpen(false)
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-stone-50"
            >
              Add Expense
            </button>
            <button
              onClick={() => {
                onOpenModal('income')
                setAddMenuOpen(false)
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-stone-50"
            >
              Add Income
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
