import { google } from "googleapis";
import OAuthCredential from "../models/oauthCredential.model.js";
import { decryptText, encryptText } from "../utils/cryptoToken.js";

const getRedirectUri = () =>
  process.env.GOOGLE_REDIRECT_URI ||
  "http://localhost:8000/api/v1/meetings/google/callback";

export const createGoogleOAuthClient = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    getRedirectUri(),
  );
};

const parseScope = (scopeValue) => {
  if (!scopeValue) return [];
  if (Array.isArray(scopeValue)) return scopeValue;
  return String(scopeValue)
    .split(" ")
    .map((value) => value.trim())
    .filter(Boolean);
};

export const getGoogleCredentialForUser = async (userId) => {
  return OAuthCredential.findOne({ userId, provider: "google" });
};

export const storeGoogleTokensForUser = async ({
  userId,
  providerUserId,
  tokens,
  preserveExistingRefreshToken = true,
}) => {
  const existing = await getGoogleCredentialForUser(userId);

  const nextRefreshToken =
    tokens.refresh_token ||
    (preserveExistingRefreshToken && existing?.refreshTokenEnc
      ? decryptText(existing.refreshTokenEnc)
      : null);

  const update = {
    providerUserId: providerUserId || existing?.providerUserId || null,
    accessTokenEnc: tokens.access_token
      ? encryptText(tokens.access_token)
      : existing?.accessTokenEnc || null,
    accessTokenExpiresAt: tokens.expiry_date
      ? new Date(tokens.expiry_date)
      : existing?.accessTokenExpiresAt || null,
    scope:
      parseScope(tokens.scope).length > 0
        ? parseScope(tokens.scope)
        : existing?.scope || [],
    connectedAt: new Date(),
  };

  if (nextRefreshToken) {
    update.refreshTokenEnc = encryptText(nextRefreshToken);
  }

  return OAuthCredential.findOneAndUpdate(
    { userId, provider: "google" },
    update,
    { upsert: true, returnDocument: "after" },
  );
};

export const createCalendarEventForUser = async (userId, meeting) => {
  const credential = await getGoogleCredentialForUser(userId);

  if (!credential?.refreshTokenEnc) {
    const error = new Error("Google Calendar not connected");
    error.code = "GOOGLE_NOT_CONNECTED";
    throw error;
  }

  const oauth2Client = createGoogleOAuthClient();
  oauth2Client.setCredentials({
    refresh_token: decryptText(credential.refreshTokenEnc),
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  // Use the raw string with offset directly — no timeZone field, no toISOString()
  const startDateTime =
    typeof meeting.startTime === "string"
      ? meeting.startTime
      : meeting.startTime.toISOString();

  const endDateTime =
    typeof meeting.endTime === "string"
      ? meeting.endTime
      : meeting.endTime.toISOString();

  const event = {
    summary: meeting.title,
    description: meeting.description || "",
    start: { dateTime: startDateTime },
    end: { dateTime: endDateTime },
    attendees: (meeting.attendees || []).map((email) => ({ email })),
  };

  console.log("Sending to Google:", {
    start: event.start.dateTime,
    end: event.end.dateTime,
  });

  const response = await calendar.events.insert({
    calendarId: "primary",
    sendUpdates: "all",
    resource: event,
  });

  const refreshedTokens = oauth2Client.credentials;
  if (refreshedTokens?.access_token || refreshedTokens?.expiry_date) {
    await storeGoogleTokensForUser({
      userId,
      providerUserId: credential.providerUserId,
      tokens: refreshedTokens,
      preserveExistingRefreshToken: true,
    });
  }

  return response.data;
};