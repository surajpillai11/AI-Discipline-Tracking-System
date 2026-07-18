import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import CategoryPicker from "./CategoryPicker";
import SegmentedControl from "./SegmentedControl";
import { PRIORITIES, DIFFICULTIES } from "../../constants/habitOptions";

/**
 * Same form serves both create and edit - pass `habit` for edit mode
 * (pre-fills and changes the submit label), omit it for create mode.
 */
const HabitFormModal = ({ habit, onClose, onSubmit }) => {
  const isEditing = Boolean(habit);
  const [category, setCategory] = useState(habit?.category || "Fitness");
  const [priority, setPriority] = useState(habit?.priority || "Medium");
  const [difficulty, setDifficulty] = useState(habit?.difficulty || "Medium");
  const [serverError, setServerError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: habit?.name || "",
      dailyTarget: habit?.dailyTarget || 1,
      targetUnit: habit?.targetUnit || "",
      reminderTime: habit?.reminderTime || "",
      notes: habit?.notes || "",
    },
  });

  const submit = async (formData) => {
    setServerError("");
    setIsSaving(true);
    try {
      await onSubmit({
        ...formData,
        dailyTarget: Number(formData.dailyTarget) || 1,
        category,
        priority,
        difficulty,
      });
      onClose();
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-panel gradient-border max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">
              {isEditing ? "Edit Habit" : "New Habit"}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-surface-hover"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Habit name</label>
              <input
                type="text"
                className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none transition focus:border-accent-violet"
                placeholder="e.g. Morning Run"
                {...register("name", { required: "Habit name is required" })}
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
            </div>

            <CategoryPicker value={category} onChange={setCategory} />
            <SegmentedControl label="Priority" options={PRIORITIES} value={priority} onChange={setPriority} />
            <SegmentedControl
              label="Difficulty"
              options={DIFFICULTIES}
              value={difficulty}
              onChange={setDifficulty}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Daily target</label>
                <input
                  type="number"
                  min="1"
                  className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none transition focus:border-accent-violet"
                  {...register("dailyTarget")}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Unit</label>
                <input
                  type="text"
                  placeholder="e.g. pages"
                  className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none transition focus:border-accent-violet"
                  {...register("targetUnit")}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Reminder time</label>
              <input
                type="time"
                className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none transition focus:border-accent-violet"
                {...register("reminderTime")}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Notes</label>
              <textarea
                rows={2}
                className="w-full resize-none rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none transition focus:border-accent-violet"
                placeholder="Optional"
                {...register("notes")}
              />
            </div>

            {serverError && (
              <div className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm text-red-300">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-lg bg-gradient-to-r from-accent-blue via-accent-violet to-accent-emerald px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : isEditing ? "Save changes" : "Create habit"}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HabitFormModal;
