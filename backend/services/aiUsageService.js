import AIUsageLog from "../models/AIUsageLog.js";

/**
 * Logs a single AI feature call for admin analytics. Deliberately swallows
 * its own errors (logging a failure to log shouldn't ever break the actual
 * AI response the user is waiting on).
 */
export const logAIUsage = async (userId, feature) => {
  try {
    await AIUsageLog.create({ user: userId, feature });
  } catch (error) {
    console.error(`Failed to log AI usage (${feature}): ${error.message}`);
  }
};
