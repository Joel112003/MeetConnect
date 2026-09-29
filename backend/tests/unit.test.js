import { jest } from "@jest/globals";

process.env.JWT_SECRET = "unit-test-secret";

const { encryptText, decryptText } = await import("../src/utils/cryptoToken.js");
const { normalizeMeetingCode } = await import("../src/utils/meeting.js");
const { toPublicUser } = await import("../src/utils/userMapper.js");

describe("utility units", () => {
  test("encrypts and decrypts an AES token", () => {
    const encrypted = encryptText("calendar-refresh-token");

    expect(encrypted).not.toBe("calendar-refresh-token");
    expect(decryptText(encrypted)).toBe("calendar-refresh-token");
  });

  test("rejects tampered encrypted data", () => {
    const encrypted = encryptText("secret");
    const tampered = `${encrypted.slice(0, -2)}xx`;

    expect(() => decryptText(tampered)).toThrow();
  });

  test("normalizes meeting codes", () => {
    expect(normalizeMeetingCode("  aBc-123 ")).toBe("ABC-123");
    expect(normalizeMeetingCode()).toBe("");
  });

  test("maps only public user fields", () => {
    const user = {
      _id: "user-id",
      username: "alice",
      email: "alice@example.com",
      createdAt: new Date("2026-01-01"),
      password: "hashed-password",
      tokenVersion: 3,
      resetPasswordOtpHash: "otp-hash",
    };

    expect(toPublicUser(user)).toEqual({
      _id: "user-id",
      username: "alice",
      email: "alice@example.com",
      createdAt: user.createdAt,
    });
  });
});
