import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { D as DashboardShell, L as LoadingCard, E as ErrorCard, i as isOfflineError } from "./DashboardShell-DroH9zDJ.mjs";
import { fetchCreditReadiness } from "./router-CetSUMdE.mjs";
import "../_libs/react-dom.mjs";
import { J as ShieldAlert } from "../_libs/lucide-react.mjs";
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
const FACTOR_LABELS = {
  income_consistency: "Income consistency",
  expense_consistency: "Expense consistency",
  cash_flow_stability: "Cash flow stability",
  transaction_history: "Transaction history"
};
function scoreColor(score) {
  if (score >= 70) return { ring: "#10b981", text: "text-emerald-600", label: "Strong" };
  if (score >= 40) return { ring: "#f59e0b", text: "text-amber-600", label: "Developing" };
  return { ring: "#f43f5e", text: "text-rose-600", label: "Needs work" };
}
function CreditReadinessPage() {
  const [data, setData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [offline, setOffline] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  function load() {
    setLoading(true);
    fetchCreditReadiness().then((res) => {
      setData(res);
      setOffline(false);
      setError(null);
    }).catch((err) => {
      if (isOfflineError(err)) setOffline(true);
      else setError(err instanceof Error ? err.message : "Failed to load credit readiness");
    }).finally(() => setLoading(false));
  }
  reactExports.useEffect(load, []);
  const colors = data ? scoreColor(data.score) : scoreColor(0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-slate-900 sm:text-3xl", children: "Credit Readiness" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-500", children: "A transparent, explainable indicator of your business's financial consistency." })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingCard, { label: "Calculating…" }) : offline ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorCard, { offline: true, onRetry: load }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorCard, { message: error, onRetry: load }) : data && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "mt-0.5 h-4 w-4 shrink-0" }),
        "Prototype financial indicator — not an official credit score."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center sm:gap-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full",
            style: { background: `conic-gradient(${colors.ring} ${data.score * 3.6}deg, #e2e8f0 0deg)` },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-4xl font-bold ${colors.text}`, children: data.score }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-slate-400", children: "/ 100" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm text-center sm:text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colors.text} bg-current/10`, style: { backgroundColor: `${colors.ring}1a` }, children: colors.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-relaxed text-slate-600", children: data.disclaimer })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-5 text-base font-semibold text-slate-900", children: "Factor breakdown" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-5", children: Object.keys(data.factors).map((key) => {
          const value = data.factors[key];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5 flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-700", children: FACTOR_LABELS[key] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-slate-500", children: [
                value,
                "/100"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 overflow-hidden rounded-full bg-stone-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all",
                style: { width: `${Math.min(100, Math.max(0, value))}%` }
              }
            ) })
          ] }, key);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-xs leading-relaxed text-slate-400", children: data.methodology })
      ] })
    ] })
  ] });
}
function Page() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditReadinessPage, {}) });
}
export {
  Page as component
};
