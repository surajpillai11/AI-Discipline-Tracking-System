import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import ChartCard from "./ChartCard";

// Cycles through the app's three accent colors plus a couple of supporting
// tones, so up to ~8 categories stay visually distinct without introducing
// an unrelated color family.
const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#60A5FA", "#A78BFA", "#34D399", "#F59E0B", "#F472B6"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="glass-panel rounded-lg px-3 py-2 text-xs">
      <p className="font-medium">{point.category}</p>
      <p className="text-ink-muted">
        {point.totalCompletions} completions · {point.habitCount} habit{point.habitCount !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

const CategoryPieChart = ({ data }) => {
  const hasData = data.some((d) => d.totalCompletions > 0);

  return (
    <ChartCard title="Habit Completion" subtitle="Total completions by category">
      {!hasData ? (
        <p className="py-10 text-center text-sm text-ink-muted">
          Complete a few habits to see this chart fill in.
        </p>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="totalCompletions"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="middle"
                align="right"
                layout="vertical"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, color: "#9CA3AF" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
};

export default CategoryPieChart;
