import type { Request, Response } from "express";
import { getSummary } from "../gateway/sec/sec.js";
import { summaryQuerySchema } from "../validation/index.js";

export async function getFilingSummary(request: Request, response: Response) {
  const { tickers } = summaryQuerySchema.parse(request.query);
  return response.json({ summaries: await getSummary(tickers) });
}
