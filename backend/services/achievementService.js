import Habit from "../models/Habit.js";
import Achievement from "../models/Achievement.js";
import { ACHIEVEMENT_DEFINITIONS } from "../utils/achievementDefinitions.js";
import { createNotification } from "./notificationService.js";

/**
 * Checks all badge conditions against the user's current active habits and
 * awards any newly-earned ones. Safe to call often (e.g. after every habit
 * completion) - already-earned badges are skipped via the unique index,
 * and duplicate-key errors from a race are swallowed rather than thrown,
 * since "someone else's insert already happened" is not a real failure here.
 *
 * @returns {Promise<Array>} newly awarded achievement documents (empty if none)
 */
export const evaluateAndAwardAchievements = async (userId) => {
  const habits = await Habit.find({ user: userId, isActive: true }).select(
    "category currentStreak longestStreak totalCompletions reminderTime"
  );

  const alreadyEarnedKeys = new Set(
    (await Achievement.find({ user: userId }).select("key")).map((a) => a.key)
  );

  const newlyAwarded = [];

  for (const def of ACHIEVEMENT_DEFINITIONS) {
    if (alreadyEarnedKeys.has(def.key)) continue;
    if (!def.check(habits)) continue;

    try {
      const awarded = await Achievement.create({
        user: userId,
        key: def.key,
        name: def.name,
        description: def.description,
        icon: def.icon,
      });
      newlyAwarded.push(awarded);

      await createNotification({
        userId,
        type: "achievement",
        title: `Achievement unlocked: ${def.name}`,
        message: def.description,
      });
    } catch (error) {
      // duplicate key (E11000) just means it was already awarded a moment ago - ignore
      if (error.code !== 11000) throw error;
    }
  }

  return newlyAwarded;
};
