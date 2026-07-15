import Habit from "../models/Habit.js";
import User from "../models/User.js";
import {
  todayString,
  calculateCurrentStreak,
  calculateLongestStreak,
} from "../utils/streakCalculator.js";

/**
 * Small helper: fetches a habit and confirms it belongs to req.user.
 * Throws a 404 (not 403) if it's someone else's habit, so we don't
 * leak the existence of other users' data.
 */
const getOwnedHabit = async (habitId, userId) => {
  const habit = await Habit.findById(habitId);
  if (!habit || habit.user.toString() !== userId.toString()) {
    const error = new Error("Habit not found");
    error.statusCode = 404;
    throw error;
  }
  return habit;
};

/**
 * @route   POST /api/habits
 * @access  Private
 */
export const createHabit = async (req, res, next) => {
  try {
    const {
      name,
      notes,
      category,
      customCategoryLabel,
      priority,
      difficulty,
      dailyTarget,
      targetUnit,
      reminderTime,
    } = req.body;

    if (!name || !name.trim()) {
      res.status(400);
      throw new Error("Habit name is required");
    }

    const habit = await Habit.create({
      user: req.user._id,
      name,
      notes,
      category,
      customCategoryLabel,
      priority,
      difficulty,
      dailyTarget,
      targetUnit,
      reminderTime,
    });

    res.status(201).json({ success: true, data: habit });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/habits
 * @query   category, isActive, priority (all optional filters)
 * @access  Private
 */
export const getHabits = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };

    if (req.query.category) filter.category = req.query.category;
    if (req.query.priority) filter.priority = req.query.priority;
    // default to active-only unless explicitly asked for archived/all
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === "true";
    } else {
      filter.isActive = true;
    }

    const habits = await Habit.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: habits.length, data: habits });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/habits/:id
 * @access  Private
 */
export const getHabitById = async (req, res, next) => {
  try {
    const habit = await getOwnedHabit(req.params.id, req.user._id);
    res.json({ success: true, data: habit });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/habits/:id
 * @access  Private
 */
export const updateHabit = async (req, res, next) => {
  try {
    const habit = await getOwnedHabit(req.params.id, req.user._id);

    const editableFields = [
      "name",
      "notes",
      "category",
      "customCategoryLabel",
      "priority",
      "difficulty",
      "dailyTarget",
      "targetUnit",
      "reminderTime",
      "isActive",
    ];

    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        habit[field] = req.body[field];
      }
    });

    const updated = await habit.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/habits/:id
 * @access  Private
 */
export const deleteHabit = async (req, res, next) => {
  try {
    const habit = await getOwnedHabit(req.params.id, req.user._id);
    await habit.deleteOne();
    res.json({ success: true, message: "Habit deleted" });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/habits/:id/complete
 * @access  Private
 *
 * Toggles today's completion for a habit. If today is already marked
 * complete, calling this again un-marks it (handles accidental taps).
 * Recalculates current + longest streak and bumps the user's aggregate stats.
 */
export const toggleCompleteToday = async (req, res, next) => {
  try {
    const habit = await getOwnedHabit(req.params.id, req.user._id);
    const today = todayString();
    const alreadyDone = habit.completedDates.includes(today);

    if (alreadyDone) {
      habit.completedDates = habit.completedDates.filter((d) => d !== today);
      habit.totalCompletions = Math.max(0, habit.totalCompletions - 1);
    } else {
      habit.completedDates.push(today);
      habit.totalCompletions += 1;
    }

    habit.currentStreak = calculateCurrentStreak(habit.completedDates);
    habit.longestStreak = Math.max(
      habit.longestStreak,
      calculateLongestStreak(habit.completedDates)
    );
    habit.lastCompletedDate = alreadyDone
      ? habit.completedDates[habit.completedDates.length - 1] || null
      : today;

    await habit.save();

    // Keep the user's aggregate stats roughly in sync.
    // Step 4 will replace this with a proper cross-habit recalculation job.
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { "stats.totalHabitsCompleted": alreadyDone ? -1 : 1 },
    });

    res.json({
      success: true,
      data: habit,
      completedToday: !alreadyDone,
    });
  } catch (error) {
    next(error);
  }
};
