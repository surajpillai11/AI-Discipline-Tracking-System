import mongoose from "mongoose";

const aiUsageLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    feature: {
      type: String,
      enum: [
        "coach_chat",
        "habit_suggestion",
        "daily_planner",
        "weekly_report",
        "monthly_report",
      ],
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

aiUsageLogSchema.index({ feature: 1, createdAt: -1 });

const AIUsageLog = mongoose.model("AIUsageLog", aiUsageLogSchema);

export default AIUsageLog;
