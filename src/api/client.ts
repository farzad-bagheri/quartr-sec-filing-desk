import type { FilingResponse, SummaryResponse } from "../types/api";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(path);

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json"))
    throw new Error("The API server returned an unexpected response");

  const body = (await response.json()) as { error?: string } & T;
  if (!response.ok) throw new Error(body.error ?? "Request failed");
  return body;
}

export const api = {
  getFilings: (
    ticker: string,
    page: number,
    formType: string,
    order: "asc" | "desc",
  ) =>
    request<FilingResponse>(
      `/api/companies/${encodeURIComponent(ticker)}/filings?page=${page}&limit=12&formType=${encodeURIComponent(formType)}&order=${order}`,
    ),
  getSummary: (tickers: string) =>
    request<SummaryResponse>(
      `/api/filings/summary?tickers=${encodeURIComponent(tickers)}`,
    ),
};
