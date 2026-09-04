import "dotenv/config";
import { z } from "zod";

/**
 * Environment configuration schema
 */
const envSchema = z.object({
  SEC_USER_AGENT: z
    .string()
    .min(1)
    .default("Quartr Research admin@quartr.example"),

  PORT: z.coerce.number().int().positive().default(3001),

  SEC_TIMEOUT_MS: z.coerce.number().int().positive().default(12000),

  REDIS_URL: z.string().min(1).default("redis://localhost:6379"),

  FILINGS_CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(900),

  SUMMARY_CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(300),

  TICKER_URL: z
    .string()
    .min(1)
    .default("https://www.sec.gov/files/company_tickers.json"),

  SEC_SUBMISSIONS_URL: z
    .string()
    .min(1)
    .default("https://data.sec.gov/submissions/"),
});

/**
 * Parsed environment configuration
 */
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  const details = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
  throw new Error(`Invalid environment configuration: ${details}`);
}

const env = parsedEnv.data;

export const config = {
  /** User agent string for SEC requests */
  secUserAgent: env.SEC_USER_AGENT,
  /** Port number for the server */
  port: env.PORT,
  /** SEC request timeout in milliseconds */
  secTimeoutMs: env.SEC_TIMEOUT_MS,
  /** Redis connection URL */
  redisUrl: env.REDIS_URL,
  /** Filings cache time-to-live in seconds */
  filingsCacheTtlSeconds: env.FILINGS_CACHE_TTL_SECONDS,
  /** Summary cache time-to-live in seconds */
  summaryCacheTtlSeconds: env.SUMMARY_CACHE_TTL_SECONDS,
  /** URL for the ticker data */
  tickerUrl: env.TICKER_URL,
  /** URL for the SEC submissions data */
  secSubmissionsUrl: env.SEC_SUBMISSIONS_URL,
};
