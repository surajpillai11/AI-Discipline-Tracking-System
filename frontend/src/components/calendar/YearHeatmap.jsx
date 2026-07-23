import { buildWeeks, getMonthLabels, LEVEL_COLORS } from "../../utils/heatmapUtils";

const CELL = 13;
const GAP = 3;
const STEP = CELL + GAP;

const WEEKDAY_LABELS = [null, "Mon", null, "Wed", null, "Fri", null];

const EMPTY_COLOR = "var(--heatmap-0)";

const YearHeatmap = ({ heatmapData, onDayClick }) => {
  if (!heatmapData) return null;

  const weeks = buildWeeks(heatmapData.days);
  const monthLabels = getMonthLabels(weeks);

  return (
    <div className="overflow-x-auto pb-2">
      <div style={{ minWidth: `${weeks.length * STEP + 32}px` }}>
        {/* Month Labels */}
        <div
          className="relative mb-2 h-5"
          style={{ marginLeft: "30px" }}
        >
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

          {/* Weekday Labels */}
          <div
            className="flex flex-col gap-[3px]"
            style={{ width: "26px" }}
          >
            {WEEKDAY_LABELS.map((label, i) => (
              <div
                key={i}
                style={{ height: `${CELL}px` }}
                className="text-right text-[10px] leading-none text-ink-muted"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div
              key={wi}
              className="flex flex-col gap-[3px]"
            >
              {week.map((day, di) =>
                day ? (
                  <button
                    key={di}
                    onClick={() => onDayClick(day.date)}
                    title={`${day.date}: ${day.completionPercentage}% complete`}
                    style={{
                      width: CELL,
                      height: CELL,
                      background: LEVEL_COLORS[day.level],
                    }}
                    className="
                      rounded-[3px]
                      transition-all
                      duration-200
                      hover:scale-110
                      hover:ring-2
                      hover:ring-blue-400
                    "
                  />
                ) : (
                  <div
                    key={di}
                    style={{
                      width: CELL,
                      height: CELL,
                      background: EMPTY_COLOR,
                      borderRadius: "3px",
                      border: "1px solid rgba(148,163,184,.12)",
                    }}
                  />
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