/**
 * Returns today's date as a YYYY-MM-DD string (local server time).
 * Using string dates (not Date objects) makes streak math and
 * duplicate-completion checks simple and timezone-predictable.
 */
export const todayString = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

export const dateStringNDaysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

/**
 * Given a sorted-or-unsorted array of 'YYYY-MM-DD' completed date strings,
 * walks backward from today counting consecutive days to determine the
 * current streak. If today isn't completed but yesterday is, the streak
 * still counts (so the user doesn't lose their streak until the day is over).
 */
export const calculateCurrentStreak = (completedDates) => {
  const dateSet = new Set(completedDates);
  let streak = 0;
  let cursor = dateSet.has(todayString()) ? 0 : 1; // start from yesterday if today not done yet

  // if neither today nor yesterday is completed, streak is 0
  if (!dateSet.has(todayString()) && !dateSet.has(dateStringNDaysAgo(1))) {
    return 0;
  }

  while (dateSet.has(dateStringNDaysAgo(cursor))) {
    streak += 1;
    cursor += 1;
  }

  return streak;
};

/**
 * Longest streak is the longest run of consecutive dates in the full history.
 */
export const calculateLongestStreak = (completedDates) => {
  if (completedDates.length === 0) return 0;

  const sorted = [...new Set(completedDates)].sort();
  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      current += 1;
    } else if (diffDays > 1) {
      current = 1;
    }
    longest = Math.max(longest, current);
  }

  return longest;
};
