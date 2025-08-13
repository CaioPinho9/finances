import type { CategoryEntry } from "../types/types";

export const fmtBRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function monthYearLabel(ms: {
  month: string | null;
  year: string | null;
}) {
  const y = Number(ms.year ?? 0);
  const m = Number(ms.month ?? 0);
  if (!y || !m) return "";
  const monthName = new Date(y, m - 1, 1).toLocaleDateString("pt-BR", {
    month: "long",
  });
  return `${monthName} ${y}`;
}

export function normalizeCategoryMap(
  input: Record<string, number> | CategoryEntry[]
): CategoryEntry[] {
  if (Array.isArray(input)) {
    return input.map((e) => ({
      category: e.category ?? null,
      total: typeof e.total === "number" ? e.total : Number(e.total ?? 0),
    }));
  }
  return Object.entries(input || {}).map(([name, total]) => ({
    category: name === "null" ? null : { id: -1, name },
    total: typeof total === "number" ? total : Number(total ?? 0),
  }));
}

export function toYYYYMM(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${mm}`;
}
