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
- [x] Step 14: Vite + Tailwind setup, routing, auth pages
- [x] Step 15: Dashboard UI (glassmorphism, streaks, today's habits)
- [x] Step 16: Habit management UI
- [x] Step 17: Calendar heatmap component (full page)
- [x] Step 18: Analytics charts (Recharts)
- [x] Step 19: AI Coach chat UI
- [x] Step 20: Achievements, leaderboard, profile pages
- [x] Step 21: Dark/light mode, PWA, polish

## Deployment
- [ ] Step 22: Deploy backend to Render
- [ ] Step 23: Deploy frontend to Vercel
- [ ] Step 24: MongoDB Atlas production setup

---
Current status: **Step 21 complete — frontend feature-complete.** Fixed a real dark/light-mode bug: Tailwind utility classes like `text-ink` and `bg-white/5` compiled to fixed hex values regardless of theme, so hovered nav links and several UI elements would have rendered near-invisible in light mode. Refactored the theme tokens (`ink`, `ink-muted`, `border`, `surface`, `surface-hover`, `border-hover`) to route through CSS custom properties in index.css instead, so they dynamically resolve per theme. Verified the fix landed in the actual production CSS output, not just the source. Also added: PWA support via vite-plugin-pwa (manifest, service worker, offline app-shell caching — API calls deliberately excluded from caching so the app never shows stale streak data offline), a real app icon (verified by rendering it to PNG and viewing it, not just trusting hand-written SVG path math), and vendor chunk splitting in vite.config.js which resolved the bundle-size warning that had been present since Step 15.

Steps 22-24 (deployment to Render/Vercel/Atlas) require live accounts and credentials only you have, so those are manual steps I can walk you through when you're ready rather than something I can execute directly.
