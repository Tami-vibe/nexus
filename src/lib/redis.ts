import Redis from "ioredis";

declare global {
  var __nexusRedis: Redis | undefined;
}

function createRedis() {
  const url = process.env.REDIS_URL ?? "redis://localhost:6379";
  return new Redis(url, {
    maxRetriesPerRequest: 3,
    lazyConnect: false,
  });
}

export const redis: Redis = global.__nexusRedis ?? createRedis();

// ioredis emits connection failures as an "error" event on the client itself,
// separate from any promise a caller might await. Without a listener here,
// Node treats it as an unhandled error and crashes the whole process/request
// — including requests that never touched Redis. This keeps a Redis outage
// non-fatal until a real REDIS_URL is configured.
redis.on("error", (err) => {
  console.error("[redis] connection error (non-fatal):", err.message);
});

if (process.env.NODE_ENV !== "production") {
  global.__nexusRedis = redis;
}

export function capacityKey(tenantId: string) {
  return `capacity:${tenantId}`;
}

export function holdKey(holdId: string) {
  return `hold:${holdId}`;
}
