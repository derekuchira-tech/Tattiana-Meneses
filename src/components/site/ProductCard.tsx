import { ExternalLink, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@app/i18n";
import type { Category, Product, Store } from "@app/lib/catalog";

export function ProductCard({
  product,
  category,
  store,
}: {
  product: Product;
  category?: Category;
  store?: Store;
}) {
  const { t, loc } = useI18n();
  const name = loc(product.names);
  const description = loc(product.descriptions);
  const buttonText = loc(product.button_texts) || t("recommendations.viewProduct");

  return (
    <Card className="card-lift group flex h-full flex-col overflow-hidden border-border/70 bg-card shadow-sm">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
            <Package className="h-14 w-14" aria-hidden />
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {category && (
            <Badge className="border-0 bg-background/85 text-xs font-medium text-foreground backdrop-blur-sm">
              {loc(category.names)}
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-lg font-medium leading-snug text-foreground">{name}</h3>
          {store && (
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gold">{store.name}</p>
          )}
        </div>
        {description && (
          <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
        )}
        <Button
          asChild
          className="mt-auto w-full rounded-full bg-navy text-white transition-all duration-300 hover:bg-gold hover:text-white dark:bg-gold dark:text-background dark:hover:bg-gold/85"
        >
          <a href={product.affiliate_url} target="_blank" rel="noopener noreferrer sponsored">
            {buttonText}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
