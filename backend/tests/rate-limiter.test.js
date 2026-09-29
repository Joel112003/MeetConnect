import { jest } from "@jest/globals";
import express from "express";

process.env.NODE_ENV = "test";

jest.unstable_mockModule("../src/config/redisClient.js", () => ({
  client: {},
}));

const { authLimiter } = await import("../src/middleware/rateLimiter.middleware.js");
const { default: request } = await import("supertest");

const app = express();
app.get("/limited", authLimiter, (_req, res) => res.sendStatus(204));

test("returns 429 after the auth limit is exceeded", async () => {
  let response;
  for (let requestNumber = 0; requestNumber < 101; requestNumber += 1) {
    response = await request(app).get("/limited");
  }

  expect(response.status).toBe(429);
});