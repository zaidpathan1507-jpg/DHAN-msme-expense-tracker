import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { D as DashboardShell, b as EXPENSE_CATEGORIES, L as LoadingCard, E as ErrorCard, a as EmptyCard, i as isOfflineError, P as PAYMENT_METHODS, I as INCOME_SOURCES, M as Modal } from "./DashboardShell-DroH9zDJ.mjs";
import { useToast, fetchTransactions, deleteTransaction, updateTransaction } from "./router-CetSUMdE.mjs";
import { f as formatINR } from "./format-X1RxzObn.mjs";
import "../_libs/react-dom.mjs";
import { S as Search, s as CircleArrowUp, t as CircleArrowDown, u as Pencil, d as Trash2, v as ChevronLeft, w as ChevronRight } from "../_libs/lucide-react.mjs";
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
function TransactionEditModal({
  transaction,
  onClose,
  onSaved
}) {
  const { show } = useToast();
  const [amount, setAmount] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("");
  const [vendor, setVendor] = reactExports.useState("");
  const [date, setDate] = reactExports.useState("");
  const [paymentMethod, setPaymentMethod] = reactExports.useState(PAYMENT_METHODS[0]);
  const [notes, setNotes] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!transaction) return;
    setAmount(String(transaction.amount));
    setCategory(transaction.category ?? "");
    setVendor(transaction.vendor ?? "");
    setDate(transaction.date);
    setPaymentMethod(transaction.payment_method || PAYMENT_METHODS[0]);
    setNotes(transaction.notes ?? "");
  }, [transaction]);
  if (!transaction) return null;
  const options = transaction.type === "income" ? INCOME_SOURCES : EXPENSE_CATEGORIES;
  async function handleSubmit(e) {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0 || !transaction) return;
    setSaving(true);
    try {
      await updateTransaction(transaction.id, {
        type: transaction.type,
        amount: value,
        description: transaction.description || category || vendor || transaction.type,
        category,
        vendor,
        date,
        payment_method: paymentMethod,
        notes
      });
      show("Transaction updated", "success");
      onSaved();
      onClose();
    } catch (err) {
      show(isOfflineError(err) ? "Unable to connect to DHAN server." : err instanceof Error ? err.message : "Could not update transaction", "warning");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: !!transaction, onClose, title: `Edit ${transaction.type === "income" ? "Income" : "Expense"}`, maxWidth: "max-w-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: "Amount (₹)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", required: true, min: 1, value: amount, onChange: (e) => setAmount(e.target.value), className: "input" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: transaction.type === "income" ? "Source" : "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: category, onChange: (e) => setCategory(e.target.value), className: "input", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select" }),
          options.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      transaction.type === "expense" && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: "Vendor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: vendor, onChange: (e) => setVendor(e.target.value), className: "input" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", required: true, value: date, onChange: (e) => setDate(e.target.value), className: "input" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: "Payment method" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: paymentMethod, onChange: (e) => setPaymentMethod(e.target.value), className: "input", children: PAYMENT_METHODS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: m, children: m }, m)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: "Notes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), rows: 2, className: "input resize-none" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "submit",
        disabled: saving,
        className: "mt-2 w-full rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-900/15 transition hover:shadow-md active:scale-[0.99] disabled:opacity-60",
        children: saving ? "Saving…" : "Save changes"
      }
    )
  ] }) });
}
function TransactionsPage() {
  const { show } = useToast();
  const [search, setSearch] = reactExports.useState("");
  const [type, setType] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("");
  const [startDate, setStartDate] = reactExports.useState("");
  const [endDate, setEndDate] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(1);
  const [data, setData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [offline, setOffline] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [editing, setEditing] = reactExports.useState(null);
  const [deletingId, setDeletingId] = reactExports.useState(null);
  function load() {
    setLoading(true);
    fetchTransactions({ search, type, category, start_date: startDate, end_date: endDate, page, limit: 15 }).then((res) => {
      setData(res);
      setOffline(false);
      setError(null);
    }).catch((err) => {
      if (isOfflineError(err)) setOffline(true);
      else setError(err instanceof Error ? err.message : "Failed to load transactions");
    }).finally(() => setLoading(false));
  }
  reactExports.useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [search, type, category, startDate, endDate, page]);
  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await deleteTransaction(id);
      show("Transaction deleted", "success");
      load();
    } catch (err) {
      show(isOfflineError(err) ? "Unable to connect to DHAN server." : err instanceof Error ? err.message : "Could not delete transaction", "warning");
    } finally {
      setDeletingId(null);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-slate-900 sm:text-3xl", children: "Transactions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-500", children: "Every income and expense, straight from your ledger." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: search,
            onChange: (e) => {
              setPage(1);
              setSearch(e.target.value);
            },
            placeholder: "Search description, vendor…",
            className: "input pl-9"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value: type,
          onChange: (e) => {
            setPage(1);
            setType(e.target.value);
          },
          className: "input",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All types" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "income", children: "Income" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "expense", children: "Expense" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value: category,
          onChange: (e) => {
            setPage(1);
            setCategory(e.target.value);
          },
          className: "input",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All categories" }),
            EXPENSE_CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "date",
            value: startDate,
            onChange: (e) => {
              setPage(1);
              setStartDate(e.target.value);
            },
            className: "input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "date",
            value: endDate,
            onChange: (e) => {
              setPage(1);
              setEndDate(e.target.value);
            },
            className: "input"
          }
        )
      ] })
    ] }) }),
    loading && !data ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingCard, { label: "Loading transactions…" }) : offline ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorCard, { offline: true, onRetry: load }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorCard, { message: error, onRetry: load }) : !data || data.items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyCard, { label: "No transactions found", hint: "Try adjusting your filters, or add a new transaction." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-slate-100 bg-stone-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Vendor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: data.items.map((tx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-slate-50 last:border-0 hover:bg-stone-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            tx.type === "income" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowUp, { className: "h-4 w-4 shrink-0 text-emerald-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowDown, { className: "h-4 w-4 shrink-0 text-rose-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-700", children: tx.description })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-500", children: tx.category ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-500", children: tx.vendor ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-500", children: tx.date }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: `px-4 py-3 text-right font-semibold ${tx.type === "income" ? "text-emerald-600" : "text-slate-800"}`, children: [
            tx.type === "income" ? "+" : "-",
            formatINR(tx.amount)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditing(tx), className: "rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700", "aria-label": "Edit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => handleDelete(tx.id),
                disabled: deletingId === tx.id,
                className: "rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50",
                "aria-label": "Delete",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
              }
            )
          ] }) })
        ] }, tx.id)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t border-slate-100 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-400", children: [
          "Page ",
          data.page,
          " of ",
          Math.max(data.pages, 1),
          " · ",
          data.total,
          " transactions"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setPage((p) => Math.max(1, p - 1)),
              disabled: page <= 1,
              className: "rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 disabled:opacity-40",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setPage((p) => data.pages && p < data.pages ? p + 1 : p),
              disabled: data.pages ? page >= data.pages : true,
              className: "rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 disabled:opacity-40",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TransactionEditModal, { transaction: editing, onClose: () => setEditing(null), onSaved: load })
  ] });
}
function Page() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TransactionsPage, {}) });
}
export {
  Page as component
};
