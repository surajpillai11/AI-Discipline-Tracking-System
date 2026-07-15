import Habit from "../models/Habit.js";
import DailyLog from "../models/DailyLog.js";
import { CATEGORIES } from "../models/Habit.js";
import { dateRangeArray } from "../utils/heatmapUtils.js";
import { todayString, dateStringNDaysAgo } from "../utils/streakCalculator.js";
import { getUserOverviewStats } from "../services/overviewService.js";

/**
 * Shared helper: fetches DailyLogs for the last `days` days (including today)
 * and returns a gap-free array, one entry per day, oldest first.
 */
const getDailySeries = async (userId, days) => {
  const startDate = dateStringNDaysAgo(days - 1);
  const endDate = todayString();

  const logs = await DailyLog.find({
    user: userId,
    date: { $gte: startDate, $lte: endDate },
  }).select("date completionPercentage completedHabits totalActiveHabits");

  const logMap = new Map(logs.map((l) => [l.date, l]));

  return dateRangeArray(startDate, endDate).map((date) => {
    const log = logMap.get(date);
    return {
      date,
      completionPercentage: log ? log.completionPercentage : 0,
      completedCount: log ? log.completedHabits.length : 0,
      totalActiveHabits: log ? log.totalActiveHabits : 0,
    };
  });
};

/**
 * @route   GET /api/analytics/weekly
 * @access  Private
 * Last 7 days of daily completion data - feeds the "Weekly Bar Chart".
 */
export const getWeeklyAnalytics = async (req, res, next) => {
  try {
    const data = await getDailySeries(req.user._id, 7);
    const average =
      data.reduce((sum, d) => sum + d.completionPercentage, 0) / (data.length || 1);

    res.json({
      success: true,
      data: { days: data, averageCompletion: Math.round(average) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/analytics/monthly
 * @access  Private
 * Last 30 days of daily completion data - feeds the "Monthly Line Chart".
 */
export const getMonthlyAnalytics = async (req, res, next) => {
  try {
    const data = await getDailySeries(req.user._id, 30);
    const average =
      data.reduce((sum, d) => sum + d.completionPercentage, 0) / (data.length || 1);

    res.json({
      success: true,
      data: { days: data, averageCompletion: Math.round(average) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/analytics/category-breakdown
 * @access  Private
 * Total completions grouped by habit category - feeds the "Habit Completion Pie Chart".
 */
export const getCategoryBreakdown = async (req, res, next) => {
  try {
    const habits = await Habit.find({ user: req.user._id, isActive: true }).select(
      "category totalCompletions"
    );

    const breakdown = CATEGORIES.map((category) => {
      const inCategory = habits.filter((h) => h.category === category);
      return {
        category,
        habitCount: inCategory.length,
        totalCompletions: inCategory.reduce((sum, h) => sum + h.totalCompletions, 0),
      };
    }).filter((c) => c.habitCount > 0); // omit categories the user doesn't use, keeps the pie chart clean

    res.json({ success: true, data: breakdown });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/analytics/streaks
 * @access  Private
 * Current + longest streak per active habit - feeds the "Streak Graph".
 */
export const getStreakGraph = async (req, res, next) => {
  try {
    const habits = await Habit.find({ user: req.user._id, isActive: true })
      .select("name currentStreak longestStreak")
      .sort({ currentStreak: -1 });

    const data = habits.map((h) => ({
      habitId: h._id,
      name: h.name,
      currentStreak: h.currentStreak,
      longestStreak: h.longestStreak,
    }));

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/analytics/productivity-trend?weeks=12
 * @access  Private
 * Average completion % per week over the last N weeks - feeds the "Productivity Trend" chart.
 * Shows the bigger-picture direction (improving/declining) that daily charts don't.
 */
export const getProductivityTrend = async (req, res, next) => {
  try {
    const weeks = Math.min(parseInt(req.query.weeks, 10) || 12, 52);
    const totalDays = weeks * 7;
    const daily = await getDailySeries(req.user._id, totalDays);

    // Bucket the daily series into weeks, oldest first
    const trend = [];
    for (let i = 0; i < daily.length; i += 7) {
      const weekSlice = daily.slice(i, i + 7);
      if (weekSlice.length === 0) continue;
      const avg =
        weekSlice.reduce((sum, d) => sum + d.completionPercentage, 0) / weekSlice.length;
      trend.push({
        weekStart: weekSlice[0].date,
        weekEnd: weekSlice[weekSlice.length - 1].date,
        averageCompletion: Math.round(avg),
      });
    }

    res.json({ success: true, data: trend });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/analytics/overview
 * @access  Private
 * Dashboard summary card data: discipline score, today's completion, weekly/monthly averages,
 * best current streak. Discipline score is a simple weighted blend of today's completion
 * and the 7-day average, so a single bad day doesn't tank it, but it still reacts quickly.
 */
export const getOverview = async (req, res, next) => {
  try {
    const data = await getUserOverviewStats(req.user._id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
