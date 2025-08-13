import type { MonthSummary } from "../types/types";
import apiClient from "./apiClient";

export async function fetchSummaryRange(start: string, end: string) {
  const { data } = await apiClient.get<MonthSummary[]>("/summary", {
    params: { start, end },
  });
  // Sort by y,m just in case
  return [...data].sort((a, b) => {
    const ya = Number(a.year ?? 0),
      yb = Number(b.year ?? 0);
    const ma = Number(a.month ?? 0),
      mb = Number(b.month ?? 0);
    return ya - yb || ma - mb;
  });
}

export async function fetchSummaryByDate(date: string) {
  const { data } = await apiClient.get<MonthSummary[]>("/summary", {
    params: { date },
  });
  return data;
}
