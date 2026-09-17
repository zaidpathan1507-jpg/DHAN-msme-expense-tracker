import {
  LayoutDashboard,
  Receipt,
  MinusCircle,
  PlusCircle,
  BarChart3,
  Activity,
  Store,
  Target,
  FileText,
  Settings,
  HelpCircle,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

export type NavAction =
  | { type: 'route'; to: string }
  | { type: 'modal'; modal: 'expense' | 'income' }
  | { type: 'soon' }

export interface NavItem {
  key: string
  label: string
  icon: LucideIcon
  action: NavAction
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard, action: { type: 'route', to: '/dashboard' } },
  { key: 'transactions', label: 'Transactions', icon: Receipt, action: { type: 'route', to: '/transactions' } },
  { key: 'add-expense', label: 'Add Expense', icon: MinusCircle, action: { type: 'modal', modal: 'expense' } },
  { key: 'add-income', label: 'Add Income', icon: PlusCircle, action: { type: 'modal', modal: 'income' } },
  { key: 'analytics', label: 'Analytics', icon: BarChart3, action: { type: 'route', to: '/analytics' } },
  { key: 'cashflow', label: 'Cash Flow', icon: Activity, action: { type: 'route', to: '/cashflow' } },
  { key: 'credit', label: 'Credit Readiness', icon: ShieldCheck, action: { type: 'route', to: '/credit-readiness' } },
  { key: 'vendors', label: 'Vendors', icon: Store, action: { type: 'route', to: '/vendors' } },
  { key: 'budgets', label: 'Budgets', icon: Target, action: { type: 'route', to: '/budgets' } },
  { key: 'reports', label: 'Reports', icon: FileText, action: { type: 'route', to: '/reports' } },
  { key: 'settings', label: 'Settings', icon: Settings, action: { type: 'route', to: '/settings' } },
]

export const BOTTOM_NAV_ITEMS: NavItem[] = [{ key: 'help', label: 'Help', icon: HelpCircle, action: { type: 'soon' } }]
