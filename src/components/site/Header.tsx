import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { LANGS, useI18n } from "@app/i18n";
import { useTheme } from "@/hooks/use-theme";
import { siteConfig } from "@app/config/site";
import { navigate } from "@app/lib/router";
import { cn } from "@/lib/utils";

const NAV_SECTIONS = [
  { href: "#home", key: "nav.home" },
  { href: "#about", key: "nav.about" },
  { href: "#recommendations", key: "nav.recommendations" },
  { href: "#ebooks", key: "nav.ebooks" },
  { href: "#contact", key: "nav.contact" },
] as const;

function Brand({ light }: { light: boolean }) {
  return (
    <button
      type="button"
      onClick={() => navigate("/")}
      className="group flex items-center gap-3 text-left"
      aria-label={siteConfig.brand.name}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 bg-navy font-display text-sm italic text-gold-soft transition-colors duration-300 group-hover:bg-gold group-hover:text-white dark:bg-gold/10 dark:text-gold dark:group-hover:bg-gold dark:group-hover:text-background">
        TM
      </span>
      <span className={cn("font-display text-lg font-medium tracking-tight md:text-xl", light ? "text-white" : "text-foreground")}>
        Tatiana <span className={cn("italic", light ? "text-[#e3c778]" : "text-gold")}>Meneses</span>
      </span>
    </button>
  );
}

function ThemeToggle({ light }: { light: boolean }) {
  const { dark, toggle } = useTheme();
  const { t } = useI18n();
  return (
    <Button
      variant="ghost"
      onClick={toggle}
      aria-label={dark ? t("theme.toLight") : t("theme.toDark")}
      title={dark ? t("theme.toLight") : t("theme.toDark")}
      className={cn("hover:text-gold", light ? "text-white hover:text-[#e3c778]" : "text-foreground")}
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

function LanguagePicker({ light }: { light: boolean }) {
  const { lang, setLang, t } = useI18n();
  const current = LANGS.find((entry) => entry.code === lang) ?? LANGS[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn("gap-2 hover:text-gold", light ? "text-white hover:text-[#e3c778]" : "text-foreground")} aria-label={t("lang.label")}>
          <span aria-hidden>{current.flag}</span>
          <span className="hidden text-sm font-medium uppercase lg:inline">{current.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {LANGS.map((entry) => (
          <DropdownMenuItem
            key={entry.code}
            onClick={() => setLang(entry.code)}
            className={cn("gap-3", entry.code === lang && "text-gold")}
          >
            <span aria-hidden>{entry.flag}</span>
            {entry.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function scrollToSection(href: string) {
  const id = href.slice(1);
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Header() {
  const { t, lang, setLang } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border/60 bg-background/85 shadow-sm backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Brand light={!scrolled} />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV_SECTIONS.map((section) => (
            <a
              key={section.href}
              href={section.href}
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(section.href);
              }}
              className={cn("rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300", scrolled ? "text-foreground/80 hover:bg-gold/10 hover:text-gold" : "text-white/85 hover:bg-white/10 hover:text-[#e3c778]")}
            >
              {t(section.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <LanguagePicker light={!scrolled} />
          <ThemeToggle light={!scrolled} />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={cn("md:hidden", scrolled ? "text-foreground" : "text-white")} aria-label="Menu">
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background p-0">
              <SheetTitle className="sr-only">{siteConfig.brand.name}</SheetTitle>
              <div className="flex h-full flex-col gap-2 p-6 pt-16">
                {NAV_SECTIONS.map((section, index) => (
                  <SheetClose key={section.href} asChild>
                    <a
                      href={section.href}
                      onClick={(event) => {
                        event.preventDefault();
                        scrollToSection(section.href);
                      }}
                      className="font-display rounded-xl px-4 py-3 text-lg text-foreground transition-colors hover:bg-gold/10 hover:text-gold"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      {t(section.key)}
                    </a>
                  </SheetClose>
                ))}
                <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{t("lang.label")}</span>
                  <div className="flex gap-1">
                    {LANGS.map((entry) => (
                      <Button
                        key={entry.code}
                        variant={entry.code === lang ? "default" : "ghost"}
                        size="sm"
                        className="px-2"
                        onClick={() => setLang(entry.code)}
                        aria-label={entry.label}
                      >
                        <span aria-hidden>{entry.flag}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
