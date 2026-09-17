import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, d as useRouterState, L as Link } from "../_libs/tanstack__react-router.mjs";
import { getAuthToken, useToast, fetchNotifications, searchGlobal, markAllNotificationsRead, markNotificationRead, useAppStore, setAuthToken, uploadReceipt } from "./router-CetSUMdE.mjs";
import { r as reactDomExports } from "../_libs/react-dom.mjs";
import { L as LayoutDashboard, R as Receipt, e as CircleMinus, f as CirclePlus, g as ChartColumn, A as Activity, h as ShieldCheck, c as Store, i as Target, F as FileText, j as Settings, k as CircleQuestionMark, l as LogOut, m as Menu, S as Search, n as LoaderCircle, B as Bell, P as Plus, o as ChevronDown, X, W as WifiOff, T as TriangleAlert, p as Inbox, q as CloudUpload, r as FileImage, C as CircleCheck } from "../_libs/lucide-react.mjs";
function Logo({ className = "", mark = true, size = "md" }) {
  const textSize = size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-2xl";
  const markSize = size === "lg" ? "h-10 w-10 text-lg" : size === "sm" ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-2.5 ${className}`, children: [
    mark && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `flex ${markSize} items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 font-bold text-white shadow-sm shadow-emerald-900/20`,
        children: "₹"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${textSize} font-bold tracking-tight text-slate-900`, children: "DHAN" })
  ] });
}
const NAV_ITEMS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard, action: { type: "route", to: "/dashboard" } },
  { key: "transactions", label: "Transactions", icon: Receipt, action: { type: "route", to: "/transactions" } },
  { key: "add-expense", label: "Add Expense", icon: CircleMinus, action: { type: "modal", modal: "expense" } },
  { key: "add-income", label: "Add Income", icon: CirclePlus, action: { type: "modal", modal: "income" } },
  { key: "analytics", label: "Analytics", icon: ChartColumn, action: { type: "route", to: "/analytics" } },
  { key: "cashflow", label: "Cash Flow", icon: Activity, action: { type: "route", to: "/cashflow" } },
  { key: "credit", label: "Credit Readiness", icon: ShieldCheck, action: { type: "route", to: "/credit-readiness" } },
  { key: "vendors", label: "Vendors", icon: Store, action: { type: "route", to: "/vendors" } },
  { key: "budgets", label: "Budgets", icon: Target, action: { type: "route", to: "/budgets" } },
  { key: "reports", label: "Reports", icon: FileText, action: { type: "route", to: "/reports" } },
  { key: "settings", label: "Settings", icon: Settings, action: { type: "route", to: "/settings" } }
];
const BOTTOM_NAV_ITEMS = [{ key: "help", label: "Help", icon: CircleQuestionMark, action: { type: "soon" } }];
function NavList({
  items,
  onOpenModal,
  onNavigate
}) {
  const { show } = useToast();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex flex-col gap-1", children: items.map((item) => {
    const Icon = item.icon;
    const isActive = item.action.type === "route" && item.action.to === pathname;
    if (item.action.type === "route") {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: item.action.to,
          onClick: onNavigate,
          className: `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-[18px] w-[18px]", strokeWidth: 2 }),
            item.label
          ]
        },
        item.key
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => {
          if (item.action.type === "modal") {
            onOpenModal(item.action.modal);
            onNavigate?.();
          } else {
            show(`${item.label} arrives in the next milestone`, "info");
          }
        },
        className: "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-[18px] w-[18px]", strokeWidth: 2 }),
          item.label
        ]
      },
      item.key
    );
  }) });
}
const EXPENSE_CATEGORIES = [
  "Rent",
  "Salary",
  "Raw Material",
  "Electricity",
  "Transport",
  "Marketing",
  "Office",
  "Other"
];
const INCOME_SOURCES = ["Sales", "Online Orders", "Wholesale", "Services", "Other"];
const PAYMENT_METHODS = ["Cash", "UPI", "Bank Transfer", "Card", "Cheque"];
const BUSINESS_PROFILE = {
  name: "Sharma Traders",
  ownerGreetingName: "Sharma Traders",
  type: "Retail"
};
const SPENDING_BREAKDOWN = [
  { category: "Raw Material", amount: 54e3, topVendor: "ABC Suppliers", transactions: 6, trend: "up" },
  { category: "Salary", amount: 24e3, topVendor: "Payroll", transactions: 4, trend: "flat" },
  { category: "Transport", amount: 18400, topVendor: "City Transport Co.", transactions: 9, trend: "up" },
  { category: "Electricity", amount: 17900, topVendor: "Metro Electricity Board", transactions: 1, trend: "up" },
  { category: "Rent", amount: 12e3, topVendor: "Property Owner", transactions: 1, trend: "flat" },
  { category: "Marketing", amount: 4600, topVendor: "Local Print Media", transactions: 3, trend: "down" },
  { category: "Office", amount: 0, topVendor: "—", transactions: 0, trend: "flat" },
  { category: "Other", amount: 1500, topVendor: "Misc.", transactions: 2, trend: "flat" }
];
const VENDORS = [
  { name: "ABC Suppliers", totalSpend: 42500, transactions: 7, lastTransaction: "2026-09-14", trend: "up" },
  { name: "Metro Electricity Board", totalSpend: 17900, transactions: 1, lastTransaction: "2026-09-10", trend: "up" },
  { name: "City Transport Co.", totalSpend: 14800, transactions: 9, lastTransaction: "2026-09-15", trend: "up" },
  { name: "Reliance Retail", totalSpend: 4850, transactions: 1, lastTransaction: "2026-09-16", trend: "flat" }
];
[
  ...SPENDING_BREAKDOWN.map((c) => ({ label: c.category, type: "Category", meta: `₹${c.amount.toLocaleString("en-IN")} this period` })),
  ...VENDORS.map((v) => ({ label: v.name, type: "Vendor", meta: `₹${v.totalSpend.toLocaleString("en-IN")} total spend` })),
  ...INCOME_SOURCES.map((s) => ({ label: s, type: "Income Source" }))
];
function wave(i, base, amplitude, freq, phase, trend) {
  return Math.round(base + amplitude * Math.sin(i * freq + phase) + trend * i);
}
function buildDaily(days) {
  const points = [];
  const anchor = /* @__PURE__ */ new Date("2026-09-17T00:00:00");
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(anchor);
    d.setDate(d.getDate() - i);
    const idx = days - i;
    const income = Math.max(3200, wave(idx, 8200, 3400, 0.55, 0.6, 40));
    const expenses = Math.max(1800, wave(idx, 4400, 1600, 0.48, 1.4, 18));
    points.push({
      label: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      income,
      expenses,
      net: income - expenses
    });
  }
  return points;
}
buildDaily(30);
function Sidebar({ onOpenModal }) {
  const navigate = useNavigate();
  function handleLogout() {
    setAuthToken();
    navigate({ to: "/" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-500" }),
        "Demo Mode"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-3 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(NavList, { items: NAV_ITEMS, onOpenModal }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-slate-100 px-3 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(NavList, { items: BOTTOM_NAV_ITEMS, onOpenModal }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-white", children: "ST" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-semibold text-slate-800", children: BUSINESS_PROFILE.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs text-slate-400", children: BUSINESS_PROFILE.type })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleLogout,
            className: "shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700",
            "aria-label": "Log out",
            title: "Log out",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" })
          }
        )
      ] })
    ] })
  ] });
}
function useClickOutside(ref, onOutside) {
  reactExports.useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onOutside();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside]);
}
function Topbar({
  onOpenModal,
  onOpenMobileMenu
}) {
  const { show } = useToast();
  const navigate = useNavigate();
  const [query, setQuery] = reactExports.useState("");
  const [searchOpen, setSearchOpen] = reactExports.useState(false);
  const [searching, setSearching] = reactExports.useState(false);
  const [results, setResults] = reactExports.useState([]);
  const [notifOpen, setNotifOpen] = reactExports.useState(false);
  const [notifications, setNotifications] = reactExports.useState([]);
  const [addMenuOpen, setAddMenuOpen] = reactExports.useState(false);
  const searchRef = reactExports.useRef(null);
  const notifRef = reactExports.useRef(null);
  const addRef = reactExports.useRef(null);
  useClickOutside(searchRef, () => setSearchOpen(false));
  useClickOutside(notifRef, () => setNotifOpen(false));
  useClickOutside(addRef, () => setAddMenuOpen(false));
  reactExports.useEffect(() => {
    fetchNotifications().then((res) => setNotifications(res.items)).catch(() => void 0);
  }, []);
  reactExports.useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }
    setSearching(true);
    const t = setTimeout(() => {
      searchGlobal(q).then((res) => setResults(res.results)).catch(() => setResults([])).finally(() => setSearching(false));
    }, 250);
    return () => clearTimeout(t);
  }, [query]);
  const unreadCount = notifications.filter((n) => !n.read).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-sm sm:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onOpenMobileMenu,
        className: "rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden",
        "aria-label": "Open menu",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: searchRef, className: "relative hidden max-w-xs flex-1 sm:block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          value: query,
          onChange: (e) => {
            setQuery(e.target.value);
            setSearchOpen(true);
          },
          onFocus: () => setSearchOpen(true),
          placeholder: "Search transactions, vendors, categories…",
          className: "w-full rounded-xl border border-slate-200 bg-stone-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        }
      ),
      searchOpen && query.trim() && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-fade-in absolute left-0 top-full z-40 mt-2 w-full min-w-[280px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10", children: searching ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center justify-center gap-2 px-3 py-4 text-center text-sm text-slate-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }),
        " Searching…"
      ] }) : results.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "px-3 py-4 text-center text-sm text-slate-400", children: [
        'No matches for "',
        query,
        '"'
      ] }) : results.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
            setSearchOpen(false);
            setQuery("");
            if (r.type === "Transaction") navigate({ to: "/transactions" });
            else if (r.type === "Vendor") navigate({ to: "/vendors" });
            else navigate({ to: "/analytics" });
          },
          className: "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-stone-50",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-800", children: r.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400", children: r.meta ?? r.type })
          ]
        },
        r.type + r.label + r.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: notifRef, className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setNotifOpen((v) => !v),
          className: "relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100",
          "aria-label": "Notifications",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5" }),
            unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" })
          ]
        }
      ),
      notifOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in absolute right-0 top-full z-40 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-slate-800", children: "Notifications" }),
          unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                markAllNotificationsRead().then(() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))).catch(() => show("Could not update notifications", "warning"));
              },
              className: "text-xs font-medium text-emerald-600 hover:underline",
              children: "Mark all read"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-72 overflow-y-auto", children: notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-3 py-6 text-center text-sm text-slate-400", children: "You're all caught up" }) : notifications.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              if (!n.read) {
                markNotificationRead(n.id).then(() => setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))).catch(() => void 0);
              }
            },
            className: "flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left hover:bg-stone-50",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.read ? "bg-transparent" : "bg-emerald-500"}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm ${n.read ? "text-slate-500" : "font-medium text-slate-800"}`, children: n.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: n.message })
              ] })
            ]
          },
          n.id
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden items-center gap-2 rounded-xl border border-slate-200 px-2.5 py-1.5 sm:flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-white", children: "ST" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-700", children: BUSINESS_PROFILE.name })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: addRef, className: "relative flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => onOpenModal("expense"),
          className: "flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-900/15 transition hover:shadow-md active:scale-[0.98] sm:px-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Add Transaction" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setAddMenuOpen((v) => !v),
          className: "ml-0.5 flex items-center rounded-xl bg-emerald-700/90 px-1.5 text-white transition hover:bg-emerald-800",
          "aria-label": "Choose transaction type",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
        }
      ),
      addMenuOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in absolute right-0 top-full z-40 mt-2 w-44 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              onOpenModal("expense");
              setAddMenuOpen(false);
            },
            className: "block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-stone-50",
            children: "Add Expense"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              onOpenModal("income");
              setAddMenuOpen(false);
            },
            className: "block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-stone-50",
            children: "Add Income"
          }
        )
      ] })
    ] })
  ] });
}
function MobileNav({
  onOpenModal,
  drawerOpen,
  onDrawerChange
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur-sm lg:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(NavLinkButton, { to: "/dashboard", icon: LayoutDashboard, label: "Overview", active: pathname === "/dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(NavLinkButton, { to: "/transactions", icon: Receipt, label: "Transactions", active: pathname === "/transactions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => onOpenModal("expense"),
          className: "-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-900/25 transition active:scale-95",
          "aria-label": "Add transaction",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-6 w-6" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(NavLinkButton, { to: "/analytics", icon: ChartColumn, label: "Analytics", active: pathname === "/analytics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(NavIconButton, { icon: Menu, label: "Menu", onClick: () => onDrawerChange(true) })
    ] }),
    drawerOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 lg:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-fade-in absolute inset-0 bg-slate-900/40", onClick: () => onDrawerChange(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-slide-in-right absolute right-0 top-0 flex h-full w-72 flex-col bg-white shadow-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { size: "sm" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onDrawerChange(false), className: "rounded-full p-2 text-slate-400 hover:bg-slate-100", "aria-label": "Close menu", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(NavList, { items: NAV_ITEMS, onOpenModal, onNavigate: () => onDrawerChange(false) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-slate-100 px-3 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(NavList, { items: BOTTOM_NAV_ITEMS, onOpenModal, onNavigate: () => onDrawerChange(false) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-white", children: "ST" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-semibold text-slate-800", children: BUSINESS_PROFILE.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs text-slate-400", children: BUSINESS_PROFILE.type })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function NavLinkButton({ to, icon: Icon, label, active }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, className: `flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium ${active ? "text-emerald-700" : "text-slate-400"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5", strokeWidth: active ? 2.4 : 2 }),
    label
  ] });
}
function NavIconButton({
  icon: Icon,
  label,
  onClick,
  active
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick, className: `flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium ${active ? "text-emerald-700" : "text-slate-400"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5", strokeWidth: active ? 2.4 : 2 }),
    label
  ] });
}
function Modal({ open, onClose, title, subtitle, children, maxWidth = "max-w-lg" }) {
  reactExports.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open || typeof document === "undefined") return null;
  return reactDomExports.createPortal(
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[90] flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "animate-fade-in absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]",
          onClick: onClose,
          "aria-hidden": "true"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `animate-modal-in relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 sm:p-8`,
          role: "dialog",
          "aria-modal": "true",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-slate-900", children: title }),
                subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-500", children: subtitle })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: onClose,
                  className: "shrink-0 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600",
                  "aria-label": "Close",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
                }
              )
            ] }),
            children
          ]
        }
      )
    ] }),
    document.body
  );
}
function LoadingCard({ label = "Loading…" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-emerald-600" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm font-medium text-slate-500", children: label })
  ] });
}
function ErrorCard({ message, offline, onRetry }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 p-12 text-center", children: [
    offline ? /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "h-6 w-6 text-rose-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-6 w-6 text-rose-500" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm font-semibold text-rose-700", children: offline ? "Unable to connect to DHAN server." : "Something went wrong" }),
    message && !offline && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 max-w-sm text-xs text-rose-500", children: message }),
    onRetry && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onRetry,
        className: "mt-4 rounded-xl border border-rose-300 bg-white px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100",
        children: "Try again"
      }
    )
  ] });
}
function EmptyCard({ label, hint }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-stone-50 p-12 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { className: "h-6 w-6 text-slate-300" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm font-semibold text-slate-600", children: label }),
    hint && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-slate-400", children: hint })
  ] });
}
function isOfflineError(err) {
  return err instanceof Error && err.name === "BackendUnavailableError";
}
const SCAN_STEPS = ["Uploading receipt…", "Reading amount…", "Detecting vendor…", "Categorizing expense…"];
const today$2 = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
function ReceiptUploader({ onDone }) {
  const { addTransaction } = useAppStore();
  const { show } = useToast();
  const [phase, setPhase] = reactExports.useState("idle");
  const [stepIndex, setStepIndex] = reactExports.useState(0);
  const [dragging, setDragging] = reactExports.useState(false);
  const [fileName, setFileName] = reactExports.useState("");
  const [ocrUnavailable, setOcrUnavailable] = reactExports.useState(false);
  const inputRef = reactExports.useRef(null);
  const [vendor, setVendor] = reactExports.useState("");
  const [amount, setAmount] = reactExports.useState("");
  const [date, setDate] = reactExports.useState(today$2());
  const [category, setCategory] = reactExports.useState("");
  const [paymentMethod, setPaymentMethod] = reactExports.useState(PAYMENT_METHODS[0]);
  reactExports.useEffect(() => {
    if (phase !== "scanning") return;
    if (stepIndex >= SCAN_STEPS.length - 1) return;
    const t = setTimeout(() => setStepIndex((i) => i + 1), 500);
    return () => clearTimeout(t);
  }, [phase, stepIndex]);
  async function startScan(file) {
    setFileName(file.name);
    setStepIndex(0);
    setOcrUnavailable(false);
    setPhase("scanning");
    try {
      const result = await uploadReceipt(file);
      setStepIndex(SCAN_STEPS.length - 1);
      if (result.status === "ocr_unavailable") {
        setOcrUnavailable(true);
        setVendor("");
        setAmount("");
        setDate(today$2());
        setCategory("");
      } else {
        setVendor(result.vendor ?? "");
        setAmount(result.amount ? String(result.amount) : "");
        setDate(result.date ?? today$2());
        setCategory(result.category ?? "");
      }
      setTimeout(() => setPhase("review"), 400);
    } catch (err) {
      if (isOfflineError(err)) {
        show("Unable to connect to DHAN server.", "warning");
      } else {
        show(err instanceof Error ? err.message : "Could not process receipt", "warning");
      }
      setPhase("idle");
    }
  }
  function handleFiles(files) {
    const file = files?.[0];
    if (!file) return;
    startScan(file);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0 || !category) return;
    try {
      await addTransaction({ type: "expense", amount: value, category, vendor, date, paymentMethod, addedVia: "receipt" });
      show("Expense added successfully", "success");
      onDone();
    } catch (err) {
      show(isOfflineError(err) ? "Unable to connect to DHAN server." : err instanceof Error ? err.message : "Could not save expense", "warning");
    }
  }
  if (phase === "idle") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        onDragOver: (e) => {
          e.preventDefault();
          setDragging(true);
        },
        onDragLeave: () => setDragging(false),
        onDrop: (e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        },
        onClick: () => inputRef.current?.click(),
        className: `flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors ${dragging ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-stone-50 hover:border-emerald-300 hover:bg-emerald-50/40"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: inputRef,
              type: "file",
              accept: "image/*,.pdf",
              className: "hidden",
              onChange: (e) => handleFiles(e.target.files)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, { className: "h-6 w-6 text-emerald-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-slate-700", children: "Drag & drop a receipt, or click to browse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-slate-400", children: "Supports JPG, PNG or PDF — up to 5MB" })
        ]
      }
    );
  }
  if (phase === "scanning") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-stone-50 px-6 py-14 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileImage, { className: "h-6 w-6 text-slate-400" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1 text-xs font-medium text-slate-400", children: fileName || "receipt.jpg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-2.5", children: SCAN_STEPS.map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 text-sm", children: [
        i < stepIndex ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-500" }) : i === stepIndex ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin text-emerald-600" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 rounded-full border-2 border-slate-200" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: i <= stepIndex ? "font-medium text-slate-700" : "text-slate-300", children: step })
      ] }, step)) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
    ocrUnavailable ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm font-medium text-amber-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
      "Automatic text extraction isn't available right now — please fill in the details manually."
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm font-medium text-emerald-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
      "Receipt scanned — review and confirm the details below"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: "Vendor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: vendor, onChange: (e) => setVendor(e.target.value), className: "input" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: "Amount (₹)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1, value: amount, onChange: (e) => setAmount(e.target.value), className: "input" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: date, onChange: (e) => setDate(e.target.value), className: "input" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: category, onChange: (e) => setCategory(e.target.value), className: "input", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: "Select category" }),
          EXPENSE_CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: "Payment method" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: paymentMethod, onChange: (e) => setPaymentMethod(e.target.value), className: "input", children: PAYMENT_METHODS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: m, children: m }, m)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "submit",
        className: "mt-2 w-full rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-900/15 transition hover:shadow-md active:scale-[0.99]",
        children: "Save Expense"
      }
    )
  ] });
}
const today$1 = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
function AddExpenseModal({ open, onClose }) {
  const [tab, setTab] = reactExports.useState("manual");
  const { addTransaction } = useAppStore();
  const { show } = useToast();
  const [amount, setAmount] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("");
  const [vendor, setVendor] = reactExports.useState("");
  const [date, setDate] = reactExports.useState(today$1());
  const [paymentMethod, setPaymentMethod] = reactExports.useState(PAYMENT_METHODS[0]);
  const [notes, setNotes] = reactExports.useState("");
  function reset() {
    setAmount("");
    setCategory("");
    setVendor("");
    setDate(today$1());
    setPaymentMethod(PAYMENT_METHODS[0]);
    setNotes("");
    setTab("manual");
  }
  function handleClose() {
    reset();
    onClose();
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0 || !category) return;
    try {
      await addTransaction({ type: "expense", amount: value, category, vendor: vendor || "Unnamed vendor", date, paymentMethod, notes, addedVia: "manual" });
      show("Expense added successfully", "success");
      handleClose();
    } catch (err) {
      show(isOfflineError(err) ? "Unable to connect to DHAN server." : err instanceof Error ? err.message : "Could not save expense", "warning");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Modal, { open, onClose: handleClose, title: "Add Expense", subtitle: "Log a business expense in a few seconds", maxWidth: "max-w-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-5 flex gap-1 rounded-xl bg-stone-100 p-1", children: ["manual", "receipt"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setTab(t),
        className: `flex-1 rounded-lg py-2 text-sm font-semibold transition ${tab === t ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500"}`,
        children: t === "manual" ? "Manual Entry" : "Upload Receipt"
      },
      t
    )) }),
    tab === "manual" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Amount (₹)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            required: true,
            min: 1,
            value: amount,
            onChange: (e) => setAmount(e.target.value),
            placeholder: "0.00",
            className: "input"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Category", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { required: true, value: category, onChange: (e) => setCategory(e.target.value), className: "input", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: "Select category" }),
          EXPENSE_CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Vendor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: vendor, onChange: (e) => setVendor(e.target.value), placeholder: "e.g. ABC Suppliers", className: "input" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Date", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", required: true, value: date, onChange: (e) => setDate(e.target.value), className: "input" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Payment method", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: paymentMethod, onChange: (e) => setPaymentMethod(e.target.value), className: "input", children: PAYMENT_METHODS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: m, children: m }, m)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Notes (optional)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), rows: 2, placeholder: "Add any details…", className: "input resize-none" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          className: "mt-2 w-full rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-900/15 transition hover:shadow-md active:scale-[0.99]",
          children: "Save Expense"
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ReceiptUploader, { onDone: handleClose })
  ] });
}
function Field({ label, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: label }),
    children
  ] });
}
const today = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
function AddIncomeModal({ open, onClose }) {
  const { addTransaction } = useAppStore();
  const { show } = useToast();
  const [amount, setAmount] = reactExports.useState("");
  const [source, setSource] = reactExports.useState("");
  const [date, setDate] = reactExports.useState(today());
  const [paymentMethod, setPaymentMethod] = reactExports.useState(PAYMENT_METHODS[0]);
  const [notes, setNotes] = reactExports.useState("");
  function reset() {
    setAmount("");
    setSource("");
    setDate(today());
    setPaymentMethod(PAYMENT_METHODS[0]);
    setNotes("");
  }
  function handleClose() {
    reset();
    onClose();
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0 || !source) return;
    try {
      await addTransaction({ type: "income", amount: value, source, date, paymentMethod, notes, addedVia: "manual" });
      show("Income added successfully", "success");
      handleClose();
    } catch (err) {
      show(isOfflineError(err) ? "Unable to connect to DHAN server." : err instanceof Error ? err.message : "Could not save income", "warning");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open, onClose: handleClose, title: "Add Income", subtitle: "Record money coming into your business", maxWidth: "max-w-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: "Amount (₹)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", required: true, min: 1, value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "0.00", className: "input" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: "Source" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { required: true, value: source, onChange: (e) => setSource(e.target.value), className: "input", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: "Select source" }),
          INCOME_SOURCES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", required: true, value: date, onChange: (e) => setDate(e.target.value), className: "input" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: "Payment method" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: paymentMethod, onChange: (e) => setPaymentMethod(e.target.value), className: "input", children: PAYMENT_METHODS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: m, children: m }, m)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: "Notes (optional)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), rows: 2, placeholder: "Add any details…", className: "input resize-none" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "submit",
        className: "mt-2 w-full rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-900/15 transition hover:shadow-md active:scale-[0.99]",
        children: "Save Income"
      }
    )
  ] }) });
}
function DashboardShell({ children }) {
  const [modal, setModal] = reactExports.useState(null);
  const [drawerOpen, setDrawerOpen] = reactExports.useState(false);
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!getAuthToken()) {
      navigate({ to: "/" });
    }
  }, [navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen bg-stone-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, { onOpenModal: setModal }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-1 flex-col overflow-x-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, { onOpenModal: setModal, onOpenMobileMenu: () => setDrawerOpen(true) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-10", children })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MobileNav, { onOpenModal: setModal, drawerOpen, onDrawerChange: setDrawerOpen }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AddExpenseModal, { open: modal === "expense", onClose: () => setModal(null) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AddIncomeModal, { open: modal === "income", onClose: () => setModal(null) })
  ] });
}
export {
  BUSINESS_PROFILE as B,
  DashboardShell as D,
  ErrorCard as E,
  INCOME_SOURCES as I,
  LoadingCard as L,
  Modal as M,
  PAYMENT_METHODS as P,
  EmptyCard as a,
  EXPENSE_CATEGORIES as b,
  isOfflineError as i
};
