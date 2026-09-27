import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialIcon } from "@app/components/SocialIcon";
import { Reveal } from "@app/components/Reveal";
import { useI18n } from "@app/i18n";
import { siteConfig } from "@app/config/site";

export function About() {
  const { t } = useI18n();
  return (
    <section id="about" className="relative overflow-hidden py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold/5 blur-3xl"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-[5fr_6fr] md:gap-16">
        <Reveal className="relative mx-auto w-full max-w-sm md:max-w-none">
          <div className="absolute -left-4 -top-4 h-full w-full rounded-3xl border border-gold/30" aria-hidden />
          <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-navy/20">
            <img
              src={siteConfig.aboutPhoto}
              alt={t("about.photoAlt")}
              className="aspect-[4/5] w-full object-cover object-center transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent" aria-hidden />
          </div>
          <div className="float-soft absolute -bottom-5 -right-3 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-xl md:-right-6">
            <MapPin className="h-5 w-5 text-gold" aria-hidden />
            <span className="text-sm font-semibold text-card-foreground">Portugal 🇵🇹</span>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">{t("about.kicker")}</p>
          <h2 className="font-display mt-4 text-3xl font-medium tracking-tight text-foreground md:text-5xl">
            {t("about.title")}
          </h2>
          <span className="gold-rule mt-5 block" />
          {/* Textos prontos para edição: src/i18n/locales/*.ts → about.p1 / about.p2 */}
          <p className="mt-6 text-lg leading-relaxed text-foreground/85">{t("about.p1")}</p>
          <p className="mt-4 leading-relaxed text-muted-foreground">{t("about.p2")}</p>
          <Button
            asChild
            size="lg"
            className="mt-8 rounded-full bg-navy px-7 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy/90 dark:bg-gold dark:text-background dark:hover:bg-gold/90"
          >
            <a href={siteConfig.contact.instagram} target="_blank" rel="noopener noreferrer">
              <SocialIcon id="instagram" className="h-4 w-4" />
              {t("about.instagramCta")}
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
