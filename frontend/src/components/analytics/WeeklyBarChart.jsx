import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartCard from "./ChartCard";

const dayLabel = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="glass-panel rounded-lg px-3 py-2 text-xs">
      <p className="font-medium">{label}</p>
      <p className="font-mono text-accent-emerald">{point.value}% complete</p>
      <p className="text-ink-muted">
        {point.completedCount}/{point.totalActiveHabits} habits
      </p>
    </div>
  );
};

const WeeklyBarChart = ({ days }) => {
  const data = days.map((d) => ({
    label: dayLabel(d.date),
    value: d.completionPercentage,
    completedCount: d.completedCount,
    totalActiveHabits: d.totalActiveHabits,
  }));

  return (
    <ChartCard title="Weekly Bar Chart" subtitle="Completion % for the last 7 days">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#8B5CF6" maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default WeeklyBarChart;
