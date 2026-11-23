import { getLanguage } from "obsidian";
import en from "./en.json";
import de from "./de.json";

import type { ChemicalElement, ElementCategory } from "../data/elements";

type TranslationSection = "properties" | "categories" | "ui" | "views";

type TranslationKey<S extends TranslationSection> = keyof (typeof en)[S];

export type PSELanguage = "de" | "en";

export function getPSELanguage(): PSELanguage {
  const language = getLanguage().toLowerCase();

  return language === "de" || language.startsWith("de-") ? "de" : "en";
}

export function translate<S extends TranslationSection>(
  section: S,
  key: TranslationKey<S>,
  language: PSELanguage = getPSELanguage(),
): string {
  const translations = language === "de" ? de : en;

  const englishSection = en[section] as Record<string, string>;
  const localizedSection = translations[section] as Record<string, string>;

  const translationKey = String(key);

  return (
    localizedSection[translationKey] ??
    englishSection[translationKey] ??
    translationKey
  );
}

export function getElementName(
  element: ChemicalElement,
  language: PSELanguage = getPSELanguage(),
): string {
  if (language === "en") {
    return element.name;
  }

  const names = de.elements as Record<string, string>;

  return names[element.symbol] ?? element.name;
}

export function getCategoryName(
  category: ElementCategory,
  language: PSELanguage = getPSELanguage(),
): string {
  return translate("categories", category, language);
}

export function formatPSEValue(
  value: number,
  language: PSELanguage = getPSELanguage(),
  maximumFractionDigits = 4,
): string {
  return value.toLocaleString(language === "de" ? "de-DE" : "en-US", {
    maximumFractionDigits,
  });
}

export function formatAtomicMass(
  mass: string | null,
  language: PSELanguage = getPSELanguage(),
): string {
  if (mass === null) return "—";

  // Preserve bracketed mass numbers.
  if (/^\[\d+\]$/.test(mass)) {
    return mass;
  }

  const normalized = mass.replace(",", ".");
  const value = Number(normalized);

  if (!Number.isFinite(value)) {
    return mass;
  }

  const decimalPlaces = normalized.split(".")[1]?.length ?? 0;

  return value.toLocaleString(language === "de" ? "de-DE" : "en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
}
