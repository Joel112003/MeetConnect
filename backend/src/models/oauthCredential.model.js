import mongoose from "mongoose";

const oauthCredentialSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    provider: {
      type: String,
      enum: ["google"],
      required: true,
      index: true,
    },
    providerUserId: {
      type: String,
      default: null,
    },
    refreshTokenEnc: {
      type: String,
      default: null,
    },
    accessTokenEnc: {
      type: String,
      default: null,
    },
    accessTokenExpiresAt: {
      type: Date,
      default: null,
    },
    scope: {
      type: [String],
      default: [],
    },
    connectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

oauthCredentialSchema.index({ userId: 1, provider: 1 }, { unique: true });

export default mongoose.model("OAuthCredential", oauthCredentialSchema);
