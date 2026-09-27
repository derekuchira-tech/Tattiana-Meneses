import { requestJson } from "./api";

export interface LocalizedText {
  pt: string;
  en?: string;
  es?: string;
  fr?: string;
}

export interface Category {
  id: string;
  slug: string;
  names: LocalizedText;
  sort_order: number;
}

export interface Store {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
}

export interface Product {
  id: string;
  names: LocalizedText;
  descriptions: LocalizedText;
  button_texts: LocalizedText;
  image_url: string;
  affiliate_url: string;
  active: boolean;
  sort_order: number;
  category_id: string | null;
  store_id: string | null;
  created_at: string;
}

export interface Catalog {
  products: Product[];
  categories: Category[];
  stores: Store[];
}

const ENDPOINT = "/functions/v1/app";

function asCatalog(data: unknown): Catalog {
  const body = data as Record<string, unknown>;
  if (!Array.isArray(body.products) || !Array.isArray(body.categories) || !Array.isArray(body.stores)) {
    throw new Error("invalid_catalog");
  }
  return body as unknown as Catalog;
}

export async function fetchCatalog(signal?: AbortSignal): Promise<Catalog> {
  const data = await requestJson(`${ENDPOINT}?action=catalog`, { signal });
  return asCatalog(data);
}

export async function adminLogin(password: string): Promise<string> {
  const data = await requestJson(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "admin_login", password }),
  }) as Record<string, unknown>;
  if (typeof data.token !== "string" || !data.token) throw new Error("invalid_token");
  return data.token;
}

export async function fetchAdminCatalog(token: string, signal?: AbortSignal): Promise<Catalog> {
  const data = await requestJson(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({ action: "admin_catalog", token }),
  });
  return asCatalog(data);
}

type ProductInput = Omit<Product, "id" | "created_at"> & { id?: string };

async function postAdmin(token: string, payload: Record<string, unknown>): Promise<unknown> {
  return requestJson(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, ...payload }),
  });
}

export async function saveProduct(token: string, product: ProductInput): Promise<Product> {
  const data = await postAdmin(token, { action: "product_save", product }) as Record<string, unknown>;
  return data.product as Product;
}

export function deleteProduct(token: string, id: string): Promise<unknown> {
  return postAdmin(token, { action: "product_delete", id });
}

export async function saveCategory(
  token: string,
  category: { id?: string; slug: string; names: LocalizedText; sort_order: number },
): Promise<Category> {
  const data = await postAdmin(token, { action: "category_save", category }) as Record<string, unknown>;
  return data.category as Category;
}

export function deleteCategory(token: string, id: string): Promise<unknown> {
  return postAdmin(token, { action: "category_delete", id });
}

export async function saveStore(
  token: string,
  store: { id?: string; slug: string; name: string; sort_order: number },
): Promise<Store> {
  const data = await postAdmin(token, { action: "store_save", store }) as Record<string, unknown>;
  return data.store as Store;
}

export function deleteStore(token: string, id: string): Promise<unknown> {
  return postAdmin(token, { action: "store_delete", id });
}
