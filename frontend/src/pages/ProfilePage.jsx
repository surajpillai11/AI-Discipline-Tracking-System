import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Pencil, X } from "lucide-react";
import Layout from "../components/layout/Layout";
import Avatar from "../components/profile/Avatar";
import { useAuth } from "../context/AuthContext";
import { getMe, updateProfile } from "../api/auth";
import { getHabits } from "../api/habits";
import { getEarnedAchievements } from "../api/achievements";

const formatJoinDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", { month: "long", year: "numeric" });

const ProfilePage = () => {
  const { setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [habitCount, setHabitCount] = useState(0);
  const [achievementCount, setAchievementCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, reset } = useForm();

  const loadProfile = async () => {
    try {
      const [meRes, habitsRes, achievementsRes] = await Promise.all([
        getMe(),
        getHabits({ isActive: "true" }),
        getEarnedAchievements(),
      ]);
      setProfile(meRes.data.data);
      setUser(meRes.data.data); // keep AuthContext/Navbar in sync with the freshest data
      setHabitCount(habitsRes.data.count);
      setAchievementCount(achievementsRes.data.count);
      reset({
        bio: meRes.data.data.bio || "",
        goals: meRes.data.data.goals || "",
        avatar: meRes.data.data.avatar || "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
      await loadProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <p className="font-mono text-sm text-ink-muted">Loading profile...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Profile</h1>
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Profile card */}
        <div className="glass-panel rounded-xl p-6 lg:col-span-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar name={profile.name} avatarUrl={profile.avatar} />
              <div>
                <h2 className="font-display text-lg font-bold">{profile.name}</h2>
                <p className="text-sm text-ink-muted">{profile.email}</p>
                <p className="mt-1 text-xs text-ink-muted">
                  Joined {formatJoinDate(profile.createdAt)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing((v) => !v)}
              aria-label={isEditing ? "Cancel editing" : "Edit profile"}
              className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-surface-hover"
            >
              {isEditing ? <X size={16} /> : <Pencil size={16} />}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Avatar URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none transition focus:border-accent-violet"
                  {...register("avatar")}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Bio</label>
                <textarea
                  rows={2}
                  maxLength={300}
                  className="w-full resize-none rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none transition focus:border-accent-violet"
                  {...register("bio")}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Goals</label>
                <textarea
                  rows={3}
                  maxLength={500}
                  placeholder="What are you working toward?"
                  className="w-full resize-none rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none transition focus:border-accent-violet"
                  {...register("goals")}
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-gradient-to-r from-accent-blue via-accent-violet to-accent-emerald px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Save changes
              </button>
            </form>
          ) : (
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Bio</p>
                <p className="mt-1 text-sm">{profile.bio || "No bio yet."}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Goals</p>
                <p className="mt-1 text-sm">{profile.goals || "No goals set yet."}</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="glass-panel rounded-xl p-6">
          <h3 className="mb-4 font-display text-base font-semibold">Statistics</h3>
          <div className="space-y-4">
            <StatRow label="Active Habits" value={habitCount} />
            <StatRow label="Total Habits Completed" value={profile.stats?.totalHabitsCompleted ?? 0} />
            <StatRow label="Total Streak Days" value={profile.stats?.totalStreakDays ?? 0} />
            <StatRow label="Achievements" value={achievementCount} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

const StatRow = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
    <span className="text-sm text-ink-muted">{label}</span>
    <span className="font-mono text-lg font-bold text-accent-emerald">{value}</span>
  </div>
);

export default ProfilePage;
