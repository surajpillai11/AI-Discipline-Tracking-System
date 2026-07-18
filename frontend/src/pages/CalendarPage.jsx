import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Layout from "../components/layout/Layout";
import YearHeatmap from "../components/calendar/YearHeatmap";
import DayDetailPanel from "../components/calendar/DayDetailPanel";
import { getHeatmap } from "../api/logs";
import { LEVEL_COLORS } from "../utils/heatmapUtils";

const CURRENT_YEAR = new Date().getFullYear();

const CalendarPage = () => {
  const [year, setYear] = useState(CURRENT_YEAR);
  const [heatmapData, setHeatmapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError("");
    getHeatmap({ year })
      .then((res) => setHeatmapData(res.data.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load calendar"))
      .finally(() => setIsLoading(false));
  }, [year]);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Calendar</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Click any day to see what you completed and log how it went.
        </p>
      </div>

      <div className="glass-panel rounded-xl p-5">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setYear((y) => y - 1)}
              aria-label="Previous year"
              className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-surface-hover"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-display text-base font-semibold">{year}</span>
            <button
              onClick={() => setYear((y) => y + 1)}
              disabled={year >= CURRENT_YEAR}
              aria-label="Next year"
              className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-surface-hover disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {heatmapData && (
            <p className="text-xs text-ink-muted">
              {heatmapData.summary.activeDays} active days · {heatmapData.summary.perfectDays} perfect days
            </p>
          )}
        </div>

        {isLoading ? (
          <p className="font-mono text-sm text-ink-muted">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : (
          <>
            <YearHeatmap heatmapData={heatmapData} onDayClick={setSelectedDate} />
            <div className="mt-4 flex items-center justify-end gap-1.5 text-xs text-ink-muted">
              <span>Less</span>
              {LEVEL_COLORS.map((color, i) => (
                <div key={i} className="h-[10px] w-[10px] rounded-[2px]" style={{ backgroundColor: color }} />
              ))}
              <span>More</span>
            </div>
          </>
        )}
      </div>

      {selectedDate && (
        <DayDetailPanel date={selectedDate} onClose={() => setSelectedDate(null)} />
      )}
    </Layout>
  );
};

export default CalendarPage;
