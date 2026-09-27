import { Reveal, SectionHeading } from "@app/components/Reveal";
import { SocialIcon } from "@app/components/SocialIcon";
import { useI18n } from "@app/i18n";
import { siteConfig } from "@app/config/site";

export function Socials() {
  const { t } = useI18n();
  return (
    <section className="border-y border-border/60 bg-secondary/40 py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-5 text-center">
        <Reveal>
          <SectionHeading title={t("social.title")} subtitle={t("social.subtitle")} />
        </Reveal>
        {/* Links centralizados em src/config/site.ts → socials */}
        <Reveal delay={100} className="flex flex-wrap items-center justify-center gap-4">
          {siteConfig.socials.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="group flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card text-foreground/70 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:text-gold hover:shadow-lg hover:shadow-gold/10 md:h-20 md:w-20"
            >
              <SocialIcon id={social.icon} className="h-7 w-7 transition-transform duration-300 group-hover:scale-110 md:h-8 md:w-8" />
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
