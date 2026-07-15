import cron from "node-cron";
import User from "../models/User.js";
import { getUserOverviewStats } from "../services/overviewService.js";
import { createNotification } from "../services/notificationService.js";
import { sendWeeklyReportReadyEmail } from "../services/emailService.js";

/**
 * Runs weekly and nudges every user to go generate/check their AI weekly
 * report (Step 9). Deliberately does NOT auto-call the Gemini-backed
 * /api/reports/weekly/generate for every user here - doing that inside a
 * scheduled job for potentially many users would risk hammering the AI
 * rate limit and running up API costs unattended. Instead this just
 * surfaces a reminder with their real weekly number; the user (or the
 * frontend, on next login) triggers the actual AI generation on demand.
 */
export const startWeeklyReportReminderJob = () => {
  // Every Sunday at 6:00 PM server time
  cron.schedule("0 18 * * 0", async () => {
    try {
      const users = await User.find().select("_id name email");

      for (const user of users) {
        const stats = await getUserOverviewStats(user._id);

        await createNotification({
          userId: user._id,
          type: "weekly_report",
          title: "Your weekly report is ready to view",
          message: `This week's average completion was ${stats.weeklyAverage}%. Check your full weekly review in the app.`,
        });

        try {
          await sendWeeklyReportReadyEmail(user, stats.weeklyAverage);
        } catch (emailError) {
          console.error(`Failed to send weekly report email: ${emailError.message}`);
        }
      }
    } catch (error) {
      console.error(`Weekly report reminder job error: ${error.message}`);
    }
  });

  console.log("Weekly report reminder job scheduled (Sundays, 6:00 PM)");
};
