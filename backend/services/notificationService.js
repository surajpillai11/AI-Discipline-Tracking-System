import Notification from "../models/Notification.js";

export const createNotification = async ({ userId, type, title, message, relatedHabit = null }) => {
  return Notification.create({
    user: userId,
    type,
    title,
    message,
    relatedHabit,
  });
};
