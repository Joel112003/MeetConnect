import { jest } from "@jest/globals";
import { createServer } from "node:http";
import RedisMock from "ioredis-mock";

jest.setTimeout(30000);
process.env.CLIENT_URL = "http://localhost:5173";

const redisClient = new RedisMock();
redisClient.sAdd = (...args) => redisClient.sadd(...args);
redisClient.sIsMember = (...args) => redisClient.sismember(...args);
redisClient.lRange = (...args) => redisClient.lrange(...args);
redisClient.rPush = (...args) => redisClient.rpush(...args);
jest.unstable_mockModule("../src/config/redisClient.js", () => ({
  client: redisClient,
}));

const { InitializeSocketIO, registerRoom } = await import("../src/controllers/SocketManager.js");
const { io: connectClient } = await import("socket.io-client");

let httpServer;
let io;
let url;
const clients = [];

const waitForEvent = (socket, event, timeout = 3000) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timed out waiting for ${event}`)), timeout);
    socket.once(event, (...args) => {
      clearTimeout(timer);
      resolve(args);
    });
  });

const connect = async () => {
  const socket = connectClient(url, { transports: ["websocket"] });
  clients.push(socket);
  await waitForEvent(socket, "connect");
  return socket;
};

beforeAll(async () => {
  httpServer = createServer();
  io = InitializeSocketIO(httpServer);
  await new Promise((resolve) => httpServer.listen(0, "127.0.0.1", resolve));
  url = `http://127.0.0.1:${httpServer.address().port}`;
});

afterEach(async () => {
  clients.splice(0).forEach((socket) => socket.disconnect());
  await redisClient.flushall();
});

afterAll(async () => {
  io.close();
  await new Promise((resolve) => httpServer.close(resolve));
});

test("rejects an invalid room and joins a registered room", async () => {
  const client = await connect();
  const invalid = waitForEvent(client, "join-error");
  client.emit("join-call", { path: "meeting:missing", username: "Alice" });

  await expect(invalid).resolves.toEqual([
    { code: "ROOM_NOT_FOUND", message: "Meeting room not found." },
  ]);

  await registerRoom("meeting:valid");
  const joined = waitForEvent(client, "user-joined");
  client.emit("join-call", { path: "meeting:valid", username: "Alice" });
  const [payload] = await joined;

  expect(payload.name).toBe("Alice");
  expect(payload.clients).toEqual(expect.arrayContaining([
    expect.objectContaining({ name: "Alice" }),
  ]));
});

test("relays signals, delivers and persists chat, and broadcasts user-left", async () => {
  await registerRoom("meeting:room");
  const first = await connect();
  const second = await connect();
  first.emit("join-call", { path: "meeting:room", username: "Alice" });
  second.emit("join-call", { path: "meeting:room", username: "Bob" });
  await waitForEvent(first, "user-joined");

  const signal = waitForEvent(second, "signal");
  first.emit("signal", second.id, { type: "offer", value: "test" });
  expect(await signal).toEqual([first.id, { type: "offer", value: "test" }]);

  const chat = waitForEvent(second, "chat-message");
  second.emit("chat-message", { message: "hello", username: "Bob" });
  expect(await chat).toEqual(["hello", "Bob", second.id]);

  const historyClient = await connect();
  const history = waitForEvent(historyClient, "chat-message");
  historyClient.emit("join-call", { path: "meeting:room", username: "Cara" });
  expect(await history).toEqual(["hello", "Bob", second.id]);

  const secondId = second.id;
  const left = waitForEvent(first, "user-left");
  second.disconnect();
  expect(await left).toEqual([{ id: secondId, name: "Bob" }]);
});
