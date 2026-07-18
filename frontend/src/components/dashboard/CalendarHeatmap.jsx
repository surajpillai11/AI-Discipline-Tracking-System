import { Link } from "react-router-dom";
import { buildWeeks, LEVEL_COLORS } from "../../utils/heatmapUtils";

/**
 * Compact dashboard preview of the calendar. The full-featured version
 * (month labels, year navigation, click-to-view-day, journal entry) lives
 * at /calendar (Step 17) - this widget links there rather than duplicating it.
 */
const CalendarHeatmap = ({ heatmapData }) => {
  if (!heatmapData) return null;

  const weeks = buildWeeks(heatmapData.days);

  return (
    <div className="glass-panel rounded-xl p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold">Calendar</h2>
        <Link to="/calendar" className="text-xs text-accent-violet hover:underline">
          View full year →
        </Link>
      </div>
      <p className="mt-0.5 text-xs text-ink-muted">
        {heatmapData.summary.activeDays} active days · {heatmapData.summary.perfectDays} perfect days
      </p>

      <div className="mt-4 overflow-x-auto">
        <div className="flex gap-[3px]" style={{ minWidth: `${weeks.length * 13}px` }}>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) =>
                day ? (
                  <div
                    key={di}
                    title={`${day.date}: ${day.completionPercentage}% complete`}
                    className="h-[10px] w-[10px] rounded-[2px] transition hover:ring-1 hover:ring-white/40"
                    style={{ backgroundColor: LEVEL_COLORS[day.level] }}
                  />
                ) : (
                  <div key={di} className="h-[10px] w-[10px]" />
                )
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5 text-xs text-ink-muted">
        <span>Less</span>
        {LEVEL_COLORS.map((color, i) => (
          <div key={i} className="h-[10px] w-[10px] rounded-[2px]" style={{ backgroundColor: color }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

export default CalendarHeatmap;
