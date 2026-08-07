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

if (process.env.NODE_ENV !== "production") {
  global.__nexusRedis = redis;
}

export function capacityKey(tenantId: string) {
  return `capacity:${tenantId}`;
}

export function holdKey(holdId: string) {
  return `hold:${holdId}`;
}
