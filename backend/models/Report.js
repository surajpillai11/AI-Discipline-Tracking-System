import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["weekly", "monthly"],
      required: true,
    },
    periodStart: {
      type: String, // "YYYY-MM-DD"
      required: true,
    },
    periodEnd: {
      type: String,
      required: true,
    },
    // Raw numbers used to generate the report - kept alongside the AI content
    // so the PDF/UI can show real stats even if the AI text is regenerated later.
    stats: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // The AI-generated content itself - shape differs for weekly vs monthly,
    // so kept flexible rather than a rigid sub-schema.
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

reportSchema.index({ user: 1, type: 1, createdAt: -1 });

const Report = mongoose.model("Report", reportSchema);

export default Report;
