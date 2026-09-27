import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, LogOut, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@app/i18n";
import { ApiError } from "@app/lib/api";
import { navigate } from "@app/lib/router";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
import {
  adminLogin,
  deleteCategory,
  deleteProduct,
  deleteStore,
  fetchAdminCatalog,
  saveCategory,
  saveProduct,
  saveStore,
  type Catalog,
  type Category,
  type Product,
  type Store,
} from "@app/lib/catalog";

const TOKEN_KEY = "tm-admin-token";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

type ProductDraft = {
  id?: string;
  names: { pt: string; en: string; es: string; fr: string };
  descriptions: { pt: string; en: string; es: string; fr: string };
  button_texts: { pt: string; en: string; es: string; fr: string };
  image_url: string;
  affiliate_url: string;
  category_id: string;
  store_id: string;
  active: boolean;
  sort_order: number;
};

const emptyProduct: ProductDraft = {
  names: { pt: "", en: "", es: "", fr: "" },
  descriptions: { pt: "", en: "", es: "", fr: "" },
  button_texts: { pt: "", en: "", es: "", fr: "" },
  image_url: "",
  affiliate_url: "",
  category_id: "",
  store_id: "",
  active: true,
  sort_order: 0,
};

function mergeLang(value?: { pt?: string; en?: string; es?: string; fr?: string }) {
  return { pt: value?.pt ?? "", en: value?.en ?? "", es: value?.es ?? "", fr: value?.fr ?? "" };
}

function toDraft(product: Product): ProductDraft {
  return {
    id: product.id,
    names: mergeLang(product.names),
    descriptions: mergeLang(product.descriptions),
    button_texts: mergeLang(product.button_texts),
    image_url: product.image_url ?? "",
    affiliate_url: product.affiliate_url ?? "",
    category_id: product.category_id ?? "",
    store_id: product.store_id ?? "",
    active: product.active,
    sort_order: product.sort_order ?? 0,
  };
}

function trimLocalized(value: Record<string, string>) {
  const out: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (entry.trim()) out[key] = entry.trim();
  }
  return { pt: out.pt ?? "", en: out.en, es: out.es, fr: out.fr };
}

// ── Login ───────────────────────────────────────────────────────────
function Login({ onSuccess }: { onSuccess: (token: string) => void }) {
  const { t } = useI18n();
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(false);
    try {
      const token = await adminLogin(password);
      onSuccess(token);
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-5">
      <Card className="w-full max-w-sm shadow-xl">
        <CardContent className="p-8">
          <p className="font-display text-2xl text-foreground">Tatiana <span className="italic text-gold">Meneses</span></p>
          <h1 className="mt-6 text-lg font-semibold text-foreground">{t("admin.loginTitle")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("admin.loginSubtitle")}</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">{t("admin.password")}</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive" role="alert">{t("admin.loginError")}</p>}
            <Button type="submit" disabled={pending} className="w-full rounded-full bg-navy text-white hover:bg-gold dark:bg-gold dark:text-background">
              {pending ? t("common.loading") : t("admin.login")}
            </Button>
          </form>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 w-full text-center text-sm text-muted-foreground transition-colors hover:text-gold"
          >
            {t("admin.backToSite")}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Product form dialog ─────────────────────────────────────────────
function ProductDialog({
  open,
  onOpenChange,
  draft,
  setDraft,
  catalog,
  onSave,
  saving,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: ProductDraft;
  setDraft: (draft: ProductDraft) => void;
  catalog: Catalog;
  onSave: () => void;
  saving: boolean;
}) {
  const { t } = useI18n();
  const set = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) =>
    setDraft({ ...draft, [key]: value });
  const setLocalized = (
    field: "names" | "descriptions" | "button_texts",
    lang: string,
    value: string,
  ) => set(field, { ...draft[field], [lang]: value } as ProductDraft[typeof field]);

  const langFields = [
    { lang: "pt", nameKey: "admin.field.namePt", descKey: "admin.field.descPt", btnKey: "admin.field.buttonTextPt" },
    { lang: "en", nameKey: "admin.field.nameEn", descKey: "admin.field.descEn", btnKey: "admin.field.buttonTextEn" },
    { lang: "es", nameKey: "admin.field.nameEs", descKey: "admin.field.descEs", btnKey: "admin.field.buttonTextEs" },
    { lang: "fr", nameKey: "admin.field.nameFr", descKey: "admin.field.descFr", btnKey: "admin.field.buttonTextFr" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{draft.id ? t("admin.edit") : t("admin.newProduct")}</DialogTitle>
          <DialogDescription className="sr-only">{t("admin.subtitle")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {langFields.map((field) => (
            <fieldset key={field.lang} className="space-y-3 rounded-xl border border-border p-4">
              <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-gold">{field.lang.toUpperCase()}</legend>
              <div className="space-y-1.5">
                <Label htmlFor={`name-${field.lang}`}>{t(field.nameKey)}</Label>
                <Input
                  id={`name-${field.lang}`}
                  value={draft.names[field.lang as keyof typeof draft.names]}
                  onChange={(event) => setLocalized("names", field.lang, event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`desc-${field.lang}`}>{t(field.descKey)}</Label>
                <Textarea
                  id={`desc-${field.lang}`}
                  rows={2}
                  value={draft.descriptions[field.lang as keyof typeof draft.descriptions]}
                  onChange={(event) => setLocalized("descriptions", field.lang, event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`btn-${field.lang}`}>{t(field.btnKey)}</Label>
                <Input
                  id={`btn-${field.lang}`}
                  value={draft.button_texts[field.lang as keyof typeof draft.button_texts]}
                  onChange={(event) => setLocalized("button_texts", field.lang, event.target.value)}
                />
              </div>
            </fieldset>
          ))}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="product-image">{t("admin.field.image")}</Label>
              <Input
                id="product-image"
                value={draft.image_url}
                placeholder="/images/prod-exemplo.webp ou https://…"
                onChange={(event) => set("image_url", event.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="product-category">{t("admin.field.category")}</Label>
              <NativeSelect
                id="product-category"
                value={draft.category_id}
                onChange={(event) => set("category_id", event.target.value)}
              >
                <NativeSelectOption value="">{t("admin.field.noCategory")}</NativeSelectOption>
                {catalog.categories.map((category) => (
                  <NativeSelectOption key={category.id} value={category.id}>{category.names.pt}</NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="product-store">{t("admin.field.store")}</Label>
              <NativeSelect
                id="product-store"
                value={draft.store_id}
                onChange={(event) => set("store_id", event.target.value)}
              >
                <NativeSelectOption value="">{t("admin.field.noStore")}</NativeSelectOption>
                {catalog.stores.map((store) => (
                  <NativeSelectOption key={store.id} value={store.id}>{store.name}</NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="product-affiliate">{t("admin.field.affiliate")}</Label>
              <Input
                id="product-affiliate"
                type="url"
                value={draft.affiliate_url}
                placeholder="https://…"
                onChange={(event) => set("affiliate_url", event.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="product-order">{t("admin.field.order")}</Label>
              <Input
                id="product-order"
                type="number"
                value={draft.sort_order}
                onChange={(event) => set("sort_order", Number(event.target.value) || 0)}
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch
                id="product-active"
                checked={draft.active}
                onCheckedChange={(checked) => set("active", checked === true)}
              />
              <Label htmlFor="product-active">{draft.active ? t("admin.active") : t("admin.inactive")}</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
            {t("admin.cancel")}
          </Button>
          <Button onClick={onSave} disabled={saving} className="rounded-full bg-navy text-white hover:bg-gold dark:bg-gold dark:text-background">
            {saving ? t("common.loading") : t("admin.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Category / Store dialogs ────────────────────────────────────────
type CategoryDraft = { id?: string; slug: string; names: { pt: string; en: string; es: string; fr: string }; sort_order: number };
type StoreDraft = { id?: string; slug: string; name: string; sort_order: number };

function TaxonomyDialog({
  kind,
  open,
  onOpenChange,
  categoryDraft,
  setCategoryDraft,
  storeDraft,
  setStoreDraft,
  onSave,
  saving,
}: {
  kind: "category" | "store";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryDraft: CategoryDraft;
  setCategoryDraft: (draft: CategoryDraft) => void;
  storeDraft: StoreDraft;
  setStoreDraft: (draft: StoreDraft) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const { t } = useI18n();
  const editing = kind === "category" ? Boolean(categoryDraft.id) : Boolean(storeDraft.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editing ? t("admin.edit") : kind === "category" ? t("admin.newCategory") : t("admin.newStore")}
          </DialogTitle>
          <DialogDescription className="sr-only">{t("admin.subtitle")}</DialogDescription>
        </DialogHeader>
        {kind === "category" ? (
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="cat-pt">{t("admin.field.namePt")}</Label>
              <Input
                id="cat-pt"
                value={categoryDraft.names.pt}
                onChange={(event) => {
                  const value = event.target.value;
                  setCategoryDraft({
                    ...categoryDraft,
                    names: { ...categoryDraft.names, pt: value },
                    slug: categoryDraft.id ? categoryDraft.slug : slugify(value),
                  });
                }}
              />
            </div>
            {(["en", "es", "fr"] as const).map((lang) => (
              <div key={lang} className="space-y-1.5">
                <Label htmlFor={`cat-${lang}`}>{t(`admin.field.name${lang[0].toUpperCase()}${lang.slice(1)}`)}</Label>
                <Input
                  id={`cat-${lang}`}
                  value={categoryDraft.names[lang]}
                  onChange={(event) =>
                    setCategoryDraft({ ...categoryDraft, names: { ...categoryDraft.names, [lang]: event.target.value } })
                  }
                />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="cat-slug">{t("admin.field.slug")}</Label>
                <Input
                  id="cat-slug"
                  value={categoryDraft.slug}
                  onChange={(event) => setCategoryDraft({ ...categoryDraft, slug: slugify(event.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cat-order">{t("admin.field.order")}</Label>
                <Input
                  id="cat-order"
                  type="number"
                  value={categoryDraft.sort_order}
                  onChange={(event) => setCategoryDraft({ ...categoryDraft, sort_order: Number(event.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="store-name">{t("admin.field.name")}</Label>
              <Input
                id="store-name"
                value={storeDraft.name}
                onChange={(event) => {
                  const value = event.target.value;
                  setStoreDraft({
                    ...storeDraft,
                    name: value,
                    slug: storeDraft.id ? storeDraft.slug : slugify(value),
                  });
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="store-slug">{t("admin.field.slug")}</Label>
                <Input
                  id="store-slug"
                  value={storeDraft.slug}
                  onChange={(event) => setStoreDraft({ ...storeDraft, slug: slugify(event.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="store-order">{t("admin.field.order")}</Label>
                <Input
                  id="store-order"
                  type="number"
                  value={storeDraft.sort_order}
                  onChange={(event) => setStoreDraft({ ...storeDraft, sort_order: Number(event.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
            {t("admin.cancel")}
          </Button>
          <Button onClick={onSave} disabled={saving} className="rounded-full bg-navy text-white hover:bg-gold dark:bg-gold dark:text-background">
            {saving ? t("common.loading") : t("admin.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Admin page ──────────────────────────────────────────────────────
export function Admin() {
  const { t, lang, loc } = useI18n();
  const { dark, toggle } = useTheme();
  const [token, setToken] = useState<string | null>(() => {
    try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; }
  });
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loadError, setLoadError] = useState(false);

  const [productDialog, setProductDialog] = useState(false);
  const [productDraft, setProductDraft] = useState<ProductDraft>(emptyProduct);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [categoryDraft, setCategoryDraft] = useState<CategoryDraft>({ slug: "", names: { pt: "", en: "", es: "", fr: "" }, sort_order: 0 });
  const [storeDialog, setStoreDialog] = useState(false);
  const [storeDraft, setStoreDraft] = useState<StoreDraft>({ slug: "", name: "", sort_order: 0 });
  const [saving, setSaving] = useState(false);

  const persistToken = useCallback((value: string | null) => {
    setToken(value);
    try {
      if (value) sessionStorage.setItem(TOKEN_KEY, value);
      else sessionStorage.removeItem(TOKEN_KEY);
    } catch { /* storage unavailable */ }
  }, []);

  const load = useCallback(async () => {
    if (!token) return;
    setLoadError(false);
    try {
      setCatalog(await fetchAdminCatalog(token));
    } catch (error) {
      if (error instanceof ApiError && (error.code === "invalid_token" || error.status === 401)) {
        toast.error(t("admin.msg.sessionExpired"));
        persistToken(null);
        return;
      }
      setLoadError(true);
    }
  }, [token, t, persistToken]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleMutationError = useCallback((error: unknown, fallbackKey: string) => {
    if (error instanceof ApiError && (error.code === "invalid_token" || error.status === 401)) {
      toast.error(t("admin.msg.sessionExpired"));
      persistToken(null);
      return;
    }
    if (error instanceof ApiError && error.code === "slug_taken") {
      toast.error(t("admin.field.slug") + ": 409");
      return;
    }
    toast.error(t(fallbackKey));
  }, [t, persistToken]);

  async function submitProduct() {
    if (!token) return;
    if (!productDraft.names.pt.trim() || !productDraft.affiliate_url.trim()) {
      toast.error(t("admin.msg.required"));
      return;
    }
    setSaving(true);
    try {
      await saveProduct(token, {
        id: productDraft.id,
        names: trimLocalized(productDraft.names),
        descriptions: trimLocalized(productDraft.descriptions),
        button_texts: trimLocalized(productDraft.button_texts),
        image_url: productDraft.image_url.trim(),
        affiliate_url: productDraft.affiliate_url.trim(),
        category_id: productDraft.category_id || null,
        store_id: productDraft.store_id || null,
        active: productDraft.active,
        sort_order: productDraft.sort_order,
      });
      toast.success(t("admin.msg.saved"));
      setProductDialog(false);
      await load();
    } catch (error) {
      handleMutationError(error, "admin.msg.saveError");
    } finally {
      setSaving(false);
    }
  }

  async function submitCategory() {
    if (!token) return;
    if (!categoryDraft.names.pt.trim() || !categoryDraft.slug.trim()) {
      toast.error(t("admin.msg.required"));
      return;
    }
    setSaving(true);
    try {
      await saveCategory(token, {
        id: categoryDraft.id,
        slug: categoryDraft.slug,
        names: trimLocalized(categoryDraft.names),
        sort_order: categoryDraft.sort_order,
      });
      toast.success(t("admin.msg.saved"));
      setCategoryDialog(false);
      await load();
    } catch (error) {
      handleMutationError(error, "admin.msg.saveError");
    } finally {
      setSaving(false);
    }
  }

  async function submitStore() {
    if (!token) return;
    if (!storeDraft.name.trim() || !storeDraft.slug.trim()) {
      toast.error(t("admin.msg.required"));
      return;
    }
    setSaving(true);
    try {
      await saveStore(token, {
        id: storeDraft.id,
        slug: storeDraft.slug,
        name: storeDraft.name.trim(),
        sort_order: storeDraft.sort_order,
      });
      toast.success(t("admin.msg.saved"));
      setStoreDialog(false);
      await load();
    } catch (error) {
      handleMutationError(error, "admin.msg.saveError");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete(kind: "product" | "category" | "store", item: Product | Category | Store) {
    if (!token) return;
    if (!window.confirm(t("admin.confirmDelete"))) return;
    try {
      if (kind === "product") await deleteProduct(token, item.id);
      else if (kind === "category") await deleteCategory(token, item.id);
      else await deleteStore(token, item.id);
      toast.success(t("admin.msg.deleted"));
      await load();
    } catch (error) {
      handleMutationError(error, "admin.msg.deleteError");
    }
  }

  const categoryById = useMemo(() => new Map((catalog?.categories ?? []).map((c) => [c.id, c])), [catalog]);
  const storeById = useMemo(() => new Map((catalog?.stores ?? []).map((s) => [s.id, s])), [catalog]);

  if (!token) return <Login onSuccess={persistToken} />;

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground transition-colors hover:text-gold"
          >
            <ArrowLeft className="mr-1.5 inline h-4 w-4" aria-hidden />
            {t("admin.backToSite").replace("← ", "")}
          </button>
          <p className="font-display hidden text-lg sm:block">
            {t("admin.title")}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label={dark ? t("theme.toLight") : t("theme.toDark")}>
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => void load()} aria-label={t("recommendations.retry")}>
              <RefreshCw className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => persistToken(null)}>
              <LogOut className="h-4 w-4" aria-hidden />
              {t("admin.logout")}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="font-display text-3xl font-medium text-foreground">{t("admin.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("admin.subtitle")}</p>

        {loadError && (
          <Card className="mt-6 border-destructive/40">
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <p className="text-sm text-destructive">{t("admin.msg.loadError")}</p>
              <Button variant="outline" size="sm" onClick={() => void load()}>{t("recommendations.retry")}</Button>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="products" className="mt-8">
          <TabsList>
            <TabsTrigger value="products">{t("admin.products")}</TabsTrigger>
            <TabsTrigger value="categories">{t("admin.categories")}</TabsTrigger>
            <TabsTrigger value="stores">{t("admin.stores")}</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <div className="mb-4 flex justify-end">
              <Button
                className="rounded-full bg-navy text-white hover:bg-gold dark:bg-gold dark:text-background"
                onClick={() => { setProductDraft({ ...emptyProduct, sort_order: (catalog?.products.length ?? 0) + 1 }); setProductDialog(true); }}
              >
                <Plus className="h-4 w-4" aria-hidden />
                {t("admin.newProduct")}
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="px-5 py-3.5">{t("admin.table.product")}</th>
                        <th className="px-5 py-3.5">{t("admin.table.category")}</th>
                        <th className="px-5 py-3.5">{t("admin.table.store")}</th>
                        <th className="px-5 py-3.5">{t("admin.table.status")}</th>
                        <th className="px-5 py-3.5">{t("admin.table.order")}</th>
                        <th className="px-5 py-3.5 text-right">{t("admin.table.actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(catalog?.products ?? []).map((product) => (
                        <tr key={product.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/40">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              {product.image_url ? (
                                <img src={product.image_url} alt="" className="h-11 w-11 rounded-lg object-cover" loading="lazy" />
                              ) : (
                                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-muted-foreground">—</span>
                              )}
                              <span className="max-w-56 truncate font-medium text-foreground">{product.names[lang] || product.names.pt}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-muted-foreground">
                            {product.category_id ? (categoryById.get(product.category_id)?.names.pt ?? "—") : t("admin.field.noCategory")}
                          </td>
                          <td className="px-5 py-3 text-muted-foreground">
                            {product.store_id ? (storeById.get(product.store_id)?.name ?? "—") : t("admin.field.noStore")}
                          </td>
                          <td className="px-5 py-3">
                            <Badge variant={product.active ? "default" : "secondary"} className={product.active ? "bg-gold/15 text-gold hover:bg-gold/15" : ""}>
                              {product.active ? t("admin.active") : t("admin.inactive")}
                            </Badge>
                          </td>
                          <td className="px-5 py-3 text-muted-foreground">{product.sort_order}</td>
                          <td className="px-5 py-3">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={t("admin.edit")}
                                onClick={() => { setProductDraft(toDraft(product)); setProductDialog(true); }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                aria-label={t("admin.delete")}
                                onClick={() => void confirmDelete("product", product)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {catalog && catalog.products.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">{t("admin.table.empty")}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <div className="mb-4 flex justify-end">
              <Button
                className="rounded-full bg-navy text-white hover:bg-gold dark:bg-gold dark:text-background"
                onClick={() => { setCategoryDraft({ slug: "", names: { pt: "", en: "", es: "", fr: "" }, sort_order: (catalog?.categories.length ?? 0) + 1 }); setCategoryDialog(true); }}
              >
                <Plus className="h-4 w-4" aria-hidden />
                {t("admin.newCategory")}
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <ul className="divide-y divide-border/60">
                  {(catalog?.categories ?? []).map((category) => (
                    <li key={category.id} className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-secondary/40">
                      <div>
                        <p className="font-medium text-foreground">{loc(category.names)}</p>
                        <p className="text-xs text-muted-foreground">/{category.slug} · {t("admin.table.order")}: {category.sort_order}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={t("admin.edit")}
                          onClick={() => {
                            setCategoryDraft({
                              id: category.id,
                              slug: category.slug,
                              names: mergeLang(category.names),
                              sort_order: category.sort_order,
                            });
                            setCategoryDialog(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          aria-label={t("admin.delete")}
                          onClick={() => void confirmDelete("category", category)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                  {catalog && catalog.categories.length === 0 && (
                    <li className="px-5 py-10 text-center text-muted-foreground">{t("admin.table.empty")}</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stores" className="mt-6">
            <div className="mb-4 flex justify-end">
              <Button
                className="rounded-full bg-navy text-white hover:bg-gold dark:bg-gold dark:text-background"
                onClick={() => { setStoreDraft({ slug: "", name: "", sort_order: (catalog?.stores.length ?? 0) + 1 }); setStoreDialog(true); }}
              >
                <Plus className="h-4 w-4" aria-hidden />
                {t("admin.newStore")}
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <ul className="divide-y divide-border/60">
                  {(catalog?.stores ?? []).map((store) => (
                    <li key={store.id} className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-secondary/40">
                      <div>
                        <p className="font-medium text-foreground">{store.name}</p>
                        <p className="text-xs text-muted-foreground">/{store.slug} · {t("admin.table.order")}: {store.sort_order}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={t("admin.edit")}
                          onClick={() => {
                            setStoreDraft({ id: store.id, slug: store.slug, name: store.name, sort_order: store.sort_order });
                            setStoreDialog(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          aria-label={t("admin.delete")}
                          onClick={() => void confirmDelete("store", store)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                  {catalog && catalog.stores.length === 0 && (
                    <li className="px-5 py-10 text-center text-muted-foreground">{t("admin.table.empty")}</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {catalog && (
        <>
          <ProductDialog
            open={productDialog}
            onOpenChange={setProductDialog}
            draft={productDraft}
            setDraft={setProductDraft}
            catalog={catalog}
            onSave={() => void submitProduct()}
            saving={saving}
          />
          <TaxonomyDialog
            kind="category"
            open={categoryDialog}
            onOpenChange={setCategoryDialog}
            categoryDraft={categoryDraft}
            setCategoryDraft={setCategoryDraft}
            storeDraft={storeDraft}
            setStoreDraft={setStoreDraft}
            onSave={() => void submitCategory()}
            saving={saving}
          />
          <TaxonomyDialog
            kind="store"
            open={storeDialog}
            onOpenChange={setStoreDialog}
            categoryDraft={categoryDraft}
            setCategoryDraft={setCategoryDraft}
            storeDraft={storeDraft}
            setStoreDraft={setStoreDraft}
            onSave={() => void submitStore()}
            saving={saving}
          />
        </>
      )}
    </div>
  );
}
