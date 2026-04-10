import nodemailer from "nodemailer";

const OTP_EXPIRY_MINUTES = 10;

const getTransporter = () => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    throw new Error("SMTP_USER and SMTP_PASS are required in environment");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
};

const buildMailFrom = () => process.env.SMTP_FROM || process.env.SMTP_USER;

export const sendOtpEmail = async (toEmail, otp) => {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: buildMailFrom(),
    to: toEmail,
    subject: "MeetConnect Password Reset OTP",
    text: `Your MeetConnect password reset OTP is ${otp}. It is valid for ${OTP_EXPIRY_MINUTES} minutes.`,
    html: `<p>Your MeetConnect password reset OTP is <b>${otp}</b>.</p><p>This OTP is valid for ${OTP_EXPIRY_MINUTES} minutes.</p>`,
  });
};

export const sendSecurityNotificationEmail = async ({ toEmail, subject, message }) => {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: buildMailFrom(),
    to: toEmail,
    subject,
    text: message,
    html: `<p>${message}</p>`,
  });
};
