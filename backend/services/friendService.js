import Friendship from "../models/Friendship.js";

/**
 * Returns the list of user IDs that are accepted friends of the given user,
 * regardless of who originally sent the request.
 */
export const getFriendUserIds = async (userId) => {
  const friendships = await Friendship.find({
    status: "accepted",
    $or: [{ requester: userId }, { recipient: userId }],
  });

  return friendships.map((f) =>
    f.requester.toString() === userId.toString() ? f.recipient : f.requester
  );
};
