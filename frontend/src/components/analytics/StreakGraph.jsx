import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartCard from "./ChartCard";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel rounded-lg px-3 py-2 text-xs">
      <p className="font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-mono">
          {p.name}: {p.value}d
        </p>
      ))}
    </div>
  );
};

const StreakGraph = ({ data }) => {
  if (data.length === 0) {
    return (
      <ChartCard title="Streak Graph" subtitle="Current vs longest streak per habit">
        <p className="py-10 text-center text-sm text-ink-muted">No active habits yet.</p>
      </ChartCard>
    );
  }

  // Height scales with number of habits so labels stay readable
  const chartHeight = Math.max(180, data.length * 44);

  return (
    <ChartCard title="Streak Graph" subtitle="Current vs longest streak per habit">
      <div style={{ height: `${chartHeight}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#9CA3AF" }} />
            <Bar dataKey="currentStreak" name="Current" fill="#3B82F6" radius={[0, 4, 4, 0]} maxBarSize={14} />
            <Bar dataKey="longestStreak" name="Longest" fill="#8B5CF6" radius={[0, 4, 4, 0]} maxBarSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default StreakGraph;
