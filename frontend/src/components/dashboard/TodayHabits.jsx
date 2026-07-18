import { motion, AnimatePresence } from "framer-motion";
import { Check, Flame } from "lucide-react";

const todayStr = () => new Date().toISOString().slice(0, 10);

const CATEGORY_DOT = {
  Fitness: "bg-accent-emerald",
  Study: "bg-accent-blue",
  Reading: "bg-accent-violet",
  Meditation: "bg-accent-violet",
  Coding: "bg-accent-blue",
  Diet: "bg-accent-emerald",
  "Water Intake": "bg-accent-blue",
  Sleep: "bg-accent-violet",
  Finance: "bg-accent-emerald",
  Custom: "bg-ink-muted",
};

const TodayHabits = ({ habits, onToggle }) => {
  const today = todayStr();

  if (habits.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-6 text-center">
        <p className="text-sm text-ink-muted">
          No habits yet. Create your first one to start building a streak.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl p-5">
      <h2 className="font-display text-base font-semibold">Today's Habits</h2>
      <ul className="mt-4 space-y-2">
        <AnimatePresence initial={false}>
          {habits.map((habit) => {
            const done = habit.completedDates.includes(today);
            return (
              <motion.li
                key={habit._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${CATEGORY_DOT[habit.category] || "bg-ink-muted"}`} />
                  <div>
                    <p className={`text-sm font-medium ${done ? "text-ink-muted line-through" : ""}`}>
                      {habit.name}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-ink-muted">
                      <Flame size={11} className="text-accent-emerald" />
                      {habit.currentStreak} day streak
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onToggle(habit._id)}
                  aria-label={done ? `Mark ${habit.name} incomplete` : `Mark ${habit.name} complete`}
                  className={`flex h-7 w-7 items-center justify-center rounded-full border transition ${
                    done
                      ? "border-accent-emerald bg-accent-emerald/20 text-accent-emerald"
                      : "border-border text-transparent hover:border-accent-emerald"
                  }`}
                >
                  <Check size={14} />
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default TodayHabits;
