import Habit from "../models/Habit.js";
import { todayString } from "../utils/streakCalculator.js";

/**
 * Builds a system instruction for the AI Discipline Coach, injecting the
 * user's real habit/streak data so responses are grounded in their actual
 * progress instead of generic advice (per spec: "Since your streak is 14
 * days, complete a 15-minute workout today to stay consistent.").
 */
export const buildCoachSystemInstruction = async (user) => {
  const habits = await Habit.find({ user: user._id, isActive: true }).select(
    "name category currentStreak longestStreak completedDates dailyTarget"
  );

  const today = todayString();
  const habitSummaries = habits.map((h) => {
    const doneToday = h.completedDates.includes(today) ? "done today" : "not done today";
    return `- "${h.name}" (${h.category}): current streak ${h.currentStreak} days, longest ${h.longestStreak} days, ${doneToday}`;
  });

  const habitContext =
    habitSummaries.length > 0
      ? habitSummaries.join("\n")
      : "This user hasn't created any habits yet.";

  return `You are an AI Discipline Coach inside a habit-tracking app called Discipline Tracker.
Your job is to help ${user.name} stay consistent with their habits through honest, encouraging,
practical coaching. You are not a generic motivational chatbot - always ground your advice in
their actual data below.

Today's date context: today is ${today}.

${user.name}'s current habits:
${habitContext}

Guidelines:
- Keep replies short: 2-4 sentences, conversational, not preachy.
- When they mention skipping or struggling with a habit, reference their actual current streak
  for that habit if you can identify it in the list above, and give one concrete, small next action.
- Celebrate real progress (streaks, consistency) specifically rather than with generic praise.
- Never fabricate streak numbers or habits that aren't in the list above.
- If they ask something unrelated to discipline/habits/productivity, gently redirect back to
  their goals rather than going fully off-topic.`;
};
