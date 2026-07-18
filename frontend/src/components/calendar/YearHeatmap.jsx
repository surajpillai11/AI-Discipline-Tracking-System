import { buildWeeks, getMonthLabels, LEVEL_COLORS } from "../../utils/heatmapUtils";

const CELL = 12;
const GAP = 3;
const STEP = CELL + GAP;
const WEEKDAY_LABELS = [null, "Mon", null, "Wed", null, "Fri", null]; // sparse, GitHub-style

const YearHeatmap = ({ heatmapData, onDayClick }) => {
  if (!heatmapData) return null;

  const weeks = buildWeeks(heatmapData.days);
  const monthLabels = getMonthLabels(weeks);

  return (
    <div className="overflow-x-auto pb-2">
      <div style={{ minWidth: `${weeks.length * STEP + 30}px` }}>
        {/* Month labels */}
        <div className="relative mb-1 h-4" style={{ marginLeft: "30px" }}>
          {monthLabels.map(({ weekIndex, label }) => (
            <span
              key={weekIndex}
              className="absolute text-xs text-ink-muted"
              style={{ left: `${weekIndex * STEP}px` }}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="flex gap-[3px]">
          {/* Weekday labels */}
          <div className="flex flex-col gap-[3px]" style={{ width: "26px" }}>
            {WEEKDAY_LABELS.map((label, i) => (
              <div key={i} style={{ height: `${CELL}px` }} className="text-right text-[10px] leading-none text-ink-muted">
                {label}
              </div>
            ))}
          </div>

          {/* Week columns */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) =>
                day ? (
                  <button
                    key={di}
                    onClick={() => onDayClick(day.date)}
                    title={`${day.date}: ${day.completionPercentage}% complete`}
                    style={{ height: `${CELL}px`, width: `${CELL}px`, backgroundColor: LEVEL_COLORS[day.level] }}
                    className="rounded-[3px] transition hover:ring-1 hover:ring-white/50"
                  />
                ) : (
                  <div key={di} style={{ height: `${CELL}px`, width: `${CELL}px` }} />
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YearHeatmap;
