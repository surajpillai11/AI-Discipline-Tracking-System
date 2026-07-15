import DailyLog from "../models/DailyLog.js";
import { completionToLevel, dateRangeArray } from "../utils/heatmapUtils.js";

/**
 * @route   GET /api/logs?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * @access  Private
 *
 * Returns all daily logs for the user in a date range. If no range is
 * given, defaults to the last 30 days. This is the raw data source
 * Step 5's calendar heatmap endpoint will format for the frontend.
 */
export const getLogs = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = { user: req.user._id };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    } else {
      // default: last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filter.date = { $gte: thirtyDaysAgo.toISOString().slice(0, 10) };
    }

    const logs = await DailyLog.find(filter).sort({ date: 1 });
    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/logs/:date  (date format: YYYY-MM-DD)
 * @access  Private
 */
export const getLogByDate = async (req, res, next) => {
  try {
    const log = await DailyLog.findOne({
      user: req.user._id,
      date: req.params.date,
    }).populate("completedHabits", "name category priority");

    if (!log) {
      return res.json({
        success: true,
        data: {
          date: req.params.date,
          completedHabits: [],
          totalActiveHabits: 0,
          completionPercentage: 0,
        },
      });
    }

    res.json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/logs/:date/journal
 * @access  Private
 *
 * Lets a user add a mood + journal entry for a given day (part of the
 * "Extra Features" - Daily Journal / Mood Tracker - from the spec).
 * Upserts so a journal entry can be added even on a day with no habits done.
 */
export const updateJournalEntry = async (req, res, next) => {
  try {
    const { mood, journalEntry } = req.body;

    const log = await DailyLog.findOneAndUpdate(
      { user: req.user._id, date: req.params.date },
      {
        $set: {
          ...(mood !== undefined && { mood }),
          ...(journalEntry !== undefined && { journalEntry }),
        },
        $setOnInsert: {
          user: req.user._id,
          date: req.params.date,
        },
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/logs/heatmap?year=2026
 * @route   GET /api/logs/heatmap?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * @access  Private
 *
 * Returns a gap-free array covering every day in the requested range,
 * each bucketed into a GitHub-style intensity level (0-4), plus summary
 * stats. Defaults to the current calendar year if no params are given.
 */
export const getHeatmapData = async (req, res, next) => {
  try {
    let { startDate, endDate, year } = req.query;

    if (!startDate || !endDate) {
      const y = year ? parseInt(year, 10) : new Date().getFullYear();
      startDate = `${y}-01-01`;
      endDate = `${y}-12-31`;
    }

    const logs = await DailyLog.find({
      user: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    }).select("date completionPercentage totalActiveHabits completedHabits");

    const logMap = new Map(logs.map((log) => [log.date, log]));

    // Don't build a heatmap past today - future days shouldn't show as "missed"
    const today = new Date().toISOString().slice(0, 10);
    const effectiveEndDate = endDate > today ? today : endDate;

    const allDates = dateRangeArray(startDate, effectiveEndDate);

    const heatmap = allDates.map((date) => {
      const log = logMap.get(date);
      const percentage = log ? log.completionPercentage : 0;
      return {
        date,
        completionPercentage: percentage,
        completedCount: log ? log.completedHabits.length : 0,
        totalActiveHabits: log ? log.totalActiveHabits : 0,
        level: completionToLevel(percentage),
      };
    });

    const activeDays = heatmap.filter((d) => d.completionPercentage > 0).length;
    const perfectDays = heatmap.filter((d) => d.completionPercentage === 100).length;
    const bestDay = heatmap.reduce(
      (best, d) => (d.completionPercentage > (best?.completionPercentage ?? -1) ? d : best),
      null
    );

    res.json({
      success: true,
      data: {
        startDate,
        endDate: effectiveEndDate,
        days: heatmap,
        summary: {
          totalDays: heatmap.length,
          activeDays,
          perfectDays,
          bestDay: bestDay
            ? { date: bestDay.date, completionPercentage: bestDay.completionPercentage }
            : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
