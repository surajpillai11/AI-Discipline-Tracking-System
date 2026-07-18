const ChartCard = ({ title, subtitle, children }) => (
  <div className="glass-panel rounded-xl p-5">
    <h2 className="font-display text-base font-semibold">{title}</h2>
    {subtitle && <p className="mt-0.5 text-xs text-ink-muted">{subtitle}</p>}
    <div className="mt-4">{children}</div>
  </div>
);

export default ChartCard;
