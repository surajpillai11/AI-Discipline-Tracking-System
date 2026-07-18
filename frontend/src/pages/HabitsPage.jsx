import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Layout from "../components/layout/Layout";
import HabitCard from "../components/habits/HabitCard";
import HabitFormModal from "../components/habits/HabitFormModal";
import ConfirmDeleteDialog from "../components/habits/ConfirmDeleteDialog";
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabitComplete,
} from "../api/habits";
import { CATEGORIES, PRIORITIES } from "../constants/habitOptions";

const HabitsPage = () => {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const [modalHabit, setModalHabit] = useState(undefined); // undefined = closed, null = create, object = edit
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchHabits = async () => {
    try {
      setError("");
      const params = {};
      if (categoryFilter) params.category = categoryFilter;
      if (priorityFilter) params.priority = priorityFilter;
      const res = await getHabits(params);
      setHabits(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load habits");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, priorityFilter]);

  const handleToggle = async (habitId) => {
    await toggleHabitComplete(habitId);
    fetchHabits();
  };

  const handleFormSubmit = async (data) => {
    if (modalHabit) {
      await updateHabit(modalHabit._id, data);
    } else {
      await createHabit(data);
    }
    await fetchHabits();
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteHabit(deleteTarget._id);
      setDeleteTarget(null);
      await fetchHabits();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete habit");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Habits</h1>
          <p className="mt-1 text-sm text-ink-muted">Manage everything you're tracking.</p>
        </div>
        <button
          onClick={() => setModalHabit(null)}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent-blue via-accent-violet to-accent-emerald px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus size={15} /> New Habit
        </button>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-2">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="glass-panel rounded-lg px-3 py-1.5 text-sm outline-none"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.value}
            </option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="glass-panel rounded-lg px-3 py-1.5 text-sm outline-none"
        >
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {isLoading ? (
        <p className="font-mono text-sm text-ink-muted">Loading habits...</p>
      ) : habits.length === 0 ? (
        <div className="glass-panel rounded-xl p-8 text-center">
          <p className="text-sm text-ink-muted">
            {categoryFilter || priorityFilter
              ? "No habits match these filters."
              : "No habits yet - create your first one to start building a streak."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => (
            <HabitCard
              key={habit._id}
              habit={habit}
              onToggle={handleToggle}
              onEdit={setModalHabit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {modalHabit !== undefined && (
        <HabitFormModal
          habit={modalHabit}
          onClose={() => setModalHabit(undefined)}
          onSubmit={handleFormSubmit}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteDialog
          habitName={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
        />
      )}
    </Layout>
  );
};

export default HabitsPage;
