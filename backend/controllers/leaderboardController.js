import User from "../models/User.js";
import { getFriendUserIds } from "../services/friendService.js";
import { getUserOverviewStats } from "../services/overviewService.js";

const VALID_SORT_FIELDS = ["disciplineScore", "weeklyAverage", "longestCurrentStreak"];

/**
 * @route   GET /api/leaderboard?sortBy=disciplineScore
 * @access  Private
 *
 * Ranks the logged-in user against their accepted friends. sortBy can be
 * "disciplineScore" (default), "weeklyAverage", or "longestCurrentStreak"
 * (the last one is effectively the "compare streaks" view from the spec).
 */
export const getLeaderboard = async (req, res, next) => {
  try {
    const sortBy = VALID_SORT_FIELDS.includes(req.query.sortBy)
      ? req.query.sortBy
      : "disciplineScore";

    const friendIds = await getFriendUserIds(req.user._id);
    const allUserIds = [req.user._id, ...friendIds];

    const users = await User.find({ _id: { $in: allUserIds } }).select("name avatar");
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    const entries = await Promise.all(
      allUserIds.map(async (id) => {
        const stats = await getUserOverviewStats(id);
        const user = userMap.get(id.toString());
        return {
          userId: id,
          name: user?.name || "Unknown",
          avatar: user?.avatar || "",
          isYou: id.toString() === req.user._id.toString(),
          ...stats,
        };
      })
    );

    entries.sort((a, b) => b[sortBy] - a[sortBy]);
    const ranked = entries.map((entry, index) => ({ rank: index + 1, ...entry }));

    res.json({ success: true, sortBy, data: ranked });
  } catch (error) {
    next(error);
  }
};
