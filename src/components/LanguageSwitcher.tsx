"use client";

import {useLocale} from "next-intl";
import {setLocale} from "@/i18n/action";

export default function LanguageSwitcher() {
  const currentLocale = useLocale();

  const toggleLocale = async () => {
    const nextLocale = currentLocale === "es" ? "en" : "es";
    // ejecuta la server action directamente
    const formData = new FormData();
    formData.append("locale", nextLocale);
    await setLocale(formData);
    // actualiza atributo lang y refresca la página
    document.documentElement.lang = nextLocale;
    window.location.reload(); // fuerza recarga con el nuevo idioma
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-sm font-medium hover:bg-slate-700 transition-colors border border-slate-700"
      title={
        currentLocale === "es"
          ? "Change language to English"
          : "Cambiar idioma a español"
      }
    >
      🌐 {currentLocale.toUpperCase()}
    </button>
  );
}
