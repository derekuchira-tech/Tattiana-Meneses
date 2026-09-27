import { useMemo, useState } from "react";
import { AlertCircle, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal, SectionHeading } from "@app/components/Reveal";
import { ProductCard } from "@app/components/site/ProductCard";
import { useI18n } from "@app/i18n";
import type { Catalog } from "@app/lib/catalog";

export function Recommendations({
  state,
  catalog,
  onRetry,
}: {
  state: "loading" | "ready" | "error";
  catalog: Catalog | null;
  onRetry: () => void;
}) {
  const { t, loc } = useI18n();
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [storeId, setStoreId] = useState("all");

  const categories = catalog?.categories ?? [];
  const stores = catalog?.stores ?? [];
  const categoryById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);
  const storeById = useMemo(() => new Map(stores.map((s) => [s.id, s])), [stores]);

  const filtered = useMemo(() => {
    const products = catalog?.products ?? [];
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      if (categoryId !== "all" && product.category_id !== categoryId) return false;
      if (storeId !== "all" && product.store_id !== storeId) return false;
      if (!needle) return true;
      const haystack = [loc(product.names), loc(product.descriptions)].join(" ").toLowerCase();
      return haystack.includes(needle);
    });
  }, [catalog, query, categoryId, storeId, loc]);

  const hasFilters = query.trim() !== "" || categoryId !== "all" || storeId !== "all";

  return (
    <section id="recommendations" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <SectionHeading
            kicker={t("recommendations.kicker")}
            title={t("recommendations.title")}
            subtitle={t("recommendations.subtitle")}
          />
        </Reveal>

        <Reveal delay={80} className="mb-10 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("recommendations.searchPlaceholder")}
              className="h-12 rounded-full border-border bg-card pl-11 pr-4"
              aria-label={t("recommendations.searchPlaceholder")}
            />
          </div>
          <NativeSelect
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="h-12 w-full rounded-full border-border bg-card px-4 md:w-52"
            aria-label={t("recommendations.allCategories")}
          >
            <NativeSelectOption value="all">{t("recommendations.allCategories")}</NativeSelectOption>
            {categories.map((category) => (
              <NativeSelectOption key={category.id} value={category.id}>
                {loc(category.names)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <NativeSelect
            value={storeId}
            onChange={(event) => setStoreId(event.target.value)}
            className="h-12 w-full rounded-full border-border bg-card px-4 md:w-52"
            aria-label={t("recommendations.allStores")}
          >
            <NativeSelectOption value="all">{t("recommendations.allStores")}</NativeSelectOption>
            {stores.map((store) => (
              <NativeSelectOption key={store.id} value={store.id}>
                {store.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Reveal>

        <p className="-mt-6 mb-8 max-w-3xl text-center text-xs leading-relaxed text-muted-foreground md:mx-auto">
          {t("recommendations.affiliateNote")}
        </p>

        {state === "loading" && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="overflow-hidden rounded-xl border border-border bg-card">
                <Skeleton className="aspect-square w-full rounded-none" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-10 w-full rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {state === "error" && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-gold" aria-hidden />
            <p className="mt-4 text-foreground">{t("recommendations.error")}</p>
            <Button variant="outline" className="mt-6 rounded-full" onClick={onRetry}>
              {t("recommendations.retry")}
            </Button>
          </div>
        )}

        {state === "ready" && filtered.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-lg font-medium text-foreground">{t("recommendations.empty")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("recommendations.emptyHint")}</p>
            {hasFilters && (
              <Button
                variant="ghost"
                className="mt-5 rounded-full text-gold"
                onClick={() => { setQuery(""); setCategoryId("all"); setStoreId("all"); }}
              >
                <X className="h-4 w-4" aria-hidden />
                {t("recommendations.clearFilters")}
              </Button>
            )}
          </div>
        )}

        {state === "ready" && filtered.length > 0 && (
          <>
            <p className="mb-6 text-sm text-muted-foreground" role="status">
              {filtered.length === 1
                ? t("recommendations.resultsOne")
                : t("recommendations.resultsMany", { count: filtered.length })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((product, index) => (
                <Reveal as="div" key={product.id} delay={Math.min(index, 6) * 60} className="h-full">
                  <ProductCard
                    product={product}
                    category={product.category_id ? categoryById.get(product.category_id) : undefined}
                    store={product.store_id ? storeById.get(product.store_id) : undefined}
                  />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
