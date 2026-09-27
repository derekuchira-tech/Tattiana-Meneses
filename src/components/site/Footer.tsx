import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SocialIcon } from "@app/components/SocialIcon";
import { useI18n } from "@app/i18n";
import { siteConfig } from "@app/config/site";

const NAV_LINKS = [
  { href: "#home", key: "nav.home" },
  { href: "#about", key: "nav.about" },
  { href: "#recommendations", key: "nav.recommendations" },
  { href: "#ebooks", key: "nav.ebooks" },
  { href: "#contact", key: "nav.contact" },
] as const;

export function Footer() {
  const { t } = useI18n();
  const [legal, setLegal] = useState<"privacy" | "terms" | null>(null);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-[#0b1d30] py-14 text-[#ece5d5]">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="font-display text-xl">
              Tatiana <span className="italic text-[#d9c27e]">Meneses</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#ece5d5]/60">
              {t("footer.about")}
            </p>
          </div>

          <nav aria-label={t("footer.navigation")}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d9c27e]">{t("footer.navigation")}</h3>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-[#ece5d5]/70 transition-colors hover:text-[#d9c27e]">
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d9c27e]">{t("footer.social")}</h3>
            <div className="mt-4 flex gap-2.5">
              {siteConfig.socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ece5d5]/20 text-[#ece5d5]/70 transition-all duration-300 hover:border-[#d9c27e] hover:text-[#d9c27e]"
                >
                  <SocialIcon id={social.icon} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d9c27e]">{t("footer.legal")}</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Button variant="link" className="h-auto p-0 text-sm font-normal text-[#ece5d5]/70 hover:text-[#d9c27e]" onClick={() => setLegal("privacy")}>
                  {t("footer.privacy")}
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-sm font-normal text-[#ece5d5]/70 hover:text-[#d9c27e]" onClick={() => setLegal("terms")}>
                  {t("footer.terms")}
                </Button>
              </li>
              <li>
                <a href="/admin" className="text-sm text-[#ece5d5]/40 transition-colors hover:text-[#d9c27e]">
                  {t("nav.admin")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[#ece5d5]/10 pt-6 text-center">
          <p className="text-xs leading-relaxed text-[#ece5d5]/50">
            {t("footer.disclosure")}
          </p>
          <p className="mt-3 text-xs text-[#ece5d5]/40">
            © {year} {siteConfig.brand.name}. {t("footer.rights")}
          </p>
        </div>
      </div>

      <Dialog open={legal !== null} onOpenChange={(open) => !open && setLegal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{legal === "privacy" ? t("legal.privacyTitle") : t("legal.termsTitle")}</DialogTitle>
            <DialogDescription className="pt-3 leading-relaxed">
              {legal === "privacy" ? t("legal.privacyBody") : t("legal.termsBody")}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
