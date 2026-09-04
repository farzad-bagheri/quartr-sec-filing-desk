import { createClient, type RedisClientType } from "redis";
import { config } from "../../config/config.js";

let client: RedisClientType | undefined;
let connectionAttempt: Promise<void> | undefined;

/**
 * Get the Redis client, establishing a connection if necessary.
 * Returns undefined if the connection could not be established.
 */
async function getClient() {
  if (!connectionAttempt) {
    client = createClient({
      url: config.redisUrl,
      socket: { reconnectStrategy: false },
    });

    client.on("error", (error) => console.warn("Redis error:", error.message));

    const redisClient = client;
    connectionAttempt = (async () => {
      try {
        await redisClient.connect();
      } catch (error: unknown) {
        console.warn(
          "Redis unavailable; continuing without cache:",
          error instanceof Error ? error.message : error,
        );
        client = undefined;
      }
    })();
  }

  await connectionAttempt;
  return client;
}

/**
 * Read a value from the cache by its key.
 * @param key The key to read from the cache.
 * @returns The value from the cache, or undefined if not found or on error.
 */
export async function readCache<T>(key: string): Promise<T | undefined> {
  const redis = await getClient();
  if (!redis) return undefined;

  try {
    const value = await redis.get(key);
    return value ? (JSON.parse(value) as T) : undefined;
  } catch (error) {
    console.warn(
      "Redis read failed:",
      error instanceof Error ? error.message : error,
    );
    return undefined;
  }
}

/**
 * Write a value to the cache with a specified time-to-live (TTL).
 * @param key The key to write to the cache.
 * @param value The value to store in the cache.
 * @param ttlSeconds The time-to-live for the cache entry, in seconds.
 */
export async function writeCache<T>(key: string, value: T, ttlSeconds: number) {
  const redis = await getClient();
  if (!redis) return;

  try {
    await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (error) {
    console.warn(
      "Redis write failed:",
      error instanceof Error ? error.message : error,
    );
  }
}
