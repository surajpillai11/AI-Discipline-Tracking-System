import PDFDocument from "pdfkit";
import Report from "../models/Report.js";
import { gatherPeriodStats } from "../services/reportDataService.js";
import { callGeminiJSON } from "../services/geminiClient.js";
import { logAIUsage } from "../services/aiUsageService.js";

/**
 * @route   POST /api/reports/weekly/generate
 * @access  Private
 *
 * Gathers the user's real last-7-days data, asks the AI to analyze it,
 * and stores the result as a Report document.
 */
export const generateWeeklyReport = async (req, res, next) => {
  try {
    const stats = await gatherPeriodStats(req.user._id, 7);

    const systemInstruction = `You are a discipline coach writing a weekly review for ${req.user.name}.
Analyze the real data provided and respond ONLY with JSON in exactly this shape, no other text:
{
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "productivityScore": number (0-100),
  "suggestedImprovements": ["string", "string"],
  "motivation": "string, 1-2 sentences, specific to their actual data, not generic"
}
Base every point on the actual numbers given - reference real habit names and percentages.
If they have no habits or no activity this week, be encouraging about getting started rather
than critical.`;

    const userPrompt = `Weekly data for ${stats.periodStart} to ${stats.periodEnd}:
Average daily completion: ${stats.averageDailyCompletion}%
Total active habits: ${stats.totalActiveHabits}
Per-habit breakdown: ${JSON.stringify(stats.habitBreakdown)}`;

    const content = await callGeminiJSON(systemInstruction, userPrompt);

    const report = await Report.create({
      user: req.user._id,
      type: "weekly",
      periodStart: stats.periodStart,
      periodEnd: stats.periodEnd,
      stats,
      content,
    });

    await logAIUsage(req.user._id, "weekly_report");

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/reports/monthly/generate
 * @access  Private
 */
export const generateMonthlyReport = async (req, res, next) => {
  try {
    const stats = await gatherPeriodStats(req.user._id, 30);

    const systemInstruction = `You are a discipline coach writing a monthly report for ${req.user.name}.
Analyze the real data provided and respond ONLY with JSON in exactly this shape, no other text:
{
  "bestHabit": { "name": "string", "reason": "string" },
  "worstHabit": { "name": "string", "reason": "string" },
  "overallDisciplineScore": number (0-100),
  "streakPerformance": "string, 2-3 sentences on their streak trends this month",
  "suggestedGoals": ["string", "string", "string"],
  "summary": "string, 2-3 sentence overview of the month"
}
Base every point on the actual numbers given - reference real habit names, streaks, and percentages.
If bestHabit or worstHabit can't be determined (e.g. no habits), set that field to null.`;

    const userPrompt = `Monthly data for ${stats.periodStart} to ${stats.periodEnd}:
Average daily completion: ${stats.averageDailyCompletion}%
Total active habits: ${stats.totalActiveHabits}
Best performing (by completion rate): ${JSON.stringify(stats.bestPerformingHabit)}
Worst performing (by completion rate): ${JSON.stringify(stats.worstPerformingHabit)}
Full per-habit breakdown: ${JSON.stringify(stats.habitBreakdown)}`;

    const content = await callGeminiJSON(systemInstruction, userPrompt);

    const report = await Report.create({
      user: req.user._id,
      type: "monthly",
      periodStart: stats.periodStart,
      periodEnd: stats.periodEnd,
      stats,
      content,
    });

    await logAIUsage(req.user._id, "monthly_report");

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/reports?type=weekly|monthly
 * @access  Private
 */
export const getReports = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.type) filter.type = req.query.type;

    const reports = await Report.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/reports/:id
 * @access  Private
 */
export const getReportById = async (req, res, next) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, user: req.user._id });
    if (!report) {
      res.status(404);
      throw new Error("Report not found");
    }
    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/reports/:id/pdf
 * @access  Private
 *
 * Streams a simple, clean PDF version of a stored report for download.
 */
export const downloadReportPdf = async (req, res, next) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, user: req.user._id });
    if (!report) {
      res.status(404);
      throw new Error("Report not found");
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${report.type}-report-${report.periodStart}.pdf"`
    );

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    doc
      .fontSize(20)
      .text(`${report.type === "weekly" ? "Weekly" : "Monthly"} Discipline Report`, {
        underline: true,
      });
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor("#555").text(`${report.periodStart} to ${report.periodEnd}`);
    doc.moveDown(1.5);
    doc.fillColor("#000");

    const c = report.content;

    if (report.type === "weekly") {
      addSection(doc, "Productivity Score", `${c.productivityScore ?? "N/A"}/100`);
      addListSection(doc, "Strengths", c.strengths);
      addListSection(doc, "Weaknesses", c.weaknesses);
      addListSection(doc, "Suggested Improvements", c.suggestedImprovements);
      addSection(doc, "Motivation", c.motivation);
    } else {
      addSection(doc, "Overall Discipline Score", `${c.overallDisciplineScore ?? "N/A"}/100`);
      addSection(doc, "Best Habit", c.bestHabit ? `${c.bestHabit.name} — ${c.bestHabit.reason}` : "N/A");
      addSection(
        doc,
        "Habit Needing Attention",
        c.worstHabit ? `${c.worstHabit.name} — ${c.worstHabit.reason}` : "N/A"
      );
      addSection(doc, "Streak Performance", c.streakPerformance);
      addListSection(doc, "Suggested Goals", c.suggestedGoals);
      addSection(doc, "Summary", c.summary);
    }

    doc.end();
  } catch (error) {
    next(error);
  }
};

// --- small local PDF-building helpers ---
function addSection(doc, title, body) {
  doc.fontSize(14).fillColor("#222").text(title, { underline: true });
  doc.moveDown(0.3);
  doc.fontSize(11).fillColor("#000").text(body || "N/A");
  doc.moveDown(1);
}

function addListSection(doc, title, items) {
  doc.fontSize(14).fillColor("#222").text(title, { underline: true });
  doc.moveDown(0.3);
  doc.fontSize(11).fillColor("#000");
  if (Array.isArray(items) && items.length > 0) {
    items.forEach((item) => doc.text(`• ${item}`));
  } else {
    doc.text("N/A");
  }
  doc.moveDown(1);
}
