import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type WindowStr = "15 m" | "1 h";

let redisSingleton: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redisSingleton !== undefined) return redisSingleton;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    redisSingleton = null;
    return null;
  }
  redisSingleton = new Redis({ url, token });
  return redisSingleton;
}

const ratelimitCache = new Map<string, Ratelimit>();

function getRatelimit(prefix: string, max: number, window: WindowStr): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  const key = `${prefix}:${max}:${window}`;
  let rl = ratelimitCache.get(key);
  if (!rl) {
    rl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(max, window),
      prefix,
    });
    ratelimitCache.set(key, rl);
  }
  return rl;
}

const memCounts = new Map<string, number>();

function memoryFixedWindow(key: string, max: number, windowMs: number): boolean {
  const slot = Math.floor(Date.now() / windowMs);
  const k = `${key}:${slot}`;
  const next = (memCounts.get(k) ?? 0) + 1;
  memCounts.set(k, next);
  return next <= max;
}

async function runLimit(
  identifier: string,
  options: { prefix: string; max: number; window: WindowStr; windowMs: number }
): Promise<boolean> {
  const rl = getRatelimit(options.prefix, options.max, options.window);
  if (rl) {
    const { success } = await rl.limit(identifier);
    return success;
  }

  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[rate-limit] Configura UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN en Vercel para activar límites."
    );
    return true;
  }

  return memoryFixedWindow(`${options.prefix}:${identifier}`, options.max, options.windowMs);
}

/** Comentarios: por usuario autenticado. */
export async function rateLimitSubmitComment(userId: string): Promise<boolean> {
  return runLimit(userId, {
    prefix: "submit-comment",
    max: 20,
    window: "15 m",
    windowMs: 15 * 60 * 1000,
  });
}

/** Reportes: por usuario. */
export async function rateLimitReportComment(userId: string): Promise<boolean> {
  return runLimit(userId, {
    prefix: "report-comment",
    max: 25,
    window: "1 h",
    windowMs: 60 * 60 * 1000,
  });
}

/** Newsletter: por IP (público, sin sesión). */
export async function rateLimitNewsletter(ip: string): Promise<boolean> {
  return runLimit(ip, {
    prefix: "newsletter",
    max: 8,
    window: "1 h",
    windowMs: 60 * 60 * 1000,
  });
}

/** OAuth callback GET: por IP. */
export async function rateLimitAuthCallback(ip: string): Promise<boolean> {
  return runLimit(ip, {
    prefix: "auth-callback",
    max: 50,
    window: "15 m",
    windowMs: 15 * 60 * 1000,
  });
}
