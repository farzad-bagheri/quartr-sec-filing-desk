import type { Request, Response } from "express";
import { getFilings } from "../gateway/sec/sec.js";
import { filterFilings, getTotalPages } from "../utils/index.js";
import { filingsQuerySchema, tickerParamSchema } from "../validation/index.js";

export async function getCompanyFilings(request: Request, response: Response) {
  const { ticker } = tickerParamSchema.parse(request.params);
  const { page, limit, formType, order } = filingsQuerySchema.parse(
    request.query,
  );
  const result = await getFilings(ticker);
  const filtered = filterFilings(result.filings, order, formType);
  const totalPages = getTotalPages(filtered.length, limit);

  return response.json({
    company: result.company,
    cik: result.cik,
    filings: filtered.slice((page - 1) * limit, page * limit),
    pagination: { total: filtered.length, page, limit, totalPages },
  });
}
