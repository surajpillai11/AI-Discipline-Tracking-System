/**
 * Maps a completion percentage (0-100) to a GitHub-contribution-style
 * intensity level (0-4), used by the frontend to color heatmap cells.
 */
export const completionToLevel = (percentage) => {
  if (percentage <= 0) return 0;
  if (percentage <= 25) return 1;
  if (percentage <= 50) return 2;
  if (percentage <= 75) return 3;
  return 4;
};

/**
 * Returns an array of "YYYY-MM-DD" strings for every day between
 * start and end (inclusive), so the heatmap can render a full,
 * gap-free grid even for days with no logged activity.
 */
export const dateRangeArray = (startDate, endDate) => {
  const dates = [];
  const cursor = new Date(startDate);
  const end = new Date(endDate);

  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
};
