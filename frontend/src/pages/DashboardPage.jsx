import { LogOut, Flame, Trophy, Target, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDashboardData } from "../hooks/useDashboardData";
import Layout from "../components/layout/Layout";
import StatCard from "../components/dashboard/StatCard";
import TodayHabits from "../components/dashboard/TodayHabits";
import WeeklyProgressChart from "../components/dashboard/WeeklyProgressChart";
import MonthlyProgress from "../components/dashboard/MonthlyProgress";
import CalendarHeatmap from "../components/dashboard/CalendarHeatmap";
import RecentActivity from "../components/dashboard/RecentActivity";
import AICoachCard from "../components/dashboard/AICoachCard";

const DashboardPage = () => {
  const { user } = useAuth();
  const { overview, weekly, habits, heatmap, notifications, isLoading, error, toggleHabit } =
    useDashboardData();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[60vh] items-center justify-center font-mono text-sm text-ink-muted">
          Loading your dashboard...
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg border border-border px-4 py-2 text-sm hover:border-accent-violet"
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">
          Welcome back, {user?.name?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="mt-1 text-sm text-ink-muted">Here's where your discipline stands today.</p>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Discipline Score"
          value={overview.disciplineScore}
          suffix="/100"
          icon={Target}
          accent="violet"
          delay={0}
        />
        <StatCard
          label="Today"
          value={overview.todayCompletionPercentage}
          suffix="%"
          icon={CheckCircle2}
          accent="emerald"
          delay={0.05}
        />
        <StatCard
          label="Current Streak"
          value={overview.longestCurrentStreak}
          suffix=" days"
          icon={Flame}
          accent="blue"
          delay={0.1}
        />
        <StatCard
          label="Longest Streak"
          value={overview.bestLongestStreak}
          suffix=" days"
          icon={Trophy}
          accent="emerald"
          delay={0.15}
        />
      </div>

      {/* Main grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <TodayHabits habits={habits} onToggle={toggleHabit} />
          <CalendarHeatmap heatmapData={heatmap} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <WeeklyProgressChart days={weekly} />
            <MonthlyProgress percentage={overview.monthlyAverage} />
          </div>
        </div>

        <div className="space-y-4">
          <AICoachCard />
          <RecentActivity notifications={notifications} />
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
