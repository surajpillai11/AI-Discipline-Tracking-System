# AI Discipline Tracker — Build Roadmap

Tracking progress against the full spec. Each step is built, explained, and confirmed before moving to the next.

## Backend (MVC)
- [x] Step 1: Project setup — folder structure, security middleware, error handling, DB connection, server entry point
- [x] Step 2: User model + Auth (signup/login/JWT/protected routes)
- [x] Step 3: Habit model + CRUD APIs (incl. basic mark-complete/streak tracking)
- [x] Step 4: Daily Log model + Streak calculation engine
- [x] Step 5: Calendar heatmap data endpoint
- [x] Step 6: Analytics endpoints (weekly/monthly aggregates for charts)
- [x] Step 7: AI Discipline Coach (chat endpoint via Gemini API)
- [x] Step 8: AI Habit Suggestions + Daily Planner
- [x] Step 9: AI Weekly/Monthly Report generation (incl. PDF export)
- [x] Step 10: Achievements/badge system
- [x] Step 11: Leaderboard + friends
- [x] Step 12: Notifications (email + scheduled jobs)
- [x] Step 13: Admin panel APIs

## Frontend (React + Vite)
- [ ] Step 14: Vite + Tailwind setup, routing, auth pages
- [ ] Step 15: Dashboard UI (glassmorphism, streaks, today's habits)
- [ ] Step 16: Habit management UI
- [ ] Step 17: Calendar heatmap component
- [ ] Step 18: Analytics charts (Recharts)
- [ ] Step 19: AI Coach chat UI
- [ ] Step 20: Achievements, leaderboard, profile pages
- [ ] Step 21: Dark/light mode, PWA, polish

## Deployment
- [ ] Step 22: Deploy backend to Render
- [ ] Step 23: Deploy frontend to Vercel
- [ ] Step 24: MongoDB Atlas production setup

---
Current status: **Step 13 complete — entire backend is now built.** See backend/ folder. To reach the admin routes, manually set a user's `role` to `"admin"` in MongoDB Atlas (no signup flow creates admins, by design). Step 14 starts the frontend.
