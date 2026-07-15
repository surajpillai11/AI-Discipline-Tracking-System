import express from "express";
import {
  sendFriendRequest,
  getIncomingRequests,
  respondToRequest,
  getFriends,
  removeFriend,
} from "../controllers/friendController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getFriends);
router.post("/request", sendFriendRequest);
router.get("/requests", getIncomingRequests);
router.patch("/requests/:id", respondToRequest);
router.delete("/:userId", removeFriend);

export default router;
