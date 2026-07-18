const MonthlyProgress = ({ percentage }) => (
  <div className="glass-panel rounded-xl p-5">
    <h2 className="font-display text-base font-semibold">Monthly Progress</h2>
    <p className="mt-1 text-xs text-ink-muted">Average completion, last 30 days</p>

    <div className="mt-4 flex items-center gap-4">
      <div className="relative h-16 w-16 shrink-0">
        <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${(percentage / 100) * 97.4} 97.4`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold text-accent-emerald">
          {percentage}%
        </span>
      </div>
      <p className="text-sm text-ink-muted">
        {percentage >= 70
          ? "Strong month - keep the momentum going."
          : percentage >= 30
          ? "Steady progress - a bit more consistency will move the needle."
          : "Quiet month so far - pick one habit to focus on."}
      </p>
    </div>
  </div>
);

export default MonthlyProgress;
