import { jest } from "@jest/globals";
import RedisMock from "ioredis-mock";

jest.setTimeout(120000);
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "meeting-test-secret-that-is-long-enough";
process.env.FRONTEND_URL = "http://localhost:5173";
process.env.CLIENT_URL = "http://localhost:5173";

const redisClient = new RedisMock();
const registeredRooms = new Set();
const passThrough = (_req, _res, next) => next();
const calendar = {
  createCalendarEventForUser: jest.fn().mockResolvedValue({ id: "google-event-1" }),
  updateCalendarEventForUser: jest.fn().mockResolvedValue({ id: "google-event-1" }),
  deleteCalendarEventForUser: jest.fn().mockResolvedValue(undefined),
  cancelCalendarEventForUser: jest.fn().mockResolvedValue(undefined),
  getGoogleCredentialForUser: jest.fn().mockResolvedValue(null),
  createGoogleOAuthClient: jest.fn(),
  storeGoogleTokensForUser: jest.fn(),
};

jest.unstable_mockModule("../src/config/redisClient.js", () => ({ client: redisClient }));
jest.unstable_mockModule("../src/middleware/rateLimiter.middleware.js", () => ({
  authLimiter: passThrough,
  loginIpLimiter: passThrough,
  loginEmailLimiter: passThrough,
  globalLimiter: passThrough,
}));
jest.unstable_mockModule("../src/services/email.service.js", () => ({
  sendOtpEmail: jest.fn(),
  sendSecurityNotificationEmail: jest.fn(),
}));
jest.unstable_mockModule("../src/controllers/SocketManager.js", () => ({
  registerRoom: jest.fn(async (roomKey) => registeredRooms.add(roomKey)),
  isRoomRegistered: jest.fn(async (roomKey) => registeredRooms.has(roomKey)),
  InitializeSocketIO: jest.fn(),
}));
jest.unstable_mockModule("../src/services/googleCalendar.service.js", () => calendar);

const { default: request } = await import("supertest");
const mongoose = (await import("mongoose")).default;
const { MongoMemoryServer } = await import("mongodb-memory-server");
const { default: app } = await import("../app.js");
const { default: User } = await import("../src/models/user.model.js");
const { default: ScheduledMeeting } = await import("../src/models/scheduledMeeting.model.js");

let mongoServer;
let cookie;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

beforeEach(async () => {
  await User.deleteMany({});
  await ScheduledMeeting.deleteMany({});
  await redisClient.flushall();
  registeredRooms.clear();
  const register = await request(app).post("/api/v1/users/register").send({
    username: "meeting-user",
    email: "meeting@example.com",
    password: "StrongPass123!",
  });
  cookie = register.headers["set-cookie"][0].split(";")[0];
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

test("creates a room and validates valid and invalid meeting codes", async () => {
  const created = await request(app)
    .post("/api/v1/meetings/create-room")
    .set("Cookie", cookie);
  const valid = await request(app)
    .get(`/api/v1/meetings/validate/${created.body.code.toLowerCase()}`)
    .set("Cookie", cookie);
  const invalid = await request(app)
    .get("/api/v1/meetings/validate/NOPE99")
    .set("Cookie", cookie);

  expect(created.status).toBe(201);
  expect(valid.body).toMatchObject({ success: true, valid: true, type: "instant" });
  expect(invalid.body).toMatchObject({ success: true, valid: false, type: null });
});

test("schedules, updates, and deletes a meeting with Google Calendar mocked", async () => {
  const scheduled = await request(app)
    .post("/api/v1/meetings/schedule")
    .set("Cookie", cookie)
    .send({
      title: "Design review",
      description: "Review the next release",
      startTime: "2026-10-01T10:00:00.000Z",
      endTime: "2026-10-01T11:00:00.000Z",
      attendees: ["bob@example.com"],
      addToCalendar: true,
    });
  const id = scheduled.body.meeting._id;
  const updated = await request(app)
    .put(`/api/v1/meetings/${id}`)
    .set("Cookie", cookie)
    .send({ title: "Updated review" });
  const deleted = await request(app)
    .delete(`/api/v1/meetings/${id}`)
    .set("Cookie", cookie);

  expect(scheduled.status).toBe(201);
  expect(calendar.createCalendarEventForUser).toHaveBeenCalled();
  expect(updated.status).toBe(200);
  expect(updated.body.meeting.title).toBe("Updated review");
  expect(deleted.status).toBe(200);
  expect(await ScheduledMeeting.findById(id)).toBeNull();
});
