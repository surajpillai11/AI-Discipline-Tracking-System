import User from "../models/User.js";
import Friendship from "../models/Friendship.js";
import { getFriendUserIds } from "../services/friendService.js";
import { createNotification } from "../services/notificationService.js";

/**
 * @route   POST /api/friends/request
 * @access  Private
 * @body    { email: string }  - the email of the person to add
 */
export const sendFriendRequest = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400);
      throw new Error("Recipient email is required");
    }

    const recipient = await User.findOne({ email: email.toLowerCase().trim() });
    if (!recipient) {
      res.status(404);
      throw new Error("No user found with that email");
    }

    if (recipient._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error("You can't add yourself as a friend");
    }

    // Check both directions for an existing relationship
    const existing = await Friendship.findOne({
      $or: [
        { requester: req.user._id, recipient: recipient._id },
        { requester: recipient._id, recipient: req.user._id },
      ],
    });

    if (existing) {
      res.status(400);
      throw new Error(
        existing.status === "accepted"
          ? "You're already friends with this user"
          : "A friend request already exists between you and this user"
      );
    }

    const friendship = await Friendship.create({
      requester: req.user._id,
      recipient: recipient._id,
      status: "pending",
    });

    await createNotification({
      userId: recipient._id,
      type: "friend_request",
      title: "New friend request",
      message: `${req.user.name} sent you a friend request.`,
    });

    res.status(201).json({ success: true, data: friendship });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/friends/requests
 * @access  Private
 * Incoming pending requests (people who want to add YOU).
 */
export const getIncomingRequests = async (req, res, next) => {
  try {
    const requests = await Friendship.find({
      recipient: req.user._id,
      status: "pending",
    }).populate("requester", "name email avatar");

    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/friends/requests/:id
 * @access  Private
 * @body    { action: "accept" | "decline" }
 */
export const respondToRequest = async (req, res, next) => {
  try {
    const { action } = req.body;
    if (!["accept", "decline"].includes(action)) {
      res.status(400);
      throw new Error("action must be 'accept' or 'decline'");
    }

    const friendship = await Friendship.findOne({
      _id: req.params.id,
      recipient: req.user._id, // only the recipient can respond
      status: "pending",
    });

    if (!friendship) {
      res.status(404);
      throw new Error("Friend request not found");
    }

    friendship.status = action === "accept" ? "accepted" : "declined";
    await friendship.save();

    res.json({ success: true, data: friendship });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/friends
 * @access  Private
 */
export const getFriends = async (req, res, next) => {
  try {
    const friendIds = await getFriendUserIds(req.user._id);
    const friends = await User.find({ _id: { $in: friendIds } }).select(
      "name email avatar stats"
    );

    res.json({ success: true, count: friends.length, data: friends });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/friends/:userId
 * @access  Private
 * Removes the friendship with the given user (in either direction).
 */
export const removeFriend = async (req, res, next) => {
  try {
    const result = await Friendship.findOneAndDelete({
      status: "accepted",
      $or: [
        { requester: req.user._id, recipient: req.params.userId },
        { requester: req.params.userId, recipient: req.user._id },
      ],
    });

    if (!result) {
      res.status(404);
      throw new Error("Friendship not found");
    }

    res.json({ success: true, message: "Friend removed" });
  } catch (error) {
    next(error);
  }
};
