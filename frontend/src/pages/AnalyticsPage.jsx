import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import WeeklyBarChart from "../components/analytics/WeeklyBarChart";
import MonthlyLineChart from "../components/analytics/MonthlyLineChart";
import CategoryPieChart from "../components/analytics/CategoryPieChart";
import StreakGraph from "../components/analytics/StreakGraph";
import ProductivityTrendChart from "../components/analytics/ProductivityTrendChart";
import {
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  getCategoryBreakdown,
  getStreakGraph,
  getProductivityTrend,
} from "../api/analytics";

const AnalyticsPage = () => {
  const [weekly, setWeekly] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [streakData, setStreakData] = useState([]);
  const [trend, setTrend] = useState([]);
  const [trendWeeks, setTrendWeeks] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Core charts load once
  useEffect(() => {
    Promise.all([getWeeklyAnalytics(), getMonthlyAnalytics(), getCategoryBreakdown(), getStreakGraph()])
      .then(([w, m, c, s]) => {
        setWeekly(w.data.data.days);
        setMonthly(m.data.data.days);
        setCategoryData(c.data.data);
        setStreakData(s.data.data);
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load analytics"))
      .finally(() => setIsLoading(false));
  }, []);

  // Productivity trend refetches whenever the week-window selector changes
  useEffect(() => {
    getProductivityTrend(trendWeeks)
      .then((res) => setTrend(res.data.data))
      .catch(() => {});
  }, [trendWeeks]);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Analytics</h1>
        <p className="mt-1 text-sm text-ink-muted">How your discipline is trending, in detail.</p>
      </div>

      {isLoading ? (
        <p className="font-mono text-sm text-ink-muted">Loading analytics...</p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <WeeklyBarChart days={weekly} />
          <MonthlyLineChart days={monthly} />
          <CategoryPieChart data={categoryData} />
          <ProductivityTrendChart trend={trend} weeks={trendWeeks} onWeeksChange={setTrendWeeks} />
          <div className="lg:col-span-2">
            <StreakGraph data={streakData} />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AnalyticsPage;
