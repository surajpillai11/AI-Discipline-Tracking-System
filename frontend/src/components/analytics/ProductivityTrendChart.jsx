import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartCard from "./ChartCard";

const WEEK_OPTIONS = [4, 8, 12, 24];

const weekLabel = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel rounded-lg px-3 py-2 text-xs">
      <p className="font-medium">Week of {label}</p>
      <p className="font-mono text-accent-emerald">{payload[0].value}% avg</p>
    </div>
  );
};

const ProductivityTrendChart = ({ trend, weeks, onWeeksChange }) => {
  const data = trend.map((t) => ({ label: weekLabel(t.weekStart), value: t.averageCompletion }));

  return (
    <ChartCard title="Productivity Trend" subtitle="Weekly-averaged completion over time">
      <div className="mb-3 flex justify-end gap-1">
        {WEEK_OPTIONS.map((w) => (
          <button
            key={w}
            onClick={() => onWeeksChange(w)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              weeks === w ? "bg-accent-violet/20 text-accent-violet" : "text-ink-muted hover:bg-surface-hover"
            }`}
          >
            {w}w
          </button>
        ))}
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#trendGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default ProductivityTrendChart;
