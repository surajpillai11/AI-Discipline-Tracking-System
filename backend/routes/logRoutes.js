import express from "express";
import {
  getLogs,
  getLogByDate,
  updateJournalEntry,
  getHeatmapData,
} from "../controllers/logController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getLogs);
router.get("/heatmap", getHeatmapData); // must come before /:date
router.get("/:date", getLogByDate);
router.put("/:date/journal", updateJournalEntry);

export default router;
