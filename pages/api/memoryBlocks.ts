import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";
import redis from "@/lib/redis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.userId;
  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "Invalid userId" });
  }

  // Try to get from Redis cache first
  const cacheKey = `memoryBlocks:${userId}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.status(200).json(JSON.parse(cached));
  }

  // Query memory blocks from Supabase
  const { data, error } = await supabase
    .from("memory_blocks")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Cache the result in Redis with an expiration (e.g. 60 seconds)
  await redis.set(cacheKey, JSON.stringify(data), "EX", 60);

  return res.status(200).json(data);
} 