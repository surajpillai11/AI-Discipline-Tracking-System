const SUGGESTIONS = [
  "How am I doing this week?",
  "I skipped a habit today",
  "Give me a pep talk",
  "What should I focus on next?",
];

const SuggestionChips = ({ onPick }) => (
  <div className="flex flex-wrap justify-center gap-2">
    {SUGGESTIONS.map((s) => (
      <button
        key={s}
        onClick={() => onPick(s)}
        className="glass-panel rounded-full px-3.5 py-1.5 text-xs text-ink-muted transition hover:text-ink"
      >
        {s}
      </button>
    ))}
  </div>
);

export default SuggestionChips;
