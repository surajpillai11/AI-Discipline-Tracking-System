export const LEVEL_COLORS = [
  "var(--heatmap-0)", // No activity
  "var(--heatmap-1)", // Low
  "var(--heatmap-2)", // Medium
  "var(--heatmap-3)", // High
  "var(--heatmap-4)", // Perfect
];

/**
 * Buckets a chronological, gap-free array of {date, level} entries into
 * week-columns (Sunday-start), padding the first/last week with nulls so
 * the grid aligns properly like GitHub's contribution graph.
 */
export const buildWeeks = (days) => {
  if (!days || days.length === 0) return [];

  const weeks = [];
  let currentWeek = [];

  const firstDayOfWeek = new Date(days[0].date).getDay();

  // Pad first week
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null);
  }

  days.forEach((day) => {
    currentWeek.push(day);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Pad last week
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
};

/**
 * Returns month labels positioned above the correct week column.
 */
export const getMonthLabels = (weeks) => {
  const labels = [];
  let lastMonth = -1;

  weeks.forEach((week, weekIndex) => {
    const firstRealDay = week.find((d) => d !== null);

    if (!firstRealDay) return;

    const date = new Date(firstRealDay.date);
    const month = date.getMonth();

    if (month !== lastMonth) {
      labels.push({
        weekIndex,
        label: date.toLocaleString("en-US", {
          month: "short",
        }),
      });

      lastMonth = month;
    }
  });

  return labels;
};