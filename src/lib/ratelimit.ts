import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Only initialize if we have the env vars, otherwise return a mock that always passes.
// This prevents local development from breaking if Redis isn't set up yet.
const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  ? Redis.fromEnv()
  : null;

// Fallback mock for local development without Redis
const mockRatelimit = {
  limit: async (identifier: string) => {
    return { success: true, pending: Promise.resolve(), limit: 10, remaining: 9, reset: 0 };
  }
};

// Create a new ratelimiter, that allows 10 requests per 10 seconds per IP/User
export const ratelimit = redis ? new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
}) : mockRatelimit;
