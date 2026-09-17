import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { D as DashboardShell, L as LoadingCard, E as ErrorCard, a as EmptyCard, M as Modal, b as EXPENSE_CATEGORIES, i as isOfflineError } from "./DashboardShell-DroH9zDJ.mjs";
import { useToast, fetchBudgets, deleteBudget, createBudget } from "./router-CetSUMdE.mjs";
import { f as formatINR } from "./format-X1RxzObn.mjs";
import "../_libs/react-dom.mjs";
import { P as Plus, d as Trash2, T as TriangleAlert } from "../_libs/lucide-react.mjs";
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
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function BudgetsPage() {
  const { show } = useToast();
  const [budgets, setBudgets] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [offline, setOffline] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const now = /* @__PURE__ */ new Date();
  const [category, setCategory] = reactExports.useState("");
  const [amount, setAmount] = reactExports.useState("");
  const [month, setMonth] = reactExports.useState(now.getMonth() + 1);
  const [year, setYear] = reactExports.useState(now.getFullYear());
  function load() {
    setLoading(true);
    fetchBudgets().then((res) => {
      setBudgets(res);
      setOffline(false);
      setError(null);
    }).catch((err) => {
      if (isOfflineError(err)) setOffline(true);
      else setError(err instanceof Error ? err.message : "Failed to load budgets");
    }).finally(() => setLoading(false));
  }
  reactExports.useEffect(load, []);
  async function handleAdd(e) {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!category || !value || value <= 0) return;
    try {
      await createBudget({ category, amount: value, month, year });
      show("Budget created", "success");
      setAddOpen(false);
      setCategory("");
      setAmount("");
      load();
    } catch (err) {
      show(isOfflineError(err) ? "Unable to connect to DHAN server." : err instanceof Error ? err.message : "Could not create budget", "warning");
    }
  }
  async function handleDelete(id) {
    try {
      await deleteBudget(id);
      show("Budget removed", "success");
      load();
    } catch (err) {
      show(isOfflineError(err) ? "Unable to connect to DHAN server." : err instanceof Error ? err.message : "Could not remove budget", "warning");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-slate-900 sm:text-3xl", children: "Budgets" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-500", children: "Set monthly limits per category and track how you're doing." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setAddOpen(true),
          className: "flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-900/15 transition hover:shadow-md active:scale-[0.98]",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " New Budget"
          ]
        }
      )
    ] }),
    loading && !budgets ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingCard, { label: "Loading budgets…" }) : offline ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorCard, { offline: true, onRetry: load }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorCard, { message: error, onRetry: load }) : !budgets || budgets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyCard, { label: "No budgets set", hint: "Create a budget to track spending against a monthly limit." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: budgets.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-slate-800", children: b.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-400", children: [
            MONTH_NAMES[b.month - 1],
            " ",
            b.year
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(b.id), className: "rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600", "aria-label": "Delete budget", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5 flex items-center justify-between text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-800", children: formatINR(b.actual_spending) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-400", children: [
          "of ",
          formatINR(b.amount)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 overflow-hidden rounded-full bg-stone-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `h-full rounded-full transition-all ${b.exceeded ? "bg-rose-500" : "bg-gradient-to-r from-emerald-500 to-emerald-600"}`,
          style: { width: `${Math.min(100, b.percentage_used)}%` }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: b.exceeded ? "font-semibold text-rose-600" : "text-slate-400", children: [
          b.percentage_used,
          "% used"
        ] }),
        b.exceeded ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 font-semibold text-rose-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
          " Over budget"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-400", children: [
          formatINR(b.remaining),
          " remaining"
        ] })
      ] })
    ] }, b.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: addOpen, onClose: () => setAddOpen(false), title: "New Budget", maxWidth: "max-w-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAdd, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { required: true, value: category, onChange: (e) => setCategory(e.target.value), className: "input", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: "Select category" }),
          EXPENSE_CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: "Monthly limit (₹)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", required: true, min: 1, value: amount, onChange: (e) => setAmount(e.target.value), className: "input" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: "Month" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: month, onChange: (e) => setMonth(Number(e.target.value)), className: "input", children: MONTH_NAMES.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: i + 1, children: m }, m)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: "Year" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: year, onChange: (e) => setYear(Number(e.target.value)), className: "input" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          className: "mt-2 w-full rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-900/15 transition hover:shadow-md active:scale-[0.99]",
          children: "Create budget"
        }
      )
    ] }) })
  ] });
}
function Page() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BudgetsPage, {}) });
}
export {
  Page as component
};
