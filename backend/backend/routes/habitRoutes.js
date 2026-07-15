import express from "express";
import {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
  toggleCompleteToday,
} from "../controllers/habitController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All habit routes require a logged-in user
router.use(protect);

router.route("/").post(createHabit).get(getHabits);

router.route("/:id").get(getHabitById).put(updateHabit).delete(deleteHabit);

router.patch("/:id/complete", toggleCompleteToday);

export default router;
