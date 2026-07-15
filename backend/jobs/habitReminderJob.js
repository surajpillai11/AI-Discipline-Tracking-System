import cron from "node-cron";
import Habit from "../models/Habit.js";
import { todayString } from "../utils/streakCalculator.js";
import { createNotification } from "../services/notificationService.js";
import { sendHabitReminderEmail } from "../services/emailService.js";

/**
 * Runs every minute, looking for active habits whose reminderTime matches
 * the current HH:mm and that haven't been completed yet today. Matching on
 * exact minute means a habit only fires once per day (assuming the job
 * doesn't miss its minute, which cron guarantees under normal load).
 */
const currentHHMM = () => {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

export const startHabitReminderJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const nowHHMM = currentHHMM();
      const today = todayString();

      const dueHabits = await Habit.find({
        isActive: true,
        reminderTime: nowHHMM,
      }).populate("user", "name email");

      for (const habit of dueHabits) {
        if (habit.completedDates.includes(today)) continue; // already done, skip the nag
        if (!habit.user) continue; // orphaned habit safety check

        await createNotification({
          userId: habit.user._id,
          type: "habit_reminder",
          title: `Time for: ${habit.name}`,
          message: `It's ${habit.reminderTime} - time to complete "${habit.name}". Current streak: ${habit.currentStreak} days.`,
          relatedHabit: habit._id,
        });

        try {
          await sendHabitReminderEmail(habit.user, habit);
        } catch (emailError) {
          console.error(`Failed to send habit reminder email: ${emailError.message}`);
        }
      }
    } catch (error) {
      console.error(`Habit reminder job error: ${error.message}`);
    }
  });

  console.log("Habit reminder job scheduled (every minute)");
};
