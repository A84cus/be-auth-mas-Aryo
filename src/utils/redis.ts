import * as redis from "redis";

export const redisClient = redis.createClient({
  url: "redis://localhost:8081",
});

redisClient.on("error", (err) => console.log("Redis client error, ", err));

redisClient.connect();
