import { ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@app/i18n";
import { siteConfig } from "@app/config/site";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Hero() {
  const { t } = useI18n();
  return (
    <section id="home" className="relative flex min-h-dvh items-center justify-center overflow-hidden">
      <div className="hero-anim-bg absolute inset-0">
        <img
          src={siteConfig.heroImage}
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1c30]/80 via-[#0a1c30]/55 to-[#0a1c30]/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1c30]/70 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-5 pb-24 pt-32 text-center md:pb-16">
        <p className="hero-anim-1 inline-flex items-center gap-2 rounded-full border border-gold-soft/40 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-[#e8d9a8] backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          {t("hero.badge")}
        </p>

        <h1 className="hero-anim-2 font-display mt-8 text-5xl font-medium leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl">
          Tatiana <span className="italic text-[#e3c778]">Meneses</span>
        </h1>

        <p className="hero-anim-3 mx-auto mt-7 max-w-2xl text-lg font-light leading-relaxed text-white/85 md:text-xl">
          {t("hero.tagline")}
        </p>

        <div className="hero-anim-4 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            onClick={() => scrollToSection("recommendations")}
            className="w-full rounded-full bg-gold px-8 text-white shadow-lg shadow-gold/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold/90 hover:shadow-xl hover:shadow-gold/30 sm:w-auto"
          >
            {t("hero.ctaRecommendations")}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollToSection("about")}
            className="w-full rounded-full border-white/40 bg-white/5 px-8 text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-soft hover:bg-white/10 hover:text-[#e8d9a8] sm:w-auto"
          >
            {t("hero.ctaStory")}
          </Button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => scrollToSection("about")}
        aria-label="Scroll"
        className="hero-anim-4 absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/60 transition-colors hover:text-gold-soft"
      >
        <ArrowDown className="float-soft h-6 w-6" />
      </button>
    </section>
  );
}
