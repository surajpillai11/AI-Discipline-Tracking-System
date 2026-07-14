import mongoose from "mongoose";

const CATEGORIES = [
  "Fitness",
  "Study",
  "Reading",
  "Meditation",
  "Coding",
  "Diet",
  "Water Intake",
  "Sleep",
  "Finance",
  "Custom",
];

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Habit name is required"],
      trim: true,
      maxlength: [100, "Habit name cannot exceed 100 characters"],
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
      default: "",
    },
    category: {
      type: String,
      enum: CATEGORIES,
      default: "Custom",
    },
    customCategoryLabel: {
      type: String,
      trim: true,
      maxlength: 40,
      default: "",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    dailyTarget: {
      type: Number,
      default: 1,
      min: [1, "Daily target must be at least 1"],
    },
    targetUnit: {
      type: String,
      trim: true,
      default: "", // e.g. "glasses", "minutes", "pages" - purely display, math stays in dailyTarget
      maxlength: 20,
    },
    reminderTime: {
      type: String, // stored as "HH:mm", validated below
      default: "",
      match: [/^([01]\d|2[0-3]):([0-5]\d)$|^$/, "reminderTime must be in HH:mm format"],
    },
    isActive: {
      type: Boolean,
      default: true, // false = archived, hidden from active dashboard but not deleted
    },

    // --- Streak & completion tracking (basic version; Step 4 builds full analytics on this) ---
    completedDates: {
      type: [String], // array of "YYYY-MM-DD" strings
      default: [],
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    totalCompletions: {
      type: Number,
      default: 0,
    },
    lastCompletedDate: {
      type: String, // "YYYY-MM-DD"
      default: null,
    },
  },
  { timestamps: true }
);

habitSchema.index({ user: 1, isActive: 1 });

const Habit = mongoose.model("Habit", habitSchema);

export default Habit;
export { CATEGORIES };
