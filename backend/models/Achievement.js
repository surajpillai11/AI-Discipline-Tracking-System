import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    key: {
      type: String,
      required: true, // matches a key in utils/achievementDefinitions.js
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "🏅",
    },
  },
  { timestamps: true } // createdAt doubles as "earnedAt"
);

// A user can only earn each badge once
achievementSchema.index({ user: 1, key: 1 }, { unique: true });

const Achievement = mongoose.model("Achievement", achievementSchema);

export default Achievement;
