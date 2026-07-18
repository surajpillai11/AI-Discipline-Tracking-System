import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { getLogByDate, updateJournalEntry } from "../../api/logs";

const MOOD_OPTIONS = [
  { value: "great", emoji: "🤩", label: "Great" },
  { value: "good", emoji: "🙂", label: "Good" },
  { value: "okay", emoji: "😐", label: "Okay" },
  { value: "low", emoji: "😕", label: "Low" },
  { value: "bad", emoji: "😞", label: "Bad" },
];

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const DayDetailPanel = ({ date, onClose }) => {
  const [log, setLog] = useState(null);
  const [mood, setMood] = useState("");
  const [journalEntry, setJournalEntry] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    getLogByDate(date)
      .then((res) => {
        if (cancelled) return;
        setLog(res.data.data);
        setMood(res.data.data.mood || "");
        setJournalEntry(res.data.data.journalEntry || "");
      })
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [date]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    try {
      await updateJournalEntry(date, { mood, journalEntry });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
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
          onClick={(e) => e.stopPropagation()}
          className="glass-panel gradient-border max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl p-6"
        >
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="font-display text-base font-semibold">{formatDate(date)}</h2>
              {log && (
                <p className="mt-0.5 text-xs text-ink-muted">
                  {log.completionPercentage}% complete · {log.completedHabits?.length || 0}/
                  {log.totalActiveHabits} habits
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:bg-surface-hover"
            >
              <X size={16} />
            </button>
          </div>

          {isLoading ? (
            <p className="text-sm text-ink-muted">Loading...</p>
          ) : (
            <>
              {log?.completedHabits?.length > 0 && (
                <div className="mb-5">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-muted">
                    Completed
                  </p>
                  <ul className="space-y-1.5">
                    {log.completedHabits.map((h) => (
                      <li key={h._id} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 size={14} className="text-accent-emerald" />
                        {h.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">Mood</label>
                <div className="flex gap-1.5">
                  {MOOD_OPTIONS.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setMood(mood === m.value ? "" : m.value)}
                      title={m.label}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border text-lg transition ${
                        mood === m.value
                          ? "border-accent-violet bg-accent-violet/15"
                          : "border-border hover:border-border-hover"
                      }`}
                    >
                      {m.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Journal entry</label>
                <textarea
                  rows={4}
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder="How did today go?"
                  className="w-full resize-none rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none transition focus:border-accent-violet"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full rounded-lg bg-gradient-to-r from-accent-blue via-accent-violet to-accent-emerald px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : saved ? "Saved ✓" : "Save"}
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DayDetailPanel;
