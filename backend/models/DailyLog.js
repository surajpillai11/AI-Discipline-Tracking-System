import mongoose from "mongoose";

const dailyLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: String, // "YYYY-MM-DD"
      required: true,
    },
    completedHabits: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Habit",
      },
    ],
    totalActiveHabits: {
      type: Number,
      default: 0,
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    // Placeholders for later features (mood tracker, daily journal - listed in spec Extra Features)
    mood: {
      type: String,
      enum: ["great", "good", "okay", "low", "bad", ""],
      default: "",
    },
    journalEntry: {
      type: String,
      maxlength: [2000, "Journal entry cannot exceed 2000 characters"],
      default: "",
    },
  },
  { timestamps: true }
);

// One log per user per day - upserted whenever a habit is completed/uncompleted
dailyLogSchema.index({ user: 1, date: 1 }, { unique: true });

const DailyLog = mongoose.model("DailyLog", dailyLogSchema);

export default DailyLog;
