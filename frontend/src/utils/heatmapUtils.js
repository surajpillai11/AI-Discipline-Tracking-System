export const LEVEL_COLORS = [
  "rgba(255,255,255,0.06)", // level 0 - none
  "#1e3a5f", // level 1
  "#1d5f4a", // level 2
  "#15803d", // level 3
  "#10B981", // level 4 - full accent emerald
];

/**
 * Buckets a chronological, gap-free array of {date, level} entries into
 * week-columns (Sunday-start), padding the first/last week with nulls so
 * the grid aligns properly - same layout convention as GitHub's own graph.
 */
export const buildWeeks = (days) => {
  if (!days || days.length === 0) return [];

  const weeks = [];
  let currentWeek = [];

  const firstDayOfWeek = new Date(days[0].date).getDay();
  for (let i = 0; i < firstDayOfWeek; i++) currentWeek.push(null);

  days.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  return weeks;
};

/**
 * Returns [{ weekIndex, label }] marking the week-column where each new
 * month begins, for rendering month labels above a week-columns grid.
 */
export const getMonthLabels = (weeks) => {
  const labels = [];
  let lastMonth = null;

  weeks.forEach((week, weekIndex) => {
    const firstRealDay = week.find((d) => d !== null);
    if (!firstRealDay) return;

    const month = new Date(firstRealDay.date).getMonth();
    if (month !== lastMonth) {
      labels.push({
        weekIndex,
        label: new Date(firstRealDay.date).toLocaleDateString("en-US", { month: "short" }),
      });
      lastMonth = month;
    }
  });

  return labels;
};
