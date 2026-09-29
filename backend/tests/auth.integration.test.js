import { jest } from "@jest/globals";
import RedisMock from "ioredis-mock";

jest.setTimeout(120000);

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-that-is-long-enough";
process.env.FRONTEND_URL = "http://localhost:5173";
process.env.CLIENT_URL = "http://localhost:5173";
process.env.GOOGLE_CLIENT_ID = "test-google-client";
process.env.GOOGLE_TOKEN_ENCRYPTION_KEY = "12345678901234567890123456789012";

const redisClient = new RedisMock();
const registeredRooms = new Set();
const sendOtpEmail = jest.fn().mockResolvedValue(undefined);
const sendSecurityNotificationEmail = jest.fn().mockResolvedValue(undefined);
const passThrough = (_req, _res, next) => next();

jest.unstable_mockModule("../src/config/redisClient.js", () => ({
  client: redisClient,
}));
jest.unstable_mockModule("../src/middleware/rateLimiter.middleware.js", () => ({
  authLimiter: passThrough,
  loginIpLimiter: passThrough,
  loginEmailLimiter: passThrough,
  globalLimiter: passThrough,
}));
jest.unstable_mockModule("../src/services/email.service.js", () => ({
  sendOtpEmail,
  sendSecurityNotificationEmail,
}));
jest.unstable_mockModule("../src/controllers/SocketManager.js", () => ({
  registerRoom: jest.fn(async (roomKey) => registeredRooms.add(roomKey)),
  isRoomRegistered: jest.fn(async (roomKey) => registeredRooms.has(roomKey)),
  InitializeSocketIO: jest.fn(),
}));
jest.unstable_mockModule("../src/services/googleCalendar.service.js", () => ({
  createGoogleOAuthClient: jest.fn(),
  createCalendarEventForUser: jest.fn(),
  updateCalendarEventForUser: jest.fn(),
  deleteCalendarEventForUser: jest.fn(),
  cancelCalendarEventForUser: jest.fn(),
  getGoogleCredentialForUser: jest.fn(),
  storeGoogleTokensForUser: jest.fn(),
}));

const { default: request } = await import("supertest");
const mongoose = (await import("mongoose")).default;
const { MongoMemoryServer } = await import("mongodb-memory-server");
const { default: app } = await import("../app.js");
const { default: User } = await import("../src/models/user.model.js");

let mongoServer;

const register = (overrides = {}) =>
  request(app).post("/api/v1/users/register").send({
    username: "alice",
    email: "alice@example.com",
    password: "StrongPass123!",
    ...overrides,
  });

const login = (email = "alice@example.com", password = "StrongPass123!") =>
  request(app).post("/api/v1/users/login").send({ email, password });

const cookieFrom = (response) => response.headers["set-cookie"][0].split(";")[0];

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  await User.deleteMany({});
  await redisClient.flushall();
  registeredRooms.clear();
  sendOtpEmail.mockClear();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("authentication", () => {
  test("registers a user and sets an HTTP-only auth cookie", async () => {
    const response = await register();

    expect(response.status).toBe(201);
    expect(response.headers["set-cookie"][0]).toMatch(/token=.*HttpOnly/i);
    expect(response.body.user).not.toHaveProperty("password");
  });

  test("rejects duplicate email", async () => {
    await register();
    const response = await register({ username: "another" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email already exists");
  });

  test("records the current weak-password behavior", async () => {
    const response = await register({ password: "123" });

    expect(response.status).toBe(201);
  });

  test("logs in with valid credentials and rejects a wrong password", async () => {
    await register();

    const success = await login();
    const failure = await login("alice@example.com", "wrong-password");

    expect(success.status).toBe(200);
    expect(success.headers["set-cookie"][0]).toMatch(/token=.*HttpOnly/i);
    expect(failure.status).toBe(400);
  });

  test("rejects missing and invalid protected-route tokens", async () => {
    const missing = await request(app).get("/api/v1/users/me");
    const invalid = await request(app)
      .get("/api/v1/users/me")
      .set("Cookie", "token=invalid");

    expect(missing.status).toBe(401);
    expect(invalid.status).toBe(401);
  });

  test("logout clears the session and invalidates the cookie", async () => {
    await register();
    const cookie = cookieFrom(await login());

    const logout = await request(app)
      .post("/api/v1/users/logout")
      .set("Cookie", cookie);
    const protectedResponse = await request(app)
      .get("/api/v1/users/me")
      .set("Cookie", cookie);

    expect(logout.status).toBe(200);
    expect(protectedResponse.status).toBe(401);
  });

  test("logout-all-devices invalidates an old token through token versioning", async () => {
    await register();
    const cookie = cookieFrom(await login());

    const logoutAll = await request(app)
      .post("/api/v1/users/logout-all-devices")
      .set("Cookie", cookie);
    const protectedResponse = await request(app)
      .get("/api/v1/users/me")
      .set("Cookie", cookie);

    expect(logoutAll.status).toBe(200);
    expect(protectedResponse.status).toBe(401);
  });

  test("locks the account after repeated wrong passwords", async () => {
    await register();

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await login("alice@example.com", "wrong-password");
    }
    const locked = await login("alice@example.com", "StrongPass123!");

    expect(locked.status).toBe(429);
  });
});

describe("password reset", () => {
  test("requests, rejects wrong and expired OTPs, then verifies the correct OTP", async () => {
    await register();

    const requestOtp = await request(app)
      .post("/api/v1/users/forgot-password")
      .send({ email: "alice@example.com" });
    const otp = sendOtpEmail.mock.calls[0][1];
    const wrong = await request(app)
      .post("/api/v1/users/verify-reset-otp")
      .send({ email: "alice@example.com", otp: "000000" });
    const correct = await request(app)
      .post("/api/v1/users/verify-reset-otp")
      .send({ email: "alice@example.com", otp });

    expect(requestOtp.status).toBe(200);
    expect(wrong.status).toBe(400);
    expect(correct.status).toBe(200);

    await User.updateOne(
      { email: "alice@example.com" },
      { resetPasswordOtpExpiresAt: new Date(Date.now() - 1000) },
    );
    const expired = await request(app)
      .post("/api/v1/users/verify-reset-otp")
      .send({ email: "alice@example.com", otp });

    expect(expired.status).toBe(400);
  });

  test("resets the password after OTP verification", async () => {
    await register();
    await request(app)
      .post("/api/v1/users/forgot-password")
      .send({ email: "alice@example.com" });
    const otp = sendOtpEmail.mock.calls[0][1];
    await request(app)
      .post("/api/v1/users/verify-reset-otp")
      .send({ email: "alice@example.com", otp });

    const reset = await request(app)
      .post("/api/v1/users/reset-password")
      .send({ email: "alice@example.com", newPassword: "NewStrong123!" });
    const loginWithNewPassword = await login(
      "alice@example.com",
      "NewStrong123!",
    );

    expect(reset.status).toBe(200);
    expect(loginWithNewPassword.status).toBe(200);
  });
});
