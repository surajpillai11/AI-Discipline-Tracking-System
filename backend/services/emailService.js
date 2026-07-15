import { getEmailTransporter } from "../config/email.js";

/**
 * Sends an email if EMAIL_USER/EMAIL_PASS are configured; silently no-ops
 * (with a console log) otherwise, so the app keeps working in dev without
 * email set up. In-app Notification records are created regardless - email
 * is a bonus delivery channel, not the source of truth.
 */
const sendEmail = async ({ to, subject, html }) => {
  const transporter = getEmailTransporter();

  if (!transporter) {
    console.log(`[email skipped - not configured] Would have sent "${subject}" to ${to}`);
    return { sent: false };
  }

  await transporter.sendMail({
    from: `"Discipline Tracker" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  return { sent: true };
};

const wrapTemplate = (title, bodyHtml) => `
  <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
    <h2 style="color: #6d28d9; margin-bottom: 4px;">${title}</h2>
    ${bodyHtml}
    <p style="margin-top: 32px; font-size: 12px; color: #888;">— Discipline Tracker</p>
  </div>
`;

export const sendHabitReminderEmail = async (user, habit) => {
  return sendEmail({
    to: user.email,
    subject: `Reminder: ${habit.name}`,
    html: wrapTemplate(
      "Time for your habit!",
      `<p>Hey ${user.name}, it's time for <strong>${habit.name}</strong>.</p>
       <p>Current streak: <strong>${habit.currentStreak} days</strong> — keep it going!</p>`
    ),
  });
};

export const sendDailyMotivationEmail = async (user, message) => {
  return sendEmail({
    to: user.email,
    subject: "Your daily discipline check-in",
    html: wrapTemplate("Daily Motivation", `<p>${message}</p>`),
  });
};

export const sendWeeklyReportReadyEmail = async (user, weeklyAverage) => {
  return sendEmail({
    to: user.email,
    subject: "Your weekly discipline report is ready",
    html: wrapTemplate(
      "Weekly Report Ready",
      `<p>Hey ${user.name}, your weekly average completion was <strong>${weeklyAverage}%</strong>.</p>
       <p>Log in to see your full breakdown, strengths, and suggested improvements.</p>`
    ),
  });
};
