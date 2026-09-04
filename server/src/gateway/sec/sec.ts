import {
  constructFilings,
  getSubmissionsUrl,
  getTickerCacheKey,
  getSummaryCacheKey,
} from "./utils.js";
import { config } from "../../config/config.js";
import type {
  Filing,
  Submissions,
  TickerMap,
  TickerRecordParsed,
} from "./sec.types.js";
import { readCache, writeCache } from "../cache/cache.js";

const SEC_HEADERS = {
  "User-Agent": config.secUserAgent,
  Accept: "application/json",
};

/**
 * In-memory cache for SEC data
 */
const tickerMapCache = new Map<string, { expires: number; value: unknown }>();

/**
 * Fetch data from the SEC with proper headers and timeout handling
 */
async function secFetch<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.secTimeoutMs);
  try {
    const response = await fetch(url, {
      headers: SEC_HEADERS,
      signal: controller.signal,
    });

    if (!response.ok)
      throw new Error(`SEC request failed (${response.status})`);

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError")
      throw new Error("SEC request timed out", { cause: error });

    throw new Error("Unable to fetch SEC data", { cause: error });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Retrieves a mapping of company tickers to their corresponding SEC records.
 * @returns A record mapping tickers to their corresponding SEC records.
 */
async function getTickerMap() {
  const tickerUrl = config.tickerUrl;
  const cached = tickerMapCache.get(tickerUrl);
  // Check if the ticker map is cached and still valid
  if (cached && cached.expires > Date.now()) return cached.value as TickerMap;

  // Fetch the ticker map from the SEC if not cached or expired
  const value = await secFetch<TickerMap>(tickerUrl);
  tickerMapCache.set(tickerUrl, { expires: Date.now() + 86_400_000, value });
  return value;
}

/**
 * Resolves a company ticker to its corresponding SEC record.
 * @param ticker The company ticker symbol to resolve.
 * @returns The parsed SEC record for the given ticker.
 */
export async function resolveCompany(
  ticker: string,
): Promise<TickerRecordParsed> {
  const normalized = ticker.trim().toUpperCase();
  const match = Object.values(await getTickerMap()).find(
    (record) => record.ticker.toUpperCase() === normalized,
  );

  if (!match) throw new Error(`Unknown ticker: ${normalized}`);

  return {
    ticker: normalized,
    cik: String(match.cik_str).padStart(10, "0"),
    title: match.title,
  };
}

/**
 * Retrieves the filings for a given company ticker symbol.
 * @param ticker The company ticker symbol to retrieve filings for.
 * @returns An object containing the company name, CIK, and an array of filings.
 */
export async function getFilings(
  ticker: string,
): Promise<{ company: string; cik: string; filings: Filing[] }> {
  const company = await resolveCompany(ticker);
  const cacheKey = getTickerCacheKey(company.ticker);

  // Check if the filings for this company are cached
  const cached = await readCache<{
    company: string;
    cik: string;
    filings: Filing[];
  }>(cacheKey);
  if (cached) return cached;

  const submissions = await secFetch<Submissions>(
    getSubmissionsUrl(company.cik),
  );

  const recent = submissions.filings?.recent;
  if (!recent || !Array.isArray(recent.accessionNumber))
    throw new Error("SEC response did not include recent filing data");

  const result = {
    company: submissions.name || company.title,
    cik: company.cik,
    filings: constructFilings(recent, company),
  };
  await writeCache(cacheKey, result, config.filingsCacheTtlSeconds);
  return result;
}

/**
 * Retrieves a summary of filings for the specified company ticker symbols over the past year.
 * @param tickers An array of company ticker symbols to retrieve summaries for.
 * @returns A promise that resolves to an array of summary objects for each ticker, including the ticker symbol, company name, forms count, and the latest 10-K filing date.
 */
export async function getSummary(tickers: string[]) {
  const cacheKey = getSummaryCacheKey(tickers);
  type Summary = {
    ticker: string;
    company: string;
    forms: Record<string, number>;
    latest10K: string | null;
  };
  const cached = await readCache<Summary[]>(cacheKey);
  if (cached) return cached;

  const since = new Date();
  since.setFullYear(since.getFullYear() - 1);

  const summaries = await Promise.all(
    tickers.map(async (ticker) => {
      const result = await getFilings(ticker);
      const recent = result.filings.filter(
        (filing) => new Date(filing.filingDate) >= since,
      );
      // Filter the filings to only include those within the past year
      const forms = recent.reduce<Record<string, number>>(
        (acc, filing) => ({
          ...acc,
          [filing.form]: (acc[filing.form] ?? 0) + 1,
        }),
        {},
      );

      return {
        ticker: ticker.toUpperCase(),
        company: result.company,
        forms,
        latest10K:
          result.filings.find((filing) => filing.form === "10-K")?.filingDate ??
          null,
      };
    }),
  );
  await writeCache(cacheKey, summaries, config.summaryCacheTtlSeconds);
  return summaries;
}
