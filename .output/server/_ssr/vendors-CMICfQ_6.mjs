import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { D as DashboardShell, L as LoadingCard, E as ErrorCard, a as EmptyCard, M as Modal, i as isOfflineError } from "./DashboardShell-DroH9zDJ.mjs";
import { useToast, fetchVendors, deleteVendor, createVendor } from "./router-CetSUMdE.mjs";
import { f as formatINR } from "./format-X1RxzObn.mjs";
import "../_libs/react-dom.mjs";
import { P as Plus, S as Search, M as Minus, a as TrendingDown, b as TrendingUp, c as Store, d as Trash2 } from "../_libs/lucide-react.mjs";
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
const TREND_ICON = { up: TrendingUp, down: TrendingDown, flat: Minus };
const TREND_COLOR = { up: "text-amber-600", down: "text-emerald-600", flat: "text-slate-400" };
function VendorsPage() {
  const { show } = useToast();
  const [search, setSearch] = reactExports.useState("");
  const [vendors, setVendors] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [offline, setOffline] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [detail, setDetail] = reactExports.useState(null);
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [name, setName] = reactExports.useState("");
  const [contactPerson, setContactPerson] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  function load() {
    setLoading(true);
    fetchVendors(search).then((res) => {
      setVendors(res.items);
      setOffline(false);
      setError(null);
    }).catch((err) => {
      if (isOfflineError(err)) setOffline(true);
      else setError(err instanceof Error ? err.message : "Failed to load vendors");
    }).finally(() => setLoading(false));
  }
  reactExports.useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [search]);
  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createVendor({ name: name.trim(), contact_person: contactPerson || void 0, phone: phone || void 0 });
      show("Vendor added", "success");
      setAddOpen(false);
      setName("");
      setContactPerson("");
      setPhone("");
      load();
    } catch (err) {
      show(isOfflineError(err) ? "Unable to connect to DHAN server." : err instanceof Error ? err.message : "Could not add vendor", "warning");
    }
  }
  async function handleDelete(id) {
    try {
      await deleteVendor(id);
      show("Vendor removed", "success");
      setDetail(null);
      load();
    } catch (err) {
      show(isOfflineError(err) ? "Unable to connect to DHAN server." : err instanceof Error ? err.message : "Could not remove vendor", "warning");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-slate-900 sm:text-3xl", children: "Vendors" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-500", children: "Track who you're spending with and how much." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setAddOpen(true),
          className: "flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-900/15 transition hover:shadow-md active:scale-[0.98]",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Add Vendor"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search vendors…", className: "input pl-9" })
    ] }),
    loading && !vendors ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingCard, { label: "Loading vendors…" }) : offline ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorCard, { offline: true, onRetry: load }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorCard, { message: error, onRetry: load }) : !vendors || vendors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyCard, { label: "No vendors yet", hint: "Add a vendor or record an expense to see vendors here." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: vendors.map((v) => {
      const Icon = TREND_ICON[v.spending_trend];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setDetail(v),
          className: "flex flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-5 w-5", strokeWidth: 2.2 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `flex items-center gap-1 text-xs font-semibold ${TREND_COLOR[v.spending_trend]}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-slate-800", children: v.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-slate-400", children: v.contact_person || "No contact on file" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-end justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400", children: "Total spend" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-slate-900", children: formatINR(v.total_spend) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-400", children: [
                v.transaction_count,
                " txns"
              ] })
            ] })
          ]
        },
        v.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: !!detail, onClose: () => setDetail(null), title: detail?.name ?? "", subtitle: detail?.address ?? void 0, maxWidth: "max-w-lg", children: detail && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailStat, { label: "Total spend", value: formatINR(detail.total_spend) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailStat, { label: "Transactions", value: String(detail.transaction_count) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailStat, { label: "Last transaction", value: detail.last_transaction ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailStat, { label: "Contact", value: detail.contact_person ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailStat, { label: "Phone", value: detail.phone ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailStat, { label: "Trend", value: detail.spending_trend })
      ] }),
      detail.monthly_spending.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400", children: "Monthly spending" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: detail.monthly_spending.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: m.period }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-800", children: formatINR(m.amount) })
        ] }, m.period)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => handleDelete(detail.id),
          className: "flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
            " Remove vendor"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: addOpen, onClose: () => setAddOpen(false), title: "Add Vendor", maxWidth: "max-w-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAdd, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: "Vendor name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, value: name, onChange: (e) => setName(e.target.value), className: "input" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: "Contact person" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: contactPerson, onChange: (e) => setContactPerson(e.target.value), className: "input" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: "Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: phone, onChange: (e) => setPhone(e.target.value), className: "input" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          className: "mt-2 w-full rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-900/15 transition hover:shadow-md active:scale-[0.99]",
          children: "Save vendor"
        }
      )
    ] }) })
  ] });
}
function DetailStat({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-stone-50 px-3 py-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-semibold text-slate-800", children: value })
  ] });
}
function Page() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(VendorsPage, {}) });
}
export {
  Page as component
};
