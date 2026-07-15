/**
 * Each definition's `check(habits)` receives the user's ACTIVE habits
 * (already fetched from the DB) and returns true/false. Keeping the
 * conditions here as pure functions makes them easy to test and to
 * add to without touching the awarding logic in achievementService.js.
 *
 * Note on "Early Bird": since we only store completion as a date (not a
 * timestamp), it's approximated as "has a habit with reminderTime set
 * before 7am that's been completed at least once" rather than detecting
 * the actual clock time a habit was marked done.
 */
export const ACHIEVEMENT_DEFINITIONS = [
  {
    key: "first_habit",
    name: "First Habit",
    description: "Created your first habit",
    icon: "🌱",
    check: (habits) => habits.length >= 1,
  },
  {
    key: "streak_7",
    name: "7-Day Streak",
    description: "Reached a 7-day streak on any habit",
    icon: "🔥",
    check: (habits) => habits.some((h) => h.currentStreak >= 7 || h.longestStreak >= 7),
  },
  {
    key: "streak_30",
    name: "30-Day Streak",
    description: "Reached a 30-day streak on any habit",
    icon: "🏆",
    check: (habits) => habits.some((h) => h.longestStreak >= 30),
  },
  {
    key: "early_bird",
    name: "Early Bird",
    description: "Consistently completing a habit scheduled before 7 AM",
    icon: "🌅",
    check: (habits) =>
      habits.some(
        (h) => h.reminderTime && h.reminderTime < "07:00" && h.totalCompletions >= 1
      ),
  },
  {
    key: "coding_master",
    name: "Coding Master",
    description: "Held a 14-day streak on a Coding habit",
    icon: "💻",
    check: (habits) =>
      habits.some((h) => h.category === "Coding" && h.longestStreak >= 14),
  },
  {
    key: "fitness_hero",
    name: "Fitness Hero",
    description: "Held a 14-day streak on a Fitness habit",
    icon: "💪",
    check: (habits) =>
      habits.some((h) => h.category === "Fitness" && h.longestStreak >= 14),
  },
  {
    key: "book_lover",
    name: "Book Lover",
    description: "Completed a Reading habit 20+ times",
    icon: "📚",
    check: (habits) =>
      habits.some((h) => h.category === "Reading" && h.totalCompletions >= 20),
  },
  {
    key: "iron_discipline",
    name: "Iron Discipline",
    description: "Holding a 30+ day streak on 3 or more habits at once",
    icon: "⚔️",
    check: (habits) => habits.filter((h) => h.currentStreak >= 30).length >= 3,
  },
];
