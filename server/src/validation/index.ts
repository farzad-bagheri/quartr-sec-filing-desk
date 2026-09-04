import z from "zod";

export const tickerParamSchema = z.object({
  ticker: z
    .string()
    .trim()
    .min(1)
    .max(10)
    .regex(/^[a-zA-Z0-9.-]+$/),
});

export const filingsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  formType: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z
      .string()
      .trim()
      .min(1)
      .max(20)
      .transform((value) => value.toUpperCase())
      .optional(),
  ),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const tickerValue = z
  .string()
  .trim()
  .min(1)
  .max(10)
  .regex(/^[a-zA-Z0-9.-]+$/);

export const summaryQuerySchema = z.object({
  tickers: z
    .string()
    .trim()
    .min(1)
    .transform((value) =>
      value
        .split(",")
        .map((ticker) => ticker.trim())
        .filter(Boolean)
        .slice(0, 10),
    )
    .pipe(z.array(tickerValue).min(1).max(10)),
});
