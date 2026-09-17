import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { D as DashboardShell, L as LoadingCard, E as ErrorCard, a as EmptyCard, i as isOfflineError } from "./DashboardShell-DroH9zDJ.mjs";
import { fetchAnalyticsOverview, fetchAnalyticsMonthly, fetchAnalyticsCategories, fetchAnalyticsVendors } from "./router-CetSUMdE.mjs";
import { f as formatINR, a as formatCompactINR } from "./format-X1RxzObn.mjs";
import "../_libs/react-dom.mjs";
import { b as TrendingUp, a as TrendingDown, K as ChartPie, c as Store } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, B as BarChart, a as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, e as Legend, f as Bar } from "../_libs/recharts.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/tanstack__history.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/clsx.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/reselect.mjs";
import "../_libs/es-toolkit.mjs";
import "../_libs/react-is.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/reduxjs__toolkit.mjs";
import "../_libs/redux.mjs";
import "../_libs/immer.mjs";
import "../_libs/redux-thunk.mjs";
import "../_libs/react-redux.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
function AnalyticsPage() {
  const [overview, setOverview] = reactExports.useState(null);
  const [monthly, setMonthly] = reactExports.useState([]);
  const [categories, setCategories] = reactExports.useState([]);
  const [vendors, setVendors] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [offline, setOffline] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  function load() {
    setLoading(true);
    Promise.all([fetchAnalyticsOverview(), fetchAnalyticsMonthly(), fetchAnalyticsCategories(), fetchAnalyticsVendors()]).then(([o, m, c, v]) => {
      setOverview(o);
      setMonthly(m);
      setCategories(c);
      setVendors(v);
      setOffline(false);
      setError(null);
    }).catch((err) => {
      if (isOfflineError(err)) setOffline(true);
      else setError(err instanceof Error ? err.message : "Failed to load analytics");
    }).finally(() => setLoading(false));
  }
  reactExports.useEffect(load, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-slate-900 sm:text-3xl", children: "Analytics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-500", children: "Trends and breakdowns calculated from your real transaction data." })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingCard, { label: "Crunching the numbers…" }) : offline ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorCard, { offline: true, onRetry: load }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorCard, { message: error, onRetry: load }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      overview && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Profit margin", value: `${overview.profit_margin}%`, icon: overview.profit_margin >= 0 ? TrendingUp : TrendingDown }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Avg monthly expense", value: formatINR(overview.average_monthly_expense), icon: TrendingDown }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Revenue trend", value: `${overview.revenue_trend > 0 ? "+" : ""}${overview.revenue_trend}%`, icon: TrendingUp }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Top expense category", value: overview.highest_expense_category ?? "—", icon: ChartPie })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-4 text-base font-semibold text-slate-900", children: "Income vs Expenses — last 12 months" }),
        monthly.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyCard, { label: "Not enough data yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: monthly, margin: { top: 5, right: 8, left: -12, bottom: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#eef0f2", vertical: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "label", tick: { fontSize: 11, fill: "#94a3b8" }, axisLine: false, tickLine: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: { fontSize: 11, fill: "#94a3b8" }, axisLine: false, tickLine: false, tickFormatter: (v) => formatCompactINR(v), width: 56 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (v) => formatINR(v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { wrapperStyle: { fontSize: 12 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "income", fill: "#10b981", radius: [4, 4, 0, 0], name: "Income" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "expenses", fill: "#94a3b8", radius: [4, 4, 0, 0], name: "Expenses" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-4 text-base font-semibold text-slate-900", children: "Category breakdown" }),
          categories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyCard, { label: "No expense categories yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-stone-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-sm font-medium text-slate-700", children: c.category }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-400", children: [
              c.transaction_count,
              " txns"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-24 shrink-0 text-right text-sm font-semibold text-slate-800", children: formatINR(c.amount) })
          ] }, c.category)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "mb-4 flex items-center gap-2 text-base font-semibold text-slate-900", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-4 w-4 text-emerald-600" }),
            " Vendor spending"
          ] }),
          vendors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyCard, { label: "No vendor spending yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: vendors.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-stone-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-sm font-medium text-slate-700", children: v.vendor }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-400", children: [
              v.transaction_count,
              " txns"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-24 shrink-0 text-right text-sm font-semibold text-slate-800", children: formatINR(v.amount) })
          ] }, v.vendor)) })
        ] })
      ] }),
      overview && overview.insights.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-3 text-base font-semibold text-slate-900", children: "Insights" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 text-sm text-slate-600", children: overview.insights.map((line, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" }),
          line
        ] }, i)) })
      ] })
    ] })
  ] });
}
function StatCard({ label, value, icon: Icon }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-[18px] w-[18px]", strokeWidth: 2.2 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-500", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 truncate text-xl font-bold text-slate-900", children: value })
  ] });
}
function Page() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnalyticsPage, {}) });
}
export {
  Page as component
};
