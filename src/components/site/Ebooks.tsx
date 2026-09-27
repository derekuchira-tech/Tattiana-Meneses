import { ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal, SectionHeading } from "@app/components/Reveal";
import { useI18n } from "@app/i18n";
import { siteConfig } from "@app/config/site";

export function Ebooks() {
  const { t } = useI18n();
  return (
    <section id="ebooks" className="relative overflow-hidden bg-navy py-20 text-white md:py-28 dark:bg-secondary/30">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-soft">{t("ebooks.kicker")}</p>
            <h2 className="font-display mt-4 text-3xl font-medium tracking-tight text-white md:text-5xl dark:text-foreground">
              {t("ebooks.title")}
            </h2>
            <span className="gold-rule mx-auto mt-5 block" />
            <p className="mx-auto mt-5 max-w-2xl text-base text-white/70 md:text-lg dark:text-muted-foreground">
              {t("ebooks.subtitle")}
            </p>
          </div>
        </Reveal>

        {/* Links de divulgação Hotmart centralizados em src/config/site.ts → digitalProducts */}
        <div className="grid gap-8 md:grid-cols-2">
          {siteConfig.digitalProducts.map((product, index) => (
            <Reveal key={product.id} delay={index * 120}>
              <Card className="card-lift group h-full overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm dark:border-border dark:bg-card">
                <div className="grid h-full sm:grid-cols-[2fr_3fr]">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={t(product.nameKey)}
                      loading="lazy"
                      className="h-full min-h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" aria-hidden />
                  </div>
                  <CardContent className="flex flex-col gap-4 p-6 md:p-7">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gold-soft">{t("ebooks.kicker")}</p>
                      <h3 className="font-display mt-1 text-2xl font-medium text-white dark:text-foreground">
                        {t(product.nameKey)}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {product.copyKeys.map((key) => (
                        <p key={key} className="text-sm leading-relaxed text-white/75 dark:text-muted-foreground">
                          {t(key)}
                        </p>
                      ))}
                    </div>
                    <div className="mt-auto space-y-3 pt-2">
                      <Button
                        asChild
                        className="w-full rounded-full bg-gold px-6 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold/90 hover:shadow-lg hover:shadow-gold/25"
                      >
                        <a href={product.url} target="_blank" rel="noopener noreferrer sponsored">
                          {t(product.ctaKey)}
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                        </a>
                      </Button>
                      <p className="flex items-center justify-center gap-1.5 text-xs text-white/50 dark:text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                        {t("ebooks.secure")}
                      </p>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
