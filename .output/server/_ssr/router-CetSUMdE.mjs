import { c as createRouter, a as createRootRoute, b as createFileRoute, l as lazyRouteComponent, H as HeadContent, S as Scripts } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as TriangleAlert, I as Info, C as CircleCheck, X } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/tanstack__history.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const ToastContext = reactExports.createContext(null);
const ICONS = { success: CircleCheck, info: Info, warning: TriangleAlert };
const STYLES = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  info: "border-slate-200 bg-white text-slate-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800"
};
const ICON_COLOR = { success: "text-emerald-600", info: "text-slate-500", warning: "text-amber-600" };
function ToastProvider({ children }) {
  const [toasts, setToasts] = reactExports.useState([]);
  const show = reactExports.useCallback((message, variant = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  }, []);
  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ToastContext.Provider, { value: { show }, children: [
    children,
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-4 right-4 z-[100] flex flex-col gap-2 sm:bottom-6 sm:right-6", children: toasts.map((t) => {
      const Icon = ICONS[t.variant];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          role: "status",
          className: `animate-toast-in flex w-[calc(100vw-2rem)] max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg shadow-slate-900/5 ${STYLES[t.variant]}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `mt-0.5 h-5 w-5 shrink-0 ${ICON_COLOR[t.variant]}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "flex-1 text-sm font-medium leading-snug", children: t.message }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => dismiss(t.id),
                className: "shrink-0 rounded-full p-0.5 text-current opacity-50 transition hover:opacity-100",
                "aria-label": "Dismiss notification",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
              }
            )
          ]
        },
        t.id
      );
    }) })
  ] });
}
function useToast() {
  const ctx = reactExports.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
const API_BASE = "http://localhost:8000/api";
const AUTH_STORAGE_KEY = "dhan_auth_token";
function getAuthToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_STORAGE_KEY);
}
function setAuthToken(token) {
  if (typeof window === "undefined") return;
  {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }
}
class BackendUnavailableError extends Error {
  constructor() {
    super("Unable to connect to DHAN server.");
    this.name = "BackendUnavailableError";
  }
}
async function apiFetch(path, options = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers ?? {});
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    throw new BackendUnavailableError();
  }
  if (!response.ok) {
    let detail;
    try {
      const payload = await response.json();
      detail = payload?.message ?? payload?.detail;
    } catch {
      detail = void 0;
    }
    if (response.status === 401) {
      setAuthToken();
    }
    throw new Error(detail ?? `Request failed (${response.status})`);
  }
  if (response.status === 204) return void 0;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return void 0;
  return await response.json();
}
async function apiFetchBlob(path, options = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers ?? {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    throw new BackendUnavailableError();
  }
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.blob();
}
function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
async function fetchBusinessProfile() {
  return apiFetch("/business");
}
async function updateBusinessProfile(payload) {
  return apiFetch("/business", { method: "PUT", body: JSON.stringify(payload) });
}
async function fetchDashboardSummary() {
  return apiFetch("/dashboard/summary");
}
async function fetchDashboardCashFlow(range) {
  return apiFetch(`/dashboard/cash-flow?range=${range}`);
}
async function fetchTransactions(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== void 0 && value !== "") params.set(key, String(value));
  });
  return apiFetch(`/transactions?${params.toString()}`);
}
async function fetchTransactionList() {
  const result = await fetchTransactions({ limit: 50 });
  return result.items.map((item) => mapBackendTransaction(item)).filter(Boolean);
}
function mapBackendTransaction(item) {
  if (!item || !item.type || item.amount === void 0 || !item.date) return null;
  const amountValue = typeof item.amount === "string" ? Number(item.amount) : item.amount;
  if (!Number.isFinite(amountValue)) return null;
  return {
    id: String(item.id ?? `${item.type}-${Date.now()}`),
    type: item.type === "income" ? "income" : "expense",
    amount: amountValue,
    category: item.category ?? void 0,
    source: item.type === "income" ? item.category ?? void 0 : void 0,
    vendor: item.vendor ?? void 0,
    date: item.date,
    paymentMethod: item.payment_method ?? "Cash",
    notes: item.notes ?? void 0,
    addedVia: "manual"
  };
}
async function createTransactionRaw(payload) {
  return apiFetch("/transactions", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
async function createTransaction(payload) {
  const data = {
    type: payload.type,
    amount: payload.amount,
    description: payload.type === "income" ? payload.source ?? "Income" : payload.vendor ?? payload.category ?? "Expense",
    category: payload.category ?? (payload.type === "expense" ? "Other" : payload.source ?? "Income"),
    vendor: payload.vendor ?? (payload.type === "income" ? "Internal" : "Vendor"),
    date: payload.date,
    payment_method: payload.paymentMethod,
    notes: payload.notes ?? ""
  };
  return createTransactionRaw(data);
}
async function updateTransaction(id, payload) {
  return apiFetch(`/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}
async function deleteTransaction(id) {
  return apiFetch(`/transactions/${id}`, { method: "DELETE" });
}
async function fetchVendors(search) {
  const params = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiFetch(`/vendors${params}`);
}
async function createVendor(payload) {
  return apiFetch("/vendors", { method: "POST", body: JSON.stringify(payload) });
}
async function deleteVendor(id) {
  return apiFetch(`/vendors/${id}`, { method: "DELETE" });
}
async function fetchBudgets() {
  return apiFetch("/budgets");
}
async function createBudget(payload) {
  return apiFetch("/budgets", { method: "POST", body: JSON.stringify(payload) });
}
async function deleteBudget(id) {
  return apiFetch(`/budgets/${id}`, { method: "DELETE" });
}
async function fetchAnalyticsOverview() {
  return apiFetch("/analytics/overview");
}
async function fetchAnalyticsMonthly() {
  return apiFetch("/analytics/monthly");
}
async function fetchAnalyticsCategories() {
  return apiFetch("/analytics/categories");
}
async function fetchAnalyticsVendors() {
  return apiFetch("/analytics/vendors");
}
async function fetchCashFlowForecast(scenario = "normal") {
  return apiFetch(`/forecast/cash-flow?scenario=${scenario}`);
}
async function fetchAnomalies() {
  return apiFetch("/anomalies");
}
async function fetchCreditReadiness() {
  return apiFetch("/credit-readiness");
}
async function fetchMonthlyReport(month, year) {
  const params = new URLSearchParams();
  return apiFetch(`/reports/monthly?${params.toString()}`);
}
async function downloadMonthlyReportPdf() {
  const blob = await apiFetchBlob("/reports/monthly/pdf");
  downloadBlob(blob, "dhan-monthly-report.pdf");
}
async function downloadGstExport() {
  const blob = await apiFetchBlob("/reports/gst-export");
  downloadBlob(blob, "dhan-gst-export.csv");
}
async function fetchNotifications() {
  return apiFetch("/notifications");
}
async function markNotificationRead(id) {
  return apiFetch(`/notifications/${id}/read`, { method: "PUT" });
}
async function markAllNotificationsRead() {
  return apiFetch("/notifications/read-all", { method: "PUT" });
}
async function searchGlobal(query) {
  return apiFetch(`/search?q=${encodeURIComponent(query)}`);
}
async function uploadReceipt(file) {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch("/receipts/upload", { method: "POST", body: formData });
}
const AppStoreContext = reactExports.createContext(null);
function AppStoreProvider({ children }) {
  const [addedTransactions, setAddedTransactions] = reactExports.useState([]);
  const [summary, setSummary] = reactExports.useState({
    total_income: 0,
    total_expenses: 0,
    net_cash_flow: 0,
    business_health: 0,
    transaction_count: 0,
    current_balance: 0
  });
  const [categoryTotals, setCategoryTotals] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [offline, setOffline] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const refresh = reactExports.useCallback(async () => {
    if (!getAuthToken()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [txList, dashboardSummary, categories] = await Promise.all([
        fetchTransactionList(),
        fetchDashboardSummary(),
        fetchAnalyticsCategories()
      ]);
      setAddedTransactions(txList);
      setSummary(dashboardSummary);
      setCategoryTotals(
        categories.map((c) => ({
          category: c.category,
          amount: c.amount,
          percentage: c.percentage,
          transactionCount: c.transaction_count,
          averageTransaction: c.average_transaction
        }))
      );
      setOffline(false);
      setError(null);
    } catch (err) {
      if (err instanceof BackendUnavailableError) {
        setOffline(true);
        setError(null);
      } else {
        setOffline(false);
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, []);
  reactExports.useEffect(() => {
    refresh();
  }, []);
  const value = reactExports.useMemo(
    () => ({
      addedTransactions,
      totalIncome: summary.total_income,
      totalExpenses: summary.total_expenses,
      netCashFlow: summary.net_cash_flow,
      healthScore: summary.business_health,
      transactionCount: summary.transaction_count,
      categoryTotals,
      loading,
      offline,
      error,
      addTransaction: async (tx) => {
        await createTransaction({
          type: tx.type,
          amount: tx.amount,
          category: tx.category,
          source: tx.source,
          vendor: tx.vendor,
          date: tx.date,
          paymentMethod: tx.paymentMethod,
          notes: tx.notes
        });
        await refresh();
      },
      refresh
    }),
    [addedTransactions, summary, categoryTotals, loading, offline, error, refresh]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppStoreContext.Provider, { value, children });
}
function useAppStore() {
  const ctx = reactExports.useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
const Route$a = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        title: "DHAN — Know your money. Grow your business."
      },
      {
        name: "description",
        content: "DHAN is a premium financial management platform for Indian MSMEs — track expenses, understand cash flow and make smarter business decisions."
      }
    ]
  }),
  shellComponent: RootDocument
});
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppStoreProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ToastProvider, { children }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$9 = () => import("./vendors-CMICfQ_6.mjs");
const Route$9 = createFileRoute("/vendors")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./transactions-BfmRB-QW.mjs");
const Route$8 = createFileRoute("/transactions")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./settings-uhlI9en6.mjs");
const Route$7 = createFileRoute("/settings")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./reports-C7W7fQqA.mjs");
const Route$6 = createFileRoute("/reports")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./dashboard-B_sFIXkO.mjs");
const Route$5 = createFileRoute("/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./credit-readiness-CXRmU_MY.mjs");
const Route$4 = createFileRoute("/credit-readiness")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./cashflow-BW6cvP0W.mjs");
const Route$3 = createFileRoute("/cashflow")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./budgets-BwOWgovU.mjs");
const Route$2 = createFileRoute("/budgets")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./analytics-BFotGnwj.mjs");
const Route$1 = createFileRoute("/analytics")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-DFkMUm1K.mjs");
const Route = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const VendorsRoute = Route$9.update({
  id: "/vendors",
  path: "/vendors",
  getParentRoute: () => Route$a
});
const TransactionsRoute = Route$8.update({
  id: "/transactions",
  path: "/transactions",
  getParentRoute: () => Route$a
});
const SettingsRoute = Route$7.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => Route$a
});
const ReportsRoute = Route$6.update({
  id: "/reports",
  path: "/reports",
  getParentRoute: () => Route$a
});
const DashboardRoute = Route$5.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$a
});
const CreditReadinessRoute = Route$4.update({
  id: "/credit-readiness",
  path: "/credit-readiness",
  getParentRoute: () => Route$a
});
const CashflowRoute = Route$3.update({
  id: "/cashflow",
  path: "/cashflow",
  getParentRoute: () => Route$a
});
const BudgetsRoute = Route$2.update({
  id: "/budgets",
  path: "/budgets",
  getParentRoute: () => Route$a
});
const AnalyticsRoute = Route$1.update({
  id: "/analytics",
  path: "/analytics",
  getParentRoute: () => Route$a
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$a
});
const rootRouteChildren = {
  IndexRoute,
  AnalyticsRoute,
  BudgetsRoute,
  CashflowRoute,
  CreditReadinessRoute,
  DashboardRoute,
  ReportsRoute,
  SettingsRoute,
  TransactionsRoute,
  VendorsRoute
};
const routeTree = Route$a._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  createBudget,
  createVendor,
  deleteBudget,
  deleteTransaction,
  deleteVendor,
  downloadGstExport,
  downloadMonthlyReportPdf,
  fetchAnalyticsCategories,
  fetchAnalyticsMonthly,
  fetchAnalyticsOverview,
  fetchAnalyticsVendors,
  fetchAnomalies,
  fetchBudgets,
  fetchBusinessProfile,
  fetchCashFlowForecast,
  fetchCreditReadiness,
  fetchDashboardCashFlow,
  fetchMonthlyReport,
  fetchNotifications,
  fetchTransactions,
  fetchVendors,
  getAuthToken,
  markAllNotificationsRead,
  markNotificationRead,
  router,
  searchGlobal,
  setAuthToken,
  updateBusinessProfile,
  updateTransaction,
  uploadReceipt,
  useAppStore,
  useToast
};
