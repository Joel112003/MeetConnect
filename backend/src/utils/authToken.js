import jwt from "jsonwebtoken";

export const getCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
});

export const signAppToken = (user) => {
  return jwt.sign(
    { id: user._id, tokenVersion: user.tokenVersion || 0 },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );
};

export const attachAuthCookie = (res, token) => {
  res.cookie("token", token, {
    ...getCookieOptions(),
    maxAge: 3600000,
  });
};

export const clearAuthCookie = (res) => {
  res.clearCookie("token", getCookieOptions());
};
