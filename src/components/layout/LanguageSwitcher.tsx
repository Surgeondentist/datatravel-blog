"use client";

import { useLocaleContext } from "@/components/locale/LocaleProvider";
import type { AppLocale } from "@/lib/locale-shared";

export default function LanguageSwitcher() {
  const { locale, messages, setLocale } = useLocaleContext();
  const { spanish, english, language } = messages.nav;

  function pick(next: AppLocale) {
    if (next !== locale) setLocale(next);
  }

  return (
    <div
      role="group"
      aria-label={language}
      className="flex items-center rounded-full border border-border bg-background/80 p-0.5 text-xs font-medium"
    >
      <button
        type="button"
        onClick={() => pick("es")}
        aria-pressed={locale === "es"}
        aria-label={spanish}
        className={`rounded-full px-2.5 py-1.5 transition-colors cursor-pointer ${
          locale === "es"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => pick("en")}
        aria-pressed={locale === "en"}
        aria-label={english}
        className={`rounded-full px-2.5 py-1.5 transition-colors cursor-pointer ${
          locale === "en"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
    </div>
  );
}
