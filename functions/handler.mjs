// Business handler for the Tatiana Meneses site catalog.
// Public: GET ?action=catalog (active products only).
// Admin: POST with JSON body; writes require a token issued by admin_login.
import { SEED_CATEGORIES, SEED_PRODUCTS, SEED_STORES } from "./seed-data.mjs";

const json = (body, status = 200, headers = {}) =>
  Response.json(body, { status, headers: { "cache-control": "no-store", ...headers } });

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;
const MAX_BODY_BYTES = 64 * 1024;
const PRODUCT_COLUMNS =
  "id,names,descriptions,button_texts,image_url,affiliate_url,active,sort_order,category_id,store_id,created_at";
const MAX_ROWS = 200;

const encoder = new TextEncoder();

function b64url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function tokenKey(password) {
  const base = await crypto.subtle.digest("SHA-256", encoder.encode(`tm-admin-v1|${password}`));
  return crypto.subtle.importKey("raw", base, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

async function issueToken(password) {
  const key = await tokenKey(password);
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = encoder.encode(String(exp));
  const signature = await crypto.subtle.sign("HMAC", key, payload);
  return `${b64url(payload)}.${b64url(new Uint8Array(signature))}`;
}

async function verifyToken(token, password) {
  if (typeof token !== "string" || !token.includes(".")) return false;
  const [rawPayload, rawSignature] = token.split(".");
  if (!rawPayload || !rawSignature) return false;
  try {
    const pad = (s) => s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
    const payload = Uint8Array.from(atob(pad(rawPayload)), (c) => c.charCodeAt(0));
    const signature = Uint8Array.from(atob(pad(rawSignature)), (c) => c.charCodeAt(0));
    const exp = Number(new TextDecoder().decode(payload));
    if (!Number.isFinite(exp) || exp < Date.now()) return false;
    const key = await tokenKey(password);
    return await crypto.subtle.verify("HMAC", key, signature, payload);
  } catch {
    return false;
  }
}

async function sameSecret(provided, expected) {
  const a = await crypto.subtle.digest("SHA-256", encoder.encode(String(provided)));
  const b = await crypto.subtle.digest("SHA-256", encoder.encode(String(expected)));
  const x = new Uint8Array(a);
  const y = new Uint8Array(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.min(x.length, y.length); i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

// ── Validation helpers ──────────────────────────────────────────────
function invalid() {
  return json({ error: "invalid_payload" }, 400);
}

function str(value, max) {
  return typeof value === "string" && value.length <= max;
}

function localizedText(value, { max, requirePt }) {
  if (value == null) return requirePt ? null : {};
  if (typeof value !== "object" || Array.isArray(value)) return null;
  const out = {};
  for (const lang of ["pt", "en", "es", "fr"]) {
    const entry = value[lang];
    if (entry === undefined || entry === null || entry === "") continue;
    if (!str(entry, max)) return null;
    out[lang] = entry.trim();
  }
  if (requirePt && !out.pt) return null;
  return out;
}

function imageUrl(value) {
  if (value === undefined || value === null || value === "") return "";
  if (!str(value, 2048)) return null;
  const trimmed = value.trim();
  if (trimmed.startsWith("/")) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return trimmed;
  } catch {
    return null;
  }
}

function affiliateUrl(value) {
  if (!str(value, 2048)) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function sortOrder(value, fallback = 0) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value !== "number" || !Number.isInteger(value) || value < -100000 || value > 100000) return null;
  return value;
}

function optionalUuid(value) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || !UUID.test(value)) return undefined;
  return value;
}

// ── Reads ───────────────────────────────────────────────────────────
async function readCatalog(supabase, { includeInactive }) {
  const [categories, stores, products] = await Promise.all([
    supabase.from("categories").select("id,slug,names,sort_order")
      .order("sort_order", { ascending: true }).order("slug", { ascending: true }).limit(MAX_ROWS),
    supabase.from("stores").select("id,slug,name,sort_order")
      .order("sort_order", { ascending: true }).order("slug", { ascending: true }).limit(MAX_ROWS),
    includeInactive
      ? supabase.from("products").select(PRODUCT_COLUMNS)
          .order("sort_order", { ascending: true }).order("created_at", { ascending: false }).limit(MAX_ROWS)
      : supabase.from("products").select(PRODUCT_COLUMNS).eq("active", true)
          .order("sort_order", { ascending: true }).order("created_at", { ascending: false }).limit(MAX_ROWS),
  ]);
  for (const result of [categories, stores, products]) {
    if (result.error || !Array.isArray(result.data)) return null;
  }
  return { ok: true, categories: categories.data, stores: stores.data, products: products.data };
}

// ── Writes ──────────────────────────────────────────────────────────
async function productSave(supabase, input) {
  if (input == null || typeof input !== "object" || Array.isArray(input)) return invalid();
  const names = localizedText(input.names, { max: 200, requirePt: true });
  const descriptions = localizedText(input.descriptions, { max: 1000, requirePt: false });
  const buttonTexts = localizedText(input.button_texts, { max: 60, requirePt: false });
  const image = imageUrl(input.image_url);
  const affiliate = affiliateUrl(input.affiliate_url);
  const order = sortOrder(input.sort_order);
  const category = optionalUuid(input.category_id);
  const store = optionalUuid(input.store_id);
  const active = input.active === undefined ? true : input.active === true || input.active === "true";
  if (names === null || descriptions === null || buttonTexts === null || image === null
    || affiliate === null || order === null || category === undefined || store === undefined) return invalid();

  const row = {
    names, descriptions, button_texts: buttonTexts, image_url: image,
    affiliate_url: affiliate, active, sort_order: order, category_id: category, store_id: store,
  };
  const id = optionalUuid(input.id);
  if (id === undefined) return invalid();
  const result = id
    ? await supabase.from("products").update(row).eq("id", id).select(PRODUCT_COLUMNS).maybeSingle()
    : await supabase.from("products").insert({ id: crypto.randomUUID(), created_at: new Date().toISOString(), ...row })
        .select(PRODUCT_COLUMNS).single();
  if (result.error) return json({ error: "database_request_failed" }, 503);
  if (!result.data) return json({ error: "not_found" }, 404);
  return json({ ok: true, product: result.data });
}

async function categorySave(supabase, input) {
  if (input == null || typeof input !== "object" || Array.isArray(input)) return invalid();
  const names = localizedText(input.names, { max: 80, requirePt: true });
  const order = sortOrder(input.sort_order);
  if (names === null || order === null) return invalid();
  const slug = typeof input.slug === "string" ? input.slug.trim().toLowerCase() : "";
  if (!slug || slug.length > 60 || !SLUG.test(slug)) return invalid();
  const id = optionalUuid(input.id);
  if (id === undefined) return invalid();
  const row = { slug, names, sort_order: order };
  const result = id
    ? await supabase.from("categories").update(row).eq("id", id).select("id,slug,names,sort_order").maybeSingle()
    : await supabase.from("categories").insert({ id: crypto.randomUUID(), ...row }).select("id,slug,names,sort_order").single();
  if (result.error) {
    if (String(result.error.code ?? "").includes("23505") || String(result.error.message ?? "").includes("duplicate")) {
      return json({ error: "slug_taken" }, 409);
    }
    return json({ error: "database_request_failed" }, 503);
  }
  if (!result.data) return json({ error: "not_found" }, 404);
  return json({ ok: true, category: result.data });
}

async function storeSave(supabase, input) {
  if (input == null || typeof input !== "object" || Array.isArray(input)) return invalid();
  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (!name || name.length > 80) return invalid();
  const order = sortOrder(input.sort_order);
  if (order === null) return invalid();
  const slug = typeof input.slug === "string" ? input.slug.trim().toLowerCase() : "";
  if (!slug || slug.length > 60 || !SLUG.test(slug)) return invalid();
  const id = optionalUuid(input.id);
  if (id === undefined) return invalid();
  const row = { slug, name, sort_order: order };
  const result = id
    ? await supabase.from("stores").update(row).eq("id", id).select("id,slug,name,sort_order").maybeSingle()
    : await supabase.from("stores").insert({ id: crypto.randomUUID(), ...row }).select("id,slug,name,sort_order").single();
  if (result.error) {
    if (String(result.error.code ?? "").includes("23505") || String(result.error.message ?? "").includes("duplicate")) {
      return json({ error: "slug_taken" }, 409);
    }
    return json({ error: "database_request_failed" }, 503);
  }
  if (!result.data) return json({ error: "not_found" }, 404);
  return json({ ok: true, store: result.data });
}

async function deleteRow(supabase, table, id, columns) {
  if (typeof id !== "string" || !UUID.test(id)) return invalid();
  const result = await supabase.from(table).delete().eq("id", id).select(columns).maybeSingle();
  if (result.error) return json({ error: "database_request_failed" }, 503);
  if (!result.data) return json({ error: "not_found" }, 404);
  return json({ ok: true });
}

// ── Catalog seed (admin-gated, idempotent) ───────────────────
// Migrations cannot carry DML, so the initial catalog is written through this
// authorized Function action. Runs only when the products table is empty.

async function seedDemo(supabase) {
  const existing = await supabase.from("products").select("id").limit(1);
  if (existing.error) return json({ error: "database_request_failed" }, 503);
  if (Array.isArray(existing.data) && existing.data.length > 0) {
    return json({ ok: true, seeded: false, reason: "already_seeded" });
  }
  const now = new Date().toISOString();
  const products = SEED_PRODUCTS.map((row) => ({ ...row, created_at: now }));
  const [cats, strs, prods] = await Promise.all([
    supabase.from("categories").insert(SEED_CATEGORIES).select("id"),
    supabase.from("stores").insert(SEED_STORES).select("id"),
    supabase.from("products").insert(products).select("id"),
  ]);
  if (cats.error || strs.error || prods.error) return json({ error: "database_request_failed" }, 503);
  return json({
    ok: true, seeded: true,
    categories: cats.data?.length ?? 0, stores: strs.data?.length ?? 0, products: prods.data?.length ?? 0,
  });
}

// ── Router ──────────────────────────────────────────────────────────
export async function handleApp({ request, supabase, env }) {
  const url = new URL(request.url);
  const params = url.searchParams;

  if (request.method === "GET") {
    if (params.get("action") !== "catalog") return json({ error: "not_found" }, 404);
    try {
      const catalog = await readCatalog(supabase, { includeInactive: false });
      if (!catalog) return json({ error: "database_request_failed" }, 503);
      return json(catalog);
    } catch {
      return json({ error: "database_request_failed" }, 503);
    }
  }

  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405, { allow: "GET, POST" });
  }

  let body;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json({ error: "payload_too_large" }, 413);
    body = JSON.parse(raw);
  } catch {
    return invalid();
  }
  if (body == null || typeof body !== "object" || Array.isArray(body)) return invalid();
  const action = typeof body.action === "string" ? body.action : "";

  try {
    if (action === "admin_login") {
      const password = env("ADMIN_PASSWORD");
      if (typeof password !== "string" || !password) {
        return json({ error: "service_not_configured" }, 503);
      }
      if (typeof body.password !== "string" || !body.password || body.password.length > 200) return invalid();
      if (!(await sameSecret(body.password, password))) {
        return json({ error: "invalid_credentials" }, 401);
      }
      return json({ ok: true, token: await issueToken(password) });
    }

    // Every remaining action is administrative and requires a valid token.
    const password = env("ADMIN_PASSWORD");
    if (typeof password !== "string" || !password) {
      return json({ error: "service_not_configured" }, 503);
    }
    if (!(await verifyToken(body.token, password))) {
      return json({ error: "invalid_token" }, 401);
    }

    switch (action) {
      case "admin_catalog": {
        const catalog = await readCatalog(supabase, { includeInactive: true });
        if (!catalog) return json({ error: "database_request_failed" }, 503);
        return json(catalog);
      }
      case "seed_demo":
        return await seedDemo(supabase);
      case "product_save":
        return await productSave(supabase, body.product);
      case "product_delete":
        return await deleteRow(supabase, "products", body.id, "id");
      case "category_save":
        return await categorySave(supabase, body.category);
      case "category_delete":
        return await deleteRow(supabase, "categories", body.id, "id");
      case "store_save":
        return await storeSave(supabase, body.store);
      case "store_delete":
        return await deleteRow(supabase, "stores", body.id, "id");
      default:
        return json({ error: "not_found" }, 404);
    }
  } catch {
    return json({ error: "database_request_failed" }, 503);
  }
}
