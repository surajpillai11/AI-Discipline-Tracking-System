import Habit from "../models/Habit.js";
import DailyLog from "../models/DailyLog.js";
import { dateRangeArray } from "../utils/heatmapUtils.js";
import { todayString, dateStringNDaysAgo } from "../utils/streakCalculator.js";

/**
 * Same day-series helper used in analyticsController - duplicated here
 * intentionally to keep this service dependency-free from the controller
 * layer (controllers should call INTO services, not the other way around).
 */
const getDailySeries = async (userId, days) => {
  const startDate = dateStringNDaysAgo(days - 1);
  const endDate = todayString();

  const logs = await DailyLog.find({
    user: userId,
    date: { $gte: startDate, $lte: endDate },
  }).select("date completionPercentage");

  const logMap = new Map(logs.map((l) => [l.date, l]));

  return dateRangeArray(startDate, endDate).map((date) => ({
    date,
    completionPercentage: logMap.get(date)?.completionPercentage ?? 0,
  }));
};

/**
 * Computes the same dashboard-overview numbers used in Step 6's
 * /api/analytics/overview, but as a reusable function so the leaderboard
 * (Step 11) can compute the same stats for a user's friends too.
 */
export const getUserOverviewStats = async (userId) => {
  const habits = await Habit.find({ user: userId, isActive: true }).select(
    "currentStreak longestStreak completedDates"
  );

  const today = todayString();
  const todayCompletedCount = habits.filter((h) => h.completedDates.includes(today)).length;
  const todayCompletionPercentage =
    habits.length === 0 ? 0 : Math.round((todayCompletedCount / habits.length) * 100);

  const weeklyData = await getDailySeries(userId, 7);
  const weeklyAverage = Math.round(
    weeklyData.reduce((sum, d) => sum + d.completionPercentage, 0) / (weeklyData.length || 1)
  );

  const monthlyData = await getDailySeries(userId, 30);
  const monthlyAverage = Math.round(
    monthlyData.reduce((sum, d) => sum + d.completionPercentage, 0) / (monthlyData.length || 1)
  );

  const disciplineScore = Math.round(todayCompletionPercentage * 0.4 + weeklyAverage * 0.6);
  const longestCurrentStreak = habits.reduce((max, h) => Math.max(max, h.currentStreak), 0);
  const bestLongestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);

  return {
    disciplineScore,
    todayCompletionPercentage,
    weeklyAverage,
    monthlyAverage,
    totalActiveHabits: habits.length,
    longestCurrentStreak,
    bestLongestStreak,
  };
};
