import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { pt, type Dictionary } from "./locales/pt";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import type { Lang } from "./locales/types";

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

const dictionaries: Record<Lang, Dictionary> = { pt, en: en as Dictionary, es: es as Dictionary, fr: fr as Dictionary };
const STORAGE_KEY = "tm-lang";

function lookup(dict: Dictionary, path: string): string | null {
  let node: unknown = dict;
  for (const part of path.split(".")) {
    if (node == null || typeof node !== "object" || !(part in (node as Record<string, unknown>))) return null;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" ? node : null;
}

export type LocalizedText = Partial<Record<Lang, string>> | null | undefined;

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
  /** Picks the best value from multilingual database content, falling back to pt. */
  loc: (text: LocalizedText) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

function detectLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored in dictionaries) return stored as Lang;
  } catch { /* storage unavailable */ }
  const browser = navigator.language.slice(0, 2);
  return browser in dictionaries ? (browser as Lang) : "pt";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* storage unavailable */ }
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);

  const t = useCallback(
    (path: string, vars?: Record<string, string | number>): string => {
      const value = lookup(dictionaries[lang], path) ?? lookup(pt, path) ?? path;
      if (!vars) return value;
      return value.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`));
    },
    [lang],
  );

  const loc = useCallback(
    (text: LocalizedText): string => {
      if (!text || typeof text !== "object") return "";
      return text[lang] || text.pt || text.en || Object.values(text).find((v) => typeof v === "string" && v) || "";
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t, loc }), [lang, setLang, t, loc]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
