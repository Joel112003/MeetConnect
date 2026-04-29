import crypto from "crypto";

const getKey = () => {
  const configuredKey = process.env.GOOGLE_TOKEN_ENCRYPTION_KEY;

  if (configuredKey) {
    const fromBase64 = Buffer.from(configuredKey, "base64");
    if (fromBase64.length === 32) return fromBase64;

    const fromUtf8 = Buffer.from(configuredKey, "utf8");
    if (fromUtf8.length === 32) return fromUtf8;
  }

  // Fallback keeps app functional in local dev; set GOOGLE_TOKEN_ENCRYPTION_KEY in production.
  const fallbackSource = process.env.JWT_SECRET || "meetconnect-dev-fallback-key";
  return crypto.createHash("sha256").update(fallbackSource).digest();
};

const KEY = getKey();

export const encryptText = (plainText) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(String(plainText), "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
};

export const decryptText = (encryptedPayload) => {
  const payload = Buffer.from(encryptedPayload, "base64");
  const iv = payload.subarray(0, 12);
  const authTag = payload.subarray(12, 28);
  const encrypted = payload.subarray(28);

  const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};
