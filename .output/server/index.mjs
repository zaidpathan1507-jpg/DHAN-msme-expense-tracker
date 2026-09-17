globalThis.__nitro_main__ = import.meta.url;
import { N as NodeResponse, s as serve } from "./_libs/srvx.mjs";
import { d as defineHandler, H as HTTPError, t as toEventHandler, a as defineLazyEventHandler, h as headers, b as H3Core, m as memoizeRouteRulesMatcher, c as createMatcherFromFind, e as composeMiddleware } from "./_libs/h3.mjs";
import { H as HookableCore } from "./_libs/hookable.mjs";
import { d as decodePath, w as withLeadingSlash, a as withoutTrailingSlash, j as joinURL } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import "node:http";
import "node:stream";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "./_libs/rou3.mjs";
const assets = {
  "/assets/budgets-BHaBKpbL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1573-e1n/1EN1wA7qKhmqw7mu9mJAHXs"',
    "mtime": "2026-09-17T20:23:12.475Z",
    "size": 5491,
    "path": "../public/assets/budgets-BHaBKpbL.js"
  },
  "/assets/cashflow-Dl1_WdHP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2162-Yv7DNWXvv0Dhu+VktgWEDNwKz0o"',
    "mtime": "2026-09-17T20:23:12.475Z",
    "size": 8546,
    "path": "../public/assets/cashflow-Dl1_WdHP.js"
  },
  "/assets/analytics-aYaW9bsB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"9d00-bhuzsQTrn3m/otD4r/gTQVt3SvA"',
    "mtime": "2026-09-17T20:23:12.475Z",
    "size": 40192,
    "path": "../public/assets/analytics-aYaW9bsB.js"
  },
  "/assets/ComposedChart-BHxM71pu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"798b-vviBmYH+4u3/HO9rVuF24EfsFp4"',
    "mtime": "2026-09-17T20:23:12.475Z",
    "size": 31115,
    "path": "../public/assets/ComposedChart-BHxM71pu.js"
  },
  "/assets/credit-readiness-CJ7CZ4CF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"f0e-W0OzUvPlG7WTnZTDQLVyAfvGOf4"',
    "mtime": "2026-09-17T20:23:12.475Z",
    "size": 3854,
    "path": "../public/assets/credit-readiness-CJ7CZ4CF.js"
  },
  "/assets/dashboard-C2pGIw_D.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"188-G/mhXMwE5aWpZOAjYlkqBIxTkH4"',
    "mtime": "2026-09-17T20:23:12.475Z",
    "size": 392,
    "path": "../public/assets/dashboard-C2pGIw_D.js"
  },
  "/assets/DashboardOverview-BBPxFFc1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"85f3-LhBj4jsLK0uQ9kFaWCOGiZQakUg"',
    "mtime": "2026-09-17T20:23:12.475Z",
    "size": 34291,
    "path": "../public/assets/DashboardOverview-BBPxFFc1.js"
  },
  "/assets/DashboardShell-DcbcX1s0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"890d-ezGoRrnElIPBT8BuD+eUKIMDm1Q"',
    "mtime": "2026-09-17T20:23:12.475Z",
    "size": 35085,
    "path": "../public/assets/DashboardShell-DcbcX1s0.js"
  },
  "/assets/reports-Dqli5tfO.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"14fd-sIMCjRPQITXDJ1BwNdEkvThc3KM"',
    "mtime": "2026-09-17T20:23:12.475Z",
    "size": 5373,
    "path": "../public/assets/reports-Dqli5tfO.js"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": '"3aee-JckObXLTAe3A6+myIgdybrrPxqQ"',
    "mtime": "2026-09-17T10:07:26.000Z",
    "size": 15086,
    "path": "../public/favicon.ico"
  },
  "/assets/index-QhQ92Jij.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"188-G/mhXMwE5aWpZOAjYlkqBIxTkH4"',
    "mtime": "2026-09-17T20:23:12.475Z",
    "size": 392,
    "path": "../public/assets/index-QhQ92Jij.js"
  },
  "/assets/format-BQpXEgl1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"104-5yyRMLQXJ9VCXOarYMMQBXFr3lQ"',
    "mtime": "2026-09-17T20:23:12.475Z",
    "size": 260,
    "path": "../public/assets/format-BQpXEgl1.js"
  },
  "/assets/settings-D8kjySYH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"113f-C6oEcLN3u0QDxclX+EYOOexl/zc"',
    "mtime": "2026-09-17T20:23:12.475Z",
    "size": 4415,
    "path": "../public/assets/settings-D8kjySYH.js"
  },
  "/assets/trash-2-BShU-KS2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"149-DnY21p6eGekPknXGBOq+Dw7whVU"',
    "mtime": "2026-09-17T20:23:12.475Z",
    "size": 329,
    "path": "../public/assets/trash-2-BShU-KS2.js"
  },
  "/assets/tooltipContext-S_eHQpzu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"204-jvM0WN2uagLdip7ZXNoEqpTnygE"',
    "mtime": "2026-09-17T20:23:12.475Z",
    "size": 516,
    "path": "../public/assets/tooltipContext-S_eHQpzu.js"
  },
  "/assets/transactions-xjLDsdc4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2541-mK2I2183Br+D9kcx4s9qkfnNfBM"',
    "mtime": "2026-09-17T20:23:12.475Z",
    "size": 9537,
    "path": "../public/assets/transactions-xjLDsdc4.js"
  },
  "/assets/trending-down--XNVuvqK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"132-daocYoniC8TYQj8+OMMbNqkYsU8"',
    "mtime": "2026-09-17T20:23:12.475Z",
    "size": 306,
    "path": "../public/assets/trending-down--XNVuvqK.js"
  },
  "/assets/index-ceaQEH8w.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"cb15-sWYdOPRaPJekIfzo/UhA1thAh5s"',
    "mtime": "2026-09-17T20:23:12.472Z",
    "size": 51989,
    "path": "../public/assets/index-ceaQEH8w.css"
  },
  "/assets/vendors-C31VV-if.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1a0e-7Ra+YGy5c4TI1GP7xPZcAT+eiXc"',
    "mtime": "2026-09-17T20:23:12.475Z",
    "size": 6670,
    "path": "../public/assets/vendors-C31VV-if.js"
  },
  "/assets/CartesianChart-C-QMujd8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"54b2c-DUbsrbdmv1YgAWj5UgwTX5oA89w"',
    "mtime": "2026-09-17T20:23:12.475Z",
    "size": 346924,
    "path": "../public/assets/CartesianChart-C-QMujd8.js"
  },
  "/assets/index-2DhgMMnG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5260e-B/SBmepTQpMa7yhs5AuJtOJybgM"',
    "mtime": "2026-09-17T20:23:12.475Z",
    "size": 337422,
    "path": "../public/assets/index-2DhgMMnG.js"
  }
};
function readAsset(id) {
  const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
  return promises.readFile(resolve(serverDir, assets[id].path));
}
const publicAssetBases = {};
function isPublicAssetURL(id = "") {
  if (assets[id]) {
    return true;
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) {
      return true;
    }
  }
  return false;
}
function getAsset(id) {
  return assets[id];
}
const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = {
  gzip: ".gz",
  br: ".br",
  zstd: ".zst"
};
const _e1d934dc51d43569 = defineHandler((event) => {
  if (event.req.method && !METHODS.has(event.req.method)) {
    return;
  }
  let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
  let asset;
  const encodingHeader = event.req.headers.get("accept-encoding") || "";
  const encodings = [...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.res.headers.delete("Cache-Control");
      throw new HTTPError({ status: 404 });
    }
    return;
  }
  if (encodings.length > 1) {
    event.res.headers.append("Vary", "Accept-Encoding");
  }
  const ifNotMatch = event.req.headers.get("if-none-match") === asset.etag;
  if (ifNotMatch) {
    event.res.status = 304;
    event.res.statusText = "Not Modified";
    return "";
  }
  const ifModifiedSinceH = event.req.headers.get("if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    event.res.status = 304;
    event.res.statusText = "Not Modified";
    return "";
  }
  if (asset.type) {
    event.res.headers.set("Content-Type", asset.type);
  }
  if (asset.etag && !event.res.headers.has("ETag")) {
    event.res.headers.set("ETag", asset.etag);
  }
  if (asset.mtime && !event.res.headers.has("Last-Modified")) {
    event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !event.res.headers.has("Content-Encoding")) {
    event.res.headers.set("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.res.headers.has("Content-Length")) {
    event.res.headers.set("Content-Length", asset.size.toString());
  }
  return readAsset(id);
});
const findRouteRules = /* @__PURE__ */ (() => {
  const $0 = { route: "/assets/**", rank: 0, rules: [{ name: "headers", route: "/assets/**", handler: headers, options: { "cache-control": "public, max-age=31536000, immutable" } }] };
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1);
    let s = p.split("/");
    if (s.length > 1 && s[s.length - 1] === "") {
      s.pop();
      p = p.slice(0, -1);
    }
    let l = s.length;
    if (l > 1) {
      if (s[1] === "assets") {
        r.push({ data: $0, params: { "_": p.slice(8) } });
      }
    }
    return r.reverse();
  };
})();
const _lazy_cd37d75325c27dc3 = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
const findRoute = /* @__PURE__ */ (() => {
  const data = { route: "/**", handler: _lazy_cd37d75325c27dc3 };
  return ((_m, p) => {
    return { data, params: { "_": p.slice(1) } };
  });
})();
const globalMiddleware = [
  toEventHandler(_e1d934dc51d43569)
].filter(Boolean);
const errorHandler$1 = (error, event) => {
  const res = defaultHandler(error, event);
  return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
  const unhandled = error.unhandled ?? !HTTPError.isError(error);
  const { status = 500, statusText = "" } = unhandled ? {} : error;
  if (status === 404) {
    const url = event.url || new URL(event.req.url);
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      return {
        status: 302,
        headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
      };
    }
  }
  const headers2 = new Headers(unhandled ? {} : error.headers);
  headers2.set("content-type", "application/json; charset=utf-8");
  const jsonBody = unhandled ? {
    status,
    unhandled: true
  } : typeof error.toJSON === "function" ? error.toJSON() : {
    status,
    statusText,
    message: error.message
  };
  return {
    status,
    statusText,
    headers: headers2,
    body: {
      error: true,
      ...jsonBody
    }
  };
}
const errorHandlers = [errorHandler$1];
async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      const response = await handler(error, event, { defaultHandler });
      if (response) {
        return response;
      }
    } catch (error2) {
      console.error(error2);
    }
  }
}
function createNitroApp() {
  const captureError = (error, errorCtx) => {
    if (errorCtx?.event) {
      const errors = errorCtx.event.req.context?.nitro?.errors;
      if (errors) {
        errors.push({ error, context: errorCtx });
      }
    }
  };
  const h3App = createH3App({
    onError(error, event) {
      return errorHandler(error, event);
    }
  });
  let appHandler = (req) => {
    req.context ||= {};
    req.context.nitro = req.context.nitro || { errors: [] };
    return h3App.fetch(req);
  };
  return {
    fetch: appHandler,
    h3: h3App,
    hooks: void 0,
    captureError
  };
}
function createH3App(config) {
  const h3App = new H3Core(config);
  h3App["~findRoute"] = (event) => {
    event.context.routeRules = getRouteRules(event.req.method, event.url.pathname).routeRules;
    return findRoute(event.req.method, event.url.pathname);
  };
  h3App["~middleware"].push(createRouteRulesMiddleware());
  h3App["~middleware"].push(...globalMiddleware);
  return h3App;
}
const APP_ID = "default";
function useNitroApp() {
  let instance = useNitroApp._instance;
  if (instance) {
    return instance;
  }
  instance = useNitroApp._instance = createNitroApp();
  globalThis.__nitro__ = globalThis.__nitro__ || {};
  globalThis.__nitro__[APP_ID] = instance;
  return instance;
}
function useNitroHooks() {
  const nitroApp2 = useNitroApp();
  const hooks = nitroApp2.hooks;
  if (hooks) {
    return hooks;
  }
  return nitroApp2.hooks = new HookableCore();
}
let _matchRouteRules;
function getRouteRules(method, pathname) {
  return (_matchRouteRules ??= memoizeRouteRulesMatcher(createMatcherFromFind(findRouteRules)))(method, pathname);
}
function createRouteRulesMiddleware() {
  const composed = /* @__PURE__ */ new WeakMap();
  const middleware = (event, next) => {
    const ruleMiddleware = getRouteRules(event.req.method, event.url.pathname).routeRuleMiddleware;
    if (ruleMiddleware.length === 0) {
      return next();
    }
    let chain = composed.get(ruleMiddleware);
    if (!chain) {
      chain = composeMiddleware(ruleMiddleware);
      composed.set(ruleMiddleware, chain);
    }
    return chain(event, next);
  };
  return markUntraced(middleware);
}
function markUntraced(middleware) {
  middleware.__traced__ = true;
  return middleware;
}
function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
  process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
  process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
const tracingSrvxPlugins = [];
function setupCloseHooks(server2) {
  const closeServer = server2.close.bind(server2);
  let closeHooks;
  server2.close = (closeActiveConnections) => closeServer(closeActiveConnections).finally(() => closeHooks ??= callCloseHooks());
}
async function callCloseHooks() {
  try {
    await useNitroHooks().callHook("close");
  } catch (error) {
    console.error("[nitro] Error while calling `close` hooks:", error);
  }
}
const _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
const port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
const host = process.env.NITRO_HOST || process.env.HOST;
const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
const server = serve({
  port,
  hostname: host,
  tls: cert && key ? {
    cert,
    key
  } : void 0,
  fetch: nitroApp.fetch,
  plugins: [...tracingSrvxPlugins]
});
setupCloseHooks(server);
trapUnhandledErrors();
const nodeServer = {};
export {
  nodeServer as default
};
