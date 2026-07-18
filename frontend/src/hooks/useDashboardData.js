import { useCallback, useEffect, useState } from "react";
import { getOverview, getWeeklyAnalytics } from "../api/analytics";
import { getHabits, toggleHabitComplete } from "../api/habits";
import { getHeatmap } from "../api/logs";
import { getNotifications } from "../api/notifications";

export const useDashboardData = () => {
  const [overview, setOverview] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [habits, setHabits] = useState([]);
  const [heatmap, setHeatmap] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAll = useCallback(async () => {
    try {
      setError("");
      const [overviewRes, weeklyRes, habitsRes, heatmapRes, notificationsRes] = await Promise.all([
        getOverview(),
        getWeeklyAnalytics(),
        getHabits(),
        getHeatmap(),
        getNotifications({ unreadOnly: "false" }),
      ]);

      setOverview(overviewRes.data.data);
      setWeekly(weeklyRes.data.data.days);
      setHabits(habitsRes.data.data);
      setHeatmap(heatmapRes.data.data);
      setNotifications(notificationsRes.data.data.slice(0, 6));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Re-fetches just the pieces that change when a habit is completed/uncompleted,
  // rather than a full reload, so the UI feels snappy on every tap.
  const toggleHabit = async (habitId) => {
    await toggleHabitComplete(habitId);
    const [overviewRes, habitsRes, heatmapRes] = await Promise.all([
      getOverview(),
      getHabits(),
      getHeatmap(),
    ]);
    setOverview(overviewRes.data.data);
    setHabits(habitsRes.data.data);
    setHeatmap(heatmapRes.data.data);
  };

  return { overview, weekly, habits, heatmap, notifications, isLoading, error, refetch: fetchAll, toggleHabit };
};
