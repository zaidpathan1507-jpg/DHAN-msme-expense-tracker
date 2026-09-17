import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { D as DashboardShell, L as LoadingCard, E as ErrorCard, i as isOfflineError } from "./DashboardShell-DroH9zDJ.mjs";
import { useToast, fetchBusinessProfile, updateBusinessProfile } from "./router-CetSUMdE.mjs";
import "../_libs/react-dom.mjs";
import { x as Save } from "../_libs/lucide-react.mjs";
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
const BUSINESS_TYPES = ["Retail", "Wholesale", "Manufacturing", "Services", "Trading", "Other"];
function SettingsPage() {
  const { show } = useToast();
  const [profile, setProfile] = reactExports.useState({});
  const [loading, setLoading] = reactExports.useState(true);
  const [offline, setOffline] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  function load() {
    setLoading(true);
    fetchBusinessProfile().then((res) => {
      setProfile(res);
      setOffline(false);
      setError(null);
    }).catch((err) => {
      if (isOfflineError(err)) setOffline(true);
      else setError(err instanceof Error ? err.message : "Failed to load business profile");
    }).finally(() => setLoading(false));
  }
  reactExports.useEffect(load, []);
  function set(key, value) {
    setProfile((p) => ({ ...p, [key]: value }));
  }
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateBusinessProfile({
        business_name: profile.business_name,
        business_type: profile.business_type,
        owner_name: profile.owner_name,
        mobile: profile.mobile,
        email: profile.email,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        gst_number: profile.gst_number,
        financial_year: profile.financial_year
      });
      setProfile(updated);
      show("Business profile updated", "success");
    } catch (err) {
      show(isOfflineError(err) ? "Unable to connect to DHAN server." : err instanceof Error ? err.message : "Could not save changes", "warning");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-slate-900 sm:text-3xl", children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-500", children: "Manage your business profile and preferences." })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingCard, { label: "Loading business profile…" }) : offline ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorCard, { offline: true, onRetry: load }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorCard, { message: error, onRetry: load }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400", children: "Business details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Business name", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: profile.business_name ?? "", onChange: (e) => set("business_name", e.target.value), className: "input" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Business type", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: profile.business_type ?? "", onChange: (e) => set("business_type", e.target.value), className: "input", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select type" }),
            BUSINESS_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t }, t))
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Owner name", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: profile.owner_name ?? "", onChange: (e) => set("owner_name", e.target.value), className: "input" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "GST number", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: profile.gst_number ?? "", onChange: (e) => set("gst_number", e.target.value), className: "input" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Financial year", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: profile.financial_year ?? "", onChange: (e) => set("financial_year", e.target.value), placeholder: "e.g. 2026-27", className: "input" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400", children: "Contact" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Mobile number", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: profile.mobile ?? "", onChange: (e) => set("mobile", e.target.value), className: "input" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: profile.email ?? "", onChange: (e) => set("email", e.target.value), className: "input" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Address", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: profile.address ?? "", onChange: (e) => set("address", e.target.value), className: "input" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "City", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: profile.city ?? "", onChange: (e) => set("city", e.target.value), className: "input" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "State", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: profile.state ?? "", onChange: (e) => set("state", e.target.value), className: "input" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "submit",
          disabled: saving,
          className: "flex items-center gap-2 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-900/15 transition hover:shadow-md active:scale-[0.98] disabled:opacity-60",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
            saving ? "Saving…" : "Save changes"
          ]
        }
      )
    ] })
  ] });
}
function Field({ label, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold text-slate-500", children: label }),
    children
  ] });
}
function Page() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsPage, {}) });
}
export {
  Page as component
};
