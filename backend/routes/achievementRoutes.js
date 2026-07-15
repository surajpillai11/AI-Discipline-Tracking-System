import express from "express";
import { getEarnedAchievements, getAchievementCatalog } from "../controllers/achievementController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getEarnedAchievements);
router.get("/catalog", getAchievementCatalog);

export default router;
