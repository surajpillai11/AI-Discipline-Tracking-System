import Achievement from "../models/Achievement.js";
import { ACHIEVEMENT_DEFINITIONS } from "../utils/achievementDefinitions.js";

/**
 * @route   GET /api/achievements
 * @access  Private
 * Returns only the badges the user has actually earned, most recent first.
 */
export const getEarnedAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: achievements.length, data: achievements });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/achievements/catalog
 * @access  Private
 * Returns EVERY possible badge, each flagged with whether this user has
 * earned it yet (and when) - powers a "trophy case" view with locked/unlocked badges.
 */
export const getAchievementCatalog = async (req, res, next) => {
  try {
    const earned = await Achievement.find({ user: req.user._id });
    const earnedMap = new Map(earned.map((a) => [a.key, a.createdAt]));

    const catalog = ACHIEVEMENT_DEFINITIONS.map((def) => ({
      key: def.key,
      name: def.name,
      description: def.description,
      icon: def.icon,
      earned: earnedMap.has(def.key),
      earnedAt: earnedMap.get(def.key) || null,
    }));

    res.json({ success: true, data: catalog });
  } catch (error) {
    next(error);
  }
};
