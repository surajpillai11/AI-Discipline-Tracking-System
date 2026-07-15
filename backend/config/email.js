import nodemailer from "nodemailer";

/**
 * Lazily creates (and caches) a nodemailer transporter using Gmail SMTP.
 * Returns null if email isn't configured, so callers can skip sending
 * instead of crashing - useful in dev when you haven't set up EMAIL_USER yet.
 *
 * For Gmail specifically, EMAIL_PASS must be an "app password", not your
 * normal account password (Google requires this for SMTP access).
 */
let cachedTransporter = null;

export const getEmailTransporter = () => {
  if (cachedTransporter) return cachedTransporter;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return cachedTransporter;
};
