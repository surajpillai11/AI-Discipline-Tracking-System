import { Award, Flame, MessageCircle, UserPlus, Bell } from "lucide-react";

const ICONS = {
  achievement: Award,
  habit_reminder: Flame,
  daily_motivation: MessageCircle,
  weekly_report: Bell,
  friend_request: UserPlus,
  system: Bell,
};

const timeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const RecentActivity = ({ notifications }) => (
  <div className="glass-panel rounded-xl p-5">
    <h2 className="font-display text-base font-semibold">Recent Activity</h2>

    {notifications.length === 0 ? (
      <p className="mt-4 text-sm text-ink-muted">Nothing yet - complete a habit to get started.</p>
    ) : (
      <ul className="mt-4 space-y-3">
        {notifications.map((n) => {
          const Icon = ICONS[n.type] || Bell;
          return (
            <li key={n._id} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-hover">
                <Icon size={13} className="text-accent-violet" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm">{n.title}</p>
                <p className="text-xs text-ink-muted">{timeAgo(n.createdAt)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    )}
  </div>
);

export default RecentActivity;
