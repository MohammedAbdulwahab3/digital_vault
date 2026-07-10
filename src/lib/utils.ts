import type { Locale } from "./i18n";
import { formatEthiopianDate, formatEthiopianDateTime } from "./ethiopian-date";

/** Format integer cents as a display price, e.g. 4900 -> "$49". */
export function formatPrice(cents: number) {
  const dollars = cents / 100;
  return Number.isInteger(dollars)
    ? `$${dollars}`
    : `$${dollars.toFixed(2)}`;
}

/** USD → ETB display rate (prices are stored in USD cents). */
export function etbRate() {
  const rate = parseFloat(process.env.NEXT_PUBLIC_ETB_RATE ?? "140");
  return Number.isFinite(rate) && rate > 0 ? rate : 140;
}

export function toEtb(cents: number) {
  return Math.round((cents / 100) * etbRate());
}

/**
 * Locale-aware money: English shows USD, Amharic shows Ethiopian Birr
 * (converted at NEXT_PUBLIC_ETB_RATE).
 */
export function formatMoney(cents: number, locale: Locale = "en") {
  if (locale === "am") {
    return `${toEtb(cents).toLocaleString("en-US")} ብር`;
  }
  return formatPrice(cents);
}

export function formatDate(date: Date | string, locale: Locale = "en") {
  if (locale === "am") return formatEthiopianDate(date);
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string, locale: Locale = "en") {
  if (locale === "am") return formatEthiopianDateTime(date);
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function orderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PV-${stamp}-${rand}`;
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
