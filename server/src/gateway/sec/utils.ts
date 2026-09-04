import { config } from "../../config/config.js";
import type { Submissions, TickerRecordParsed } from "./sec.types.js";

export const getTickerCacheKey = (ticker: string) =>
  `ticker:${ticker.toUpperCase()}`;

export const getSummaryCacheKey = (tickers: string[]) =>
  `summary:${tickers.map((ticker) => ticker.toUpperCase()).join(",")}`;

export const getSubmissionsUrl = (companyCik: string) =>
  `${config.secSubmissionsUrl}CIK${companyCik}.json`;

const makeDocumentUrl = (
  companyCik: string,
  accessionNumber: string,
  document: string,
) =>
  `https://www.sec.gov/Archives/edgar/data/${Number(companyCik)}/${accessionNumber.replaceAll("-", "")}/${document}`;

export const constructFilings = (
  recent: Submissions["filings"]["recent"],
  company: TickerRecordParsed,
) => {
  const length = recent.accessionNumber.length;

  const filings = Array.from({ length }, (_, index) => {
    const accessionNumber = String(recent.accessionNumber[index]);
    const document = String(recent.primaryDocument[index]);
    return {
      accessionNumber,
      filingDate: String(recent.filingDate[index]),
      form: String(recent.form[index]),
      primaryDocument: document,
      primaryDocDescription: String(
        recent.primaryDocDescription?.[index] ?? document,
      ),
      reportDate: String(recent.reportDate?.[index] ?? ""),
      documentUrl: makeDocumentUrl(company.cik, accessionNumber, document),
    };
  });

  return filings;
};
