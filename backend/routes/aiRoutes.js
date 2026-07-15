import express from "express";
import {
  chatWithCoach,
  getChatHistory,
  clearChatHistory,
  suggestHabits,
  adoptSuggestedHabits,
  generateDailyPlan,
} from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";
import { aiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.use(protect);

router.post("/coach/chat", aiLimiter, chatWithCoach);
router.get("/coach/history", getChatHistory);
router.delete("/coach/history", clearChatHistory);

router.post("/habits/suggest", aiLimiter, suggestHabits);
router.post("/habits/adopt", adoptSuggestedHabits);
router.post("/planner/generate", aiLimiter, generateDailyPlan);

export default router;
