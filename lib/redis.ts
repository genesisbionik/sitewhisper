import Redis from "ioredis";

// Validate environment variable first
if (!process.env.REDIS_URL && process.env.NODE_ENV === 'production') {
  throw new Error('REDIS_URL is required in production');
}

// Initialize with proper type safety
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: 3,
  connectTimeout: 5000,
});

export default redis; 