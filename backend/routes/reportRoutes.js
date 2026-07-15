import express from "express";
import {
  generateWeeklyReport,
  generateMonthlyReport,
  getReports,
  getReportById,
  downloadReportPdf,
} from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";
import { aiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.use(protect);

router.get("/", getReports);
router.post("/weekly/generate", aiLimiter, generateWeeklyReport);
router.post("/monthly/generate", aiLimiter, generateMonthlyReport);
router.get("/:id", getReportById);
router.get("/:id/pdf", downloadReportPdf);

export default router;
