import User from "../models/User.js";
import Habit from "../models/Habit.js";
import DailyLog from "../models/DailyLog.js";
import AIChat from "../models/AIChat.js";
import AIUsageLog from "../models/AIUsageLog.js";
import Report from "../models/Report.js";
import Achievement from "../models/Achievement.js";
import Notification from "../models/Notification.js";
import Friendship from "../models/Friendship.js";
import { CATEGORIES } from "../models/Habit.js";
import { todayString, dateStringNDaysAgo } from "../utils/streakCalculator.js";

/**
 * @route   GET /api/admin/users?page=1&limit=20&search=
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.search) {
      const regex = new RegExp(req.query.search, "i");
      filter.$or = [{ name: regex }, { email: regex }];
    }

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const [habitCount, reportCount, aiUsageCount] = await Promise.all([
      Habit.countDocuments({ user: user._id }),
      Report.countDocuments({ user: user._id }),
      AIUsageLog.countDocuments({ user: user._id }),
    ]);

    res.json({
      success: true,
      data: { ...user.toObject(), habitCount, reportCount, aiUsageCount },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/admin/users/:id
 * @access  Private/Admin
 * @body    { role?: "user"|"admin", isBanned?: boolean }
 *
 * Deliberately narrow - only role and ban status are admin-editable here.
 * Everything else (name, password, etc.) belongs to the user themselves
 * via /api/auth/profile, not an admin.
 */
export const updateUser = async (req, res, next) => {
  try {
    const { role, isBanned } = req.body;

    if (req.params.id === req.user._id.toString() && (role === "user" || isBanned === true)) {
      res.status(400);
      throw new Error("You can't demote or ban your own admin account");
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (role !== undefined) user.role = role;
    if (isBanned !== undefined) user.isBanned = isBanned;

    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 * Cascades - removes the user's habits, logs, chats, reports, achievements,
 * notifications, and friendships, so no orphaned data is left behind.
 */
export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      res.status(400);
      throw new Error("You can't delete your own admin account this way");
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const userId = user._id;

    await Promise.all([
      Habit.deleteMany({ user: userId }),
      DailyLog.deleteMany({ user: userId }),
      AIChat.deleteMany({ user: userId }),
      AIUsageLog.deleteMany({ user: userId }),
      Report.deleteMany({ user: userId }),
      Achievement.deleteMany({ user: userId }),
      Notification.deleteMany({ user: userId }),
      Friendship.deleteMany({ $or: [{ requester: userId }, { recipient: userId }] }),
    ]);

    await user.deleteOne();

    res.json({ success: true, message: "User and all associated data deleted" });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/stats/habits
 * @access  Private/Admin
 * Platform-wide habit statistics.
 */
export const getHabitStatistics = async (req, res, next) => {
  try {
    const habits = await Habit.find().select(
      "category currentStreak longestStreak totalCompletions isActive"
    );

    const activeHabits = habits.filter((h) => h.isActive);

    const categoryBreakdown = CATEGORIES.map((category) => ({
      category,
      count: habits.filter((h) => h.category === category).length,
    })).filter((c) => c.count > 0);

    const totalCompletions = habits.reduce((sum, h) => sum + h.totalCompletions, 0);
    const averageCurrentStreak = activeHabits.length
      ? Math.round(
          activeHabits.reduce((sum, h) => sum + h.currentStreak, 0) / activeHabits.length
        )
      : 0;
    const longestStreakOnPlatform = habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);

    res.json({
      success: true,
      data: {
        totalHabits: habits.length,
        activeHabits: activeHabits.length,
        archivedHabits: habits.length - activeHabits.length,
        totalCompletions,
        averageCurrentStreak,
        longestStreakOnPlatform,
        categoryBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/stats/ai-usage?days=30
 * @access  Private/Admin
 */
export const getAIUsageAnalytics = async (req, res, next) => {
  try {
    const days = Math.min(parseInt(req.query.days, 10) || 30, 90);
    const since = dateStringNDaysAgo(days - 1);
    const sinceDate = new Date(since);

    const logs = await AIUsageLog.find({ createdAt: { $gte: sinceDate } }).select(
      "feature user createdAt"
    );

    const byFeature = {};
    const byUser = {};

    logs.forEach((log) => {
      byFeature[log.feature] = (byFeature[log.feature] || 0) + 1;
      const uid = log.user.toString();
      byUser[uid] = (byUser[uid] || 0) + 1;
    });

    const topUserIds = Object.entries(byUser)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id]) => id);

    const topUsers = await User.find({ _id: { $in: topUserIds } }).select("name email");
    const topUsersWithCounts = topUsers
      .map((u) => ({ userId: u._id, name: u.name, email: u.email, callCount: byUser[u._id.toString()] }))
      .sort((a, b) => b.callCount - a.callCount);

    res.json({
      success: true,
      data: {
        periodDays: days,
        totalCalls: logs.length,
        byFeature,
        topUsers: topUsersWithCounts,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/reports?type=weekly&page=1
 * @access  Private/Admin
 * Recent reports generated across the whole platform.
 */
export const getAllReports = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.type) filter.type = req.query.type;

    const [reports, total] = await Promise.all([
      Report.find(filter)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Report.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: reports,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 * High-level platform metrics for the admin dashboard's overview cards.
 */
export const getDashboardMetrics = async (req, res, next) => {
  try {
    const today = todayString();
    const sevenDaysAgo = new Date(dateStringNDaysAgo(6));

    const [
      totalUsers,
      newUsersLast7Days,
      totalHabits,
      totalActiveHabits,
      totalReports,
      totalAIChats,
      totalAIUsageCalls,
      activeTodayCount,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Habit.countDocuments(),
      Habit.countDocuments({ isActive: true }),
      Report.countDocuments(),
      AIChat.countDocuments(),
      AIUsageLog.countDocuments(),
      DailyLog.countDocuments({ date: today, completionPercentage: { $gt: 0 } }),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        newUsersLast7Days,
        totalHabits,
        totalActiveHabits,
        totalReports,
        totalAIChats,
        totalAIUsageCalls,
        activeUsersToday: activeTodayCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
