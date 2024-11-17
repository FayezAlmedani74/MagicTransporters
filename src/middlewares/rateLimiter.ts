import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 1000 * 60 * 5,
  max: 100,
  message: "Too many requests, please try again later",
});
