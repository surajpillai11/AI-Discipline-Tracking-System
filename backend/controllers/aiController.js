import AIChat from "../models/AIChat.js";
import { CATEGORIES } from "../models/Habit.js";
import Habit from "../models/Habit.js";
import { callGeminiCoach, callGeminiJSON } from "../services/geminiClient.js";
import { buildCoachSystemInstruction } from "../services/aiCoachContext.js";

const MAX_HISTORY_TURNS_SENT = 10; // how many past messages we feed back to Gemini for context
const MAX_MESSAGES_STORED = 200; // cap stored history per user so the doc doesn't grow forever

/**
 * @route   POST /api/ai/coach/chat
 * @access  Private
 * @body    { message: string }
 */
export const chatWithCoach = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      res.status(400);
      throw new Error("Message is required");
    }

    let chat = await AIChat.findOne({ user: req.user._id });
    if (!chat) {
      chat = await AIChat.create({ user: req.user._id, messages: [] });
    }

    const recentHistory = chat.messages.slice(-MAX_HISTORY_TURNS_SENT).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const systemInstruction = await buildCoachSystemInstruction(req.user);
    const replyText = await callGeminiCoach(systemInstruction, recentHistory, message.trim());

    chat.messages.push({ role: "user", content: message.trim() });
    chat.messages.push({ role: "assistant", content: replyText });

    // trim oldest messages if we've grown past the cap
    if (chat.messages.length > MAX_MESSAGES_STORED) {
      chat.messages = chat.messages.slice(chat.messages.length - MAX_MESSAGES_STORED);
    }

    await chat.save();

    res.json({
      success: true,
      data: {
        reply: replyText,
        conversationLength: chat.messages.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/ai/coach/history?limit=50
 * @access  Private
 */
export const getChatHistory = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, MAX_MESSAGES_STORED);
    const chat = await AIChat.findOne({ user: req.user._id });

    if (!chat) {
      return res.json({ success: true, data: [] });
    }

    res.json({ success: true, data: chat.messages.slice(-limit) });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/ai/coach/history
 * @access  Private
 */
export const clearChatHistory = async (req, res, next) => {
  try {
    await AIChat.findOneAndUpdate(
      { user: req.user._id },
      { $set: { messages: [] } },
      { upsert: true }
    );
    res.json({ success: true, message: "Chat history cleared" });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/ai/habits/suggest
 * @access  Private
 * @body    { goal: string }  e.g. "I want to become more disciplined"
 *
 * Generates 5-8 personalized habit suggestions as structured JSON, using
 * only categories that actually exist in the Habit model so suggestions
 * can be adopted directly via /api/ai/habits/adopt below.
 */
export const suggestHabits = async (req, res, next) => {
  try {
    const { goal } = req.body;

    if (!goal || !goal.trim()) {
      res.status(400);
      throw new Error("A goal description is required, e.g. 'I want to become more disciplined'");
    }

    const existingHabits = await Habit.find({ user: req.user._id, isActive: true }).select("name");
    const existingNames = existingHabits.map((h) => h.name).join(", ") || "none yet";

    const systemInstruction = `You are a habit design expert for a discipline-tracking app.
Given a user's goal, generate 5 to 8 specific, actionable daily habit suggestions.

Only use these exact category values: ${CATEGORIES.join(", ")}.
Only use these exact difficulty values: Easy, Medium, Hard.
Only use these exact priority values: Low, Medium, High.

The user already has these habits (don't suggest exact duplicates): ${existingNames}.

Respond ONLY with JSON matching exactly this shape, no other text:
{
  "suggestions": [
    {
      "name": "string, concise habit name, 3-6 words",
      "category": "one of the allowed categories",
      "difficulty": "Easy | Medium | Hard",
      "priority": "Low | Medium | High",
      "reason": "one sentence on why this helps their specific goal"
    }
  ]
}`;

    const result = await callGeminiJSON(systemInstruction, `User's goal: ${goal.trim()}`);

    if (!Array.isArray(result.suggestions)) {
      res.status(502);
      throw new Error("AI response was not in the expected format");
    }

    res.json({ success: true, data: result.suggestions });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/ai/habits/adopt
 * @access  Private
 * @body    { habits: [{ name, category, difficulty, priority }] }
 *
 * Bulk-creates real Habit documents from suggestions the user chose to keep,
 * so the AI Habit Suggestions feature actually closes the loop into the app.
 */
export const adoptSuggestedHabits = async (req, res, next) => {
  try {
    const { habits } = req.body;

    if (!Array.isArray(habits) || habits.length === 0) {
      res.status(400);
      throw new Error("habits must be a non-empty array");
    }

    const toCreate = habits.map((h) => ({
      user: req.user._id,
      name: h.name,
      category: h.category || "Custom",
      difficulty: h.difficulty || "Medium",
      priority: h.priority || "Medium",
    }));

    const created = await Habit.insertMany(toCreate);
    res.status(201).json({ success: true, count: created.length, data: created });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/ai/planner/generate
 * @access  Private
 * @body    { tasks: string[], wakeTime?: "HH:mm", sleepTime?: "HH:mm" }
 *
 * Turns a rough list of tasks into an optimized daily schedule.
 */
export const generateDailyPlan = async (req, res, next) => {
  try {
    const { tasks, wakeTime, sleepTime } = req.body;

    if (!Array.isArray(tasks) || tasks.length === 0) {
      res.status(400);
      throw new Error("tasks must be a non-empty array of strings, e.g. ['College', 'Gym']");
    }

    const wake = wakeTime || "07:00";
    const sleep = sleepTime || "23:00";

    const systemInstruction = `You are a productivity planner for a discipline-tracking app.
Given a rough list of tasks for the day and the user's wake/sleep times, produce a realistic,
optimized daily schedule. Order tasks sensibly (e.g. exercise earlier, deep-focus work when fresh,
errands/shopping later), leave reasonable buffer/break time, and don't schedule anything before
wake time or after sleep time.

Respond ONLY with JSON matching exactly this shape, no other text:
{
  "schedule": [
    {
      "time": "HH:mm",
      "task": "string",
      "durationMinutes": number,
      "notes": "short optional tip for this block, or empty string"
    }
  ]
}`;

    const userPrompt = `Wake time: ${wake}\nSleep time: ${sleep}\nTasks to schedule: ${tasks.join(", ")}`;

    const result = await callGeminiJSON(systemInstruction, userPrompt);

    if (!Array.isArray(result.schedule)) {
      res.status(502);
      throw new Error("AI response was not in the expected format");
    }

    res.json({ success: true, data: result.schedule });
  } catch (error) {
    next(error);
  }
};
