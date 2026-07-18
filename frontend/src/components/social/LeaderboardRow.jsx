import { Flame } from "lucide-react";

const RANK_STYLES = {
  1: "text-accent-emerald",
  2: "text-accent-blue",
  3: "text-accent-violet",
};

const LeaderboardRow = ({ entry, sortBy }) => {
  const scoreValue =
    sortBy === "weeklyAverage"
      ? `${entry.weeklyAverage}%`
      : sortBy === "longestCurrentStreak"
      ? `${entry.longestCurrentStreak}d`
      : `${entry.disciplineScore}`;

  return (
    <div
      className={`flex items-center justify-between rounded-lg px-3 py-2.5 ${
        entry.isYou ? "border border-accent-violet/40 bg-accent-violet/10" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`w-5 text-center font-mono text-sm font-bold ${RANK_STYLES[entry.rank] || "text-ink-muted"}`}>
          {entry.rank}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent-blue to-accent-violet text-xs font-bold text-white">
          {entry.name?.[0]?.toUpperCase() || "?"}
        </div>
        <p className="text-sm font-medium">
          {entry.name} {entry.isYou && <span className="text-xs text-ink-muted">(you)</span>}
        </p>
      </div>
      <div className="flex items-center gap-1 font-mono text-sm font-semibold text-accent-emerald">
        {sortBy === "longestCurrentStreak" && <Flame size={12} />}
        {scoreValue}
      </div>
    </div>
  );
};

export default LeaderboardRow;
