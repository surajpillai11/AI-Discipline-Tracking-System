import Habit from "../models/Habit.js";
import DailyLog from "../models/DailyLog.js";
import { todayString } from "../utils/streakCalculator.js";

/**
 * Recalculates and upserts today's DailyLog for a user by checking
 * which of their active habits have today marked complete.
 * Called after every habit completion toggle so the log (and later,
 * the calendar heatmap / analytics) always reflects current reality.
 */
export const syncDailyLogForToday = async (userId) => {
  const today = todayString();
  const activeHabits = await Habit.find({ user: userId, isActive: true });

  const completedHabitIds = activeHabits
    .filter((h) => h.completedDates.includes(today))
    .map((h) => h._id);

  const totalActiveHabits = activeHabits.length;
  const completionPercentage =
    totalActiveHabits === 0 ? 0 : Math.round((completedHabitIds.length / totalActiveHabits) * 100);

  const log = await DailyLog.findOneAndUpdate(
    { user: userId, date: today },
    {
      user: userId,
      date: today,
      completedHabits: completedHabitIds,
      totalActiveHabits,
      completionPercentage,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return log;
};
