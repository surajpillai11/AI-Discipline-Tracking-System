import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getHabitStatistics,
  getAIUsageAnalytics,
  getAllReports,
  getDashboardMetrics,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/dashboard", getDashboardMetrics);
router.get("/stats/habits", getHabitStatistics);
router.get("/stats/ai-usage", getAIUsageAnalytics);
router.get("/reports", getAllReports);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
