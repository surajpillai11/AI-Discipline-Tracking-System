import { motion } from "framer-motion";
import { Check, Flame, Pencil, Trash2, Clock } from "lucide-react";
import { getCategoryMeta } from "../../constants/habitOptions";

const PRIORITY_DOT = { High: "bg-red-400", Medium: "bg-yellow-400", Low: "bg-ink-muted" };

const todayStr = () => new Date().toISOString().slice(0, 10);

const HabitCard = ({ habit, onToggle, onEdit, onDelete }) => {
  const { icon: Icon, color } = getCategoryMeta(habit.category);
  const done = habit.completedDates.includes(todayStr());

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-surface-hover">
            <Icon size={16} className={color} />
          </div>
          <div>
            <p className="text-sm font-semibold">{habit.name}</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
              <span className="flex items-center gap-1">
                <Flame size={11} className="text-accent-emerald" />
                {habit.currentStreak}d streak
              </span>
              <span className="flex items-center gap-1">
                <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[habit.priority]}`} />
                {habit.priority}
              </span>
              {habit.reminderTime && (
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {habit.reminderTime}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => onToggle(habit._id)}
          aria-label={done ? "Mark incomplete" : "Mark complete"}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition ${
            done
              ? "border-accent-emerald bg-accent-emerald/20 text-accent-emerald"
              : "border-border text-transparent hover:border-accent-emerald"
          }`}
        >
          <Check size={14} />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 border-t border-border pt-3">
        <button
          onClick={() => onEdit(habit)}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-ink-muted transition hover:bg-surface-hover hover:text-ink"
        >
          <Pencil size={12} /> Edit
        </button>
        <button
          onClick={() => onDelete(habit)}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-ink-muted transition hover:bg-red-400/10 hover:text-red-400"
        >
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </motion.div>
  );
};

export default HabitCard;
