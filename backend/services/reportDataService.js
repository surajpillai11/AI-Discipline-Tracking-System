import Habit from "../models/Habit.js";
import DailyLog from "../models/DailyLog.js";
import { todayString, dateStringNDaysAgo } from "../utils/streakCalculator.js";

/**
 * Gathers real numbers for a given window (7 or 30 days) that both the
 * AI prompt and the stored Report.stats field will be built from.
 */
export const gatherPeriodStats = async (userId, days) => {
  const periodStart = dateStringNDaysAgo(days - 1);
  const periodEnd = todayString();

  const habits = await Habit.find({ user: userId, isActive: true }).select(
    "name category currentStreak longestStreak completedDates totalCompletions createdAt"
  );

  const dailyLogs = await DailyLog.find({
    user: userId,
    date: { $gte: periodStart, $lte: periodEnd },
  }).select("date completionPercentage");

  const habitBreakdown = habits.map((h) => {
    const completionsInPeriod = h.completedDates.filter(
      (d) => d >= periodStart && d <= periodEnd
    ).length;
    return {
      habitId: h._id,
      name: h.name,
      category: h.category,
      currentStreak: h.currentStreak,
      longestStreak: h.longestStreak,
      completionsInPeriod,
      completionRateInPeriod: Math.round((completionsInPeriod / days) * 100),
    };
  });

  const averageDailyCompletion =
    dailyLogs.length === 0
      ? 0
      : Math.round(
          dailyLogs.reduce((sum, l) => sum + l.completionPercentage, 0) / dailyLogs.length
        );

  const sortedByRate = [...habitBreakdown].sort(
    (a, b) => b.completionRateInPeriod - a.completionRateInPeriod
  );

  return {
    periodStart,
    periodEnd,
    days,
    totalActiveHabits: habits.length,
    averageDailyCompletion,
    habitBreakdown,
    bestPerformingHabit: sortedByRate[0] || null,
    worstPerformingHabit: sortedByRate[sortedByRate.length - 1] || null,
  };
};
