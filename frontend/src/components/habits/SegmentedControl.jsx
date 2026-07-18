const SegmentedControl = ({ label, options, value, onChange }) => (
  <div>
    <label className="mb-1 block text-sm font-medium">{label}</label>
    <div className="flex gap-1.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
            value === option
              ? "border-accent-violet bg-accent-violet/15 text-accent-violet"
              : "border-border text-ink-muted hover:border-border-hover"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

export default SegmentedControl;
