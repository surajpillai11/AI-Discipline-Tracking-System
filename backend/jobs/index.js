import { startHabitReminderJob } from "./habitReminderJob.js";
import { startDailyMotivationJob } from "./dailyMotivationJob.js";
import { startWeeklyReportReminderJob } from "./weeklyReportJob.js";

export const startAllScheduledJobs = () => {
  startHabitReminderJob();
  startDailyMotivationJob();
  startWeeklyReportReminderJob();
};
