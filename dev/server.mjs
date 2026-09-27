// Local-only fixture server: runs the real functions/handler.mjs against an
// in-memory fake Supabase client. No cloud database connection.
// Keep this file outside the published directories (webDirectory/functionDirectory).
import { createServer } from "node:http";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { SEED_CATEGORIES, SEED_PRODUCTS, SEED_STORES } from "../functions/seed-data.mjs";

const port = Number(process.argv[2] ?? 8000);
const { handleApp } = await import(pathToFileURL(resolve("functions/handler.mjs")).href);

const ADMIN_PASSWORD = "admin-local-2026";

// ── Fixture seed (shares the catalog seed of the cloud Function) ───
const now = new Date().toISOString();
const categories = SEED_CATEGORIES.map((row) => structuredClone(row));
const stores = SEED_STORES.map((row) => structuredClone(row));
const products = SEED_PRODUCTS.map((row) => ({ ...structuredClone(row), created_at: now }));

const tables = { categories, stores, products };

// ── Minimal fake Supabase query builder ─────────────────────────────
function matches(row, filters) {
  return filters.every(([column, value]) => row[column] === value);
}

class Query {
  constructor(table, mode) {
    this.table = table;
    this.mode = mode; // read | insert | update | delete
    this.filters = [];
    this.orders = [];
    this.limitValue = null;
    this.payload = null;
  }
  select() { return this; }
  eq(column, value) { this.filters.push([column, value]); return this; }
  order(column, { ascending = true } = {}) { this.orders.push([column, ascending]); return this; }
  limit(n) { this.limitValue = n; return this._run(); }
  single() { return this._run().then((r) => (r.data?.length === 1 ? { data: r.data[0], error: null } : { data: null, error: r.error ?? { message: "not single" } })); }
  maybeSingle() { return this._run().then((r) => ({ data: r.data?.[0] ?? null, error: r.error })); }
  _run() {
    const rows = tables[this.table];
    if (this.mode === "insert") {
      rows.unshift(this.payload);
      return Promise.resolve({ data: [this.payload], error: null });
    }
    const selected = rows.filter((row) => matches(row, this.filters));
    if (this.mode === "update") {
      for (const row of selected) Object.assign(row, this.payload);
    } else if (this.mode === "delete") {
      for (const row of selected) rows.splice(rows.indexOf(row), 1);
    }
    let data = selected.map((row) => structuredClone(row));
    for (const [column, ascending] of [...this.orders].reverse()) {
      data.sort((a, b) => (a[column] > b[column] ? 1 : a[column] < b[column] ? -1 : 0) * (ascending ? 1 : -1));
    }
    if (this.limitValue != null) data = data.slice(0, this.limitValue);
    return Promise.resolve({ data, error: null });
  }
}

function fakeSupabase() {
  return {
    from(table) {
      if (!(table in tables)) throw new Error(`unknown table ${table}`);
      const base = {
        select: () => new Query(table, "read"),
        insert: (row) => { const q = new Query(table, "insert"); q.payload = row; return q; },
        update: (row) => { const q = new Query(table, "update"); q.payload = row; return q; },
        delete: () => new Query(table, "delete"),
      };
      return base;
    },
  };
}

// Note: `select()` on a read query returns a Query whose terminal methods
// (limit/single/maybeSingle) return promises — mirroring the handler's usage.
class ReadQuery extends Query {}

const server = createServer(async (incoming, outgoing) => {
  try {
    const url = new URL(incoming.url, "http://127.0.0.1");
    if (url.pathname !== "/functions/v1/app") {
      outgoing.writeHead(404); outgoing.end(); return;
    }
    const chunks = [];
    for await (const chunk of incoming) chunks.push(chunk);
    const request = new Request(url, {
      method: incoming.method,
      body: incoming.method === "GET" ? undefined : Buffer.concat(chunks),
      headers: { "content-type": incoming.headers["content-type"] ?? "application/json" },
    });
    const response = await handleApp({
      request,
      supabase: fakeSupabase(),
      env: (name) => (name === "ADMIN_PASSWORD" ? ADMIN_PASSWORD : undefined),
    });
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error(error);
    outgoing.writeHead(500, { "content-type": "application/json" });
    outgoing.end('{"error":"local_preview_failed"}');
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Fixture API (local sample data): http://127.0.0.1:${server.address().port}/functions/v1/app`);
  console.log(`Local admin password: ${ADMIN_PASSWORD}`);
});
