import express from "express";
import {
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  getCategoryBreakdown,
  getStreakGraph,
  getProductivityTrend,
  getOverview,
} from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/overview", getOverview);
router.get("/weekly", getWeeklyAnalytics);
router.get("/monthly", getMonthlyAnalytics);
router.get("/category-breakdown", getCategoryBreakdown);
router.get("/streaks", getStreakGraph);
router.get("/productivity-trend", getProductivityTrend);

export default router;
