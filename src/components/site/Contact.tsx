import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal, SectionHeading } from "@app/components/Reveal";
import { SocialIcon } from "@app/components/SocialIcon";
import { useI18n } from "@app/i18n";
import { siteConfig } from "@app/config/site";

export function Contact() {
  const { t } = useI18n();
  const handle = siteConfig.contact.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (subject.trim()) params.set("subject", subject.trim());
    const body = [name.trim(), message.trim()].filter(Boolean).join("\n\n");
    params.set("body", body);
    window.location.href = `mailto:${siteConfig.contact.email}?${params.toString()}`;
  };

  return (
    <section id="contact" className="border-t border-border/60 bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <SectionHeading
            kicker={t("contact.kicker")}
            title={t("contact.title")}
            subtitle={t("contact.subtitle")}
          />
        </Reveal>

        {/* Links centralizados em src/config/site.ts → contact e socials */}
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <Card className="card-lift h-full border-border/70 bg-card shadow-sm">
              <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <SocialIcon id="instagram" className="h-6 w-6" />
                </span>
                <h3 className="font-display text-lg text-foreground">{t("contact.instagram")}</h3>
                <p className="text-sm text-muted-foreground">@{handle}</p>
                <Button asChild variant="outline" className="mt-2 rounded-full border-gold/40 text-gold hover:bg-gold hover:text-white">
                  <a href={siteConfig.contact.instagram} target="_blank" rel="noopener noreferrer">
                    {t("contact.instagramValue")}
                  </a>
                </Button>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={100}>
            <Card className="card-lift h-full border-border/70 bg-card shadow-sm">
              <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <Mail className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="font-display text-lg text-foreground">{t("contact.email")}</h3>
                <p className="break-all text-sm text-muted-foreground">{siteConfig.contact.email}</p>
                <Button asChild variant="outline" className="mt-2 rounded-full border-gold/40 text-gold hover:bg-gold hover:text-white">
                  <a href={`mailto:${siteConfig.contact.email}`}>
                    {t("contact.emailValue")}
                  </a>
                </Button>
              </CardContent>
            </Card>
          </Reveal>
        </div>

        <Reveal delay={180} className="mt-8">
          <Card className="border-border/70 bg-card shadow-sm">
            <CardContent className="p-7 md:p-9">
              <h3 className="font-display text-xl text-foreground">{t("contact.formTitle")}</h3>
              <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="contact-name">{t("contact.formName")}</Label>
                  <Input
                    id="contact-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact-subject">{t("contact.formSubject")}</Label>
                  <Input
                    id="contact-subject"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                  />
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="contact-message">{t("contact.formMessage")}</Label>
                  <Textarea
                    id="contact-message"
                    rows={5}
                    required
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center md:justify-between">
                  <p className="text-xs text-muted-foreground">{t("contact.formHint")}</p>
                  <Button type="submit" className="rounded-full bg-navy px-7 text-white hover:bg-navy/90 dark:bg-gold dark:text-background dark:hover:bg-gold/90">
                    <Send className="h-4 w-4" aria-hidden />
                    {t("contact.formSend")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </Reveal>

        <Reveal delay={260} className="mt-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">{t("contact.follow")}</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {siteConfig.socials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground/70 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:text-gold"
              >
                <SocialIcon id={social.icon} className="h-5 w-5" />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
