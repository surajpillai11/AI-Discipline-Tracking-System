/**
 * The whole product's core visual metaphor is the calendar heatmap (Step 5).
 * Rather than a generic gradient orb behind the auth card, this renders a
 * quiet grid of small squares that fade in and out on staggered delays -
 * literally the same visual language the dashboard will use later, just
 * turned into ambient texture instead of data.
 */
const COLORS = ["#3B82F6", "#8B5CF6", "#10B981"];
const COLS = 24;
const ROWS = 14;

const HeatmapBackground = () => {
  const cells = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const seed = (row * COLS + col) % 7;
      if (seed === 0) continue; // leave some cells empty, like a real contribution graph
      const color = COLORS[(row + col) % COLORS.length];
      const delay = ((row * COLS + col) % 20) * 0.3;
      cells.push(
        <div
          key={`${row}-${col}`}
          className="rounded-sm animate-pulse-cell"
          style={{
            backgroundColor: color,
            animationDelay: `${delay}s`,
          }}
        />
      );
    }
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 opacity-40"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        gap: "10px",
        padding: "40px",
      }}
      aria-hidden="true"
    >
      {cells}
    </div>
  );
};

export default HeatmapBackground;
