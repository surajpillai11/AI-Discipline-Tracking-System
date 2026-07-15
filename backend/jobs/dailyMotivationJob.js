import cron from "node-cron";
import User from "../models/User.js";
import { getUserOverviewStats } from "../services/overviewService.js";
import { createNotification } from "../services/notificationService.js";
import { sendDailyMotivationEmail } from "../services/emailService.js";

/**
 * Builds a motivational message from the user's actual numbers rather than
 * a random quote (per spec: "based on the user's actual progress"). Uses
 * simple, deterministic templates keyed off performance bands - no AI call
 * here deliberately, since this job runs for every user daily and hitting
 * the Gemini API per-user on a schedule would be slow and rate-limit-prone.
 * The AI Coach chat (Step 7) is still there for on-demand, richer AI motivation.
 */
const buildMotivationMessage = (stats) => {
  if (stats.totalActiveHabits === 0) {
    return "You haven't added any habits yet - pick one small thing to start today. Discipline is built one habit at a time.";
  }

  if (stats.longestCurrentStreak >= 30) {
    return `A ${stats.longestCurrentStreak}-day streak is genuinely impressive. Keep showing up today - consistency like this compounds.`;
  }

  if (stats.longestCurrentStreak >= 7) {
    return `You're ${stats.longestCurrentStreak} days into your streak. Don't let today be the day it breaks - one more rep.`;
  }

  if (stats.weeklyAverage >= 70) {
    return `Your weekly completion is sitting at ${stats.weeklyAverage}% - solid week. Keep the momentum going today.`;
  }

  if (stats.weeklyAverage >= 30) {
    return `Your weekly completion is ${stats.weeklyAverage}%. There's room to push - even one habit completed today moves the needle.`;
  }

  return "It's been a quieter week. That's fine - today's a clean slate. Pick one habit and just do that one.";
};

export const startDailyMotivationJob = () => {
  // 8:00 AM server time, every day
  cron.schedule("0 8 * * *", async () => {
    try {
      const users = await User.find().select("_id name email");

      for (const user of users) {
        const stats = await getUserOverviewStats(user._id);
        const message = buildMotivationMessage(stats);

        await createNotification({
          userId: user._id,
          type: "daily_motivation",
          title: "Your daily check-in",
          message,
        });

        try {
          await sendDailyMotivationEmail(user, message);
        } catch (emailError) {
          console.error(`Failed to send motivation email: ${emailError.message}`);
        }
      }
    } catch (error) {
      console.error(`Daily motivation job error: ${error.message}`);
    }
  });

  console.log("Daily motivation job scheduled (8:00 AM daily)");
};
