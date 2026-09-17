import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { D as DashboardShell, L as LoadingCard, E as ErrorCard, i as isOfflineError } from "./DashboardShell-DroH9zDJ.mjs";
import { fetchCashFlowForecast } from "./router-CetSUMdE.mjs";
import { a as formatCompactINR, f as formatINR } from "./format-X1RxzObn.mjs";
import "../_libs/react-dom.mjs";
import { I as Info } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, C as ComposedChart, a as CartesianGrid, X as XAxis, Y as YAxis, d as ReferenceLine, T as Tooltip, L as Line, A as Area } from "../_libs/recharts.mjs";
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
const SCENARIOS = [
  { key: "normal", label: "Normal" },
  { key: "higher_spending", label: "Higher Spending" },
  { key: "lower_sales", label: "Lower Sales" }
];
function CashFlowPage() {
  const [scenario, setScenario] = reactExports.useState("normal");
  const [data, setData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [offline, setOffline] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  function load() {
    setLoading(true);
    fetchCashFlowForecast(scenario).then((res) => {
      setData(res);
      setOffline(false);
      setError(null);
    }).catch((err) => {
      if (isOfflineError(err)) setOffline(true);
      else setError(err instanceof Error ? err.message : "Failed to load forecast");
    }).finally(() => setLoading(false));
  }
  reactExports.useEffect(load, [scenario]);
  const chartData = data ? [
    ...data.historical.map((h) => ({ label: h.label, net: h.net, income: h.income, expenses: h.expenses, forecast: false })),
    ...data.forecast.map((f) => ({
      label: f.label,
      projected_balance: f.projected_balance,
      income: f.expected_income,
      expenses: f.expected_expenses,
      forecast: true
    }))
  ] : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-slate-900 sm:text-3xl", children: "Cash Flow Forecast" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-500", children: "A simple, explainable projection based on your transaction history." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 rounded-xl bg-stone-100 p-1", children: SCENARIOS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setScenario(s.key),
          className: `rounded-lg px-3 py-1.5 text-xs font-semibold transition ${scenario === s.key ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`,
          children: s.label
        },
        s.key
      )) })
    ] }),
    loading && !data ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingCard, { label: "Building forecast…" }) : offline ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorCard, { offline: true, onRetry: load }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorCard, { message: error, onRetry: load }) : data && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "mt-0.5 h-4 w-4 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: data.disclaimer })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "mb-1 text-base font-semibold text-slate-900", children: [
          "Historical vs projected (",
          data.scenario_label,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-5 text-sm text-slate-400", children: [
          "Method: ",
          data.method,
          " · Trend: ",
          data.trend_direction
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ComposedChart, { data: chartData, margin: { top: 5, right: 8, left: -12, bottom: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "forecastFill", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#10b981", stopOpacity: 0.25 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#10b981", stopOpacity: 0 })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#eef0f2", vertical: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "label", tick: { fontSize: 11, fill: "#94a3b8" }, axisLine: false, tickLine: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: { fontSize: 11, fill: "#94a3b8" }, axisLine: false, tickLine: false, tickFormatter: (v) => formatCompactINR(v), width: 56 }),
          data.historical.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            ReferenceLine,
            {
              x: data.historical[data.historical.length - 1]?.label,
              stroke: "#10b981",
              strokeDasharray: "4 4",
              label: { value: "Forecast starts", position: "insideTopRight", fill: "#10b981", fontSize: 11, fontWeight: 600 }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (v) => formatINR(v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "net", stroke: "#0f172a", strokeWidth: 2, dot: false, name: "Net (historical)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "projected_balance", stroke: "#10b981", strokeWidth: 2, fill: "url(#forecastFill)", strokeDasharray: "4 4", name: "Projected balance" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3", children: data.forecast.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold uppercase tracking-wide text-slate-400", children: [
          f.label,
          " (estimate)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-lg font-bold text-slate-900", children: formatINR(f.projected_balance) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-slate-500", children: [
          "Expected income ",
          formatINR(f.expected_income),
          " · expenses ",
          formatINR(f.expected_expenses)
        ] })
      ] }, f.label)) })
    ] })
  ] });
}
function Page() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CashFlowPage, {}) });
}
export {
  Page as component
};
