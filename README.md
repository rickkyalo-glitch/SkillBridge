# SkillBridge 

SkillBridge is a peer-to-peer skill exchange platform built for students. Instead of paying for tutoring or ads-driven marketplaces, students trade what they know for what they want to learn — either through a direct **skill swap** (you teach me UI/UX, I teach you web dev) or by spending **Skill Coins**, an in-app currency earned by teaching, completing sessions, and leaving reviews.
 We separated each page we wanted among the 4 of us, then we did our parts separately to reduce merge conflicts then we gave the full codebase to Rick, who pushed it to Github.  We then refined the project later.

## What it does

- **Discover** — Browse other students, filter by skill category or search by name/department, and see a live compatibility score based on what you can teach and what you want to learn. Send a swap or coin-based exchange request straight from a match card.
- **My Profile** — Manage the skills you teach and the skills you want to learn, track your Skill Coins balance, and see your stats at a glance.
- **Requests** — Review incoming exchange requests, accept or decline them, and track requests you've sent and exchanges currently active. *(In progress)*
- **Schedule** — Book sessions with matched students, browse a calendar of upcoming sessions, and rate a session once it's done. *(In progress)*

## Tech stack

- **React 18** — component-based UI, all state managed with hooks (no external state library needed for an app this size)
- **Vite** — dev server and build tool
- **Tailwind CSS** — utility-first styling, no separate CSS files to hand-maintain per component

## Fonts

- **Space Grotesk** (headings) — a geometric, slightly quirky display font. It gives SkillBridge a distinct, modern identity instead of looking like a generic template, while still reading clearly at large sizes.
- **Inter** — used for all body text, labels, and UI copy. It's designed specifically for screens, stays legible at small sizes (tags, timestamps, form labels), and has a wide weight range so we can distinguish hierarchy without switching fonts.

Both are loaded via Google Fonts in `index.html`.

## Running it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Team

### Rick Kyalo
- Project lead
- Hardcoded data and shared utility functions (match scoring, avatar colors)
- Shared components (Avatar, SkillTag, Modal)
- HTML/CSS foundation and Tailwind setup
- Integration of all pages into the main app shell

### Jess
- Profile page: skill management (add/remove), Skill Coins display, profile stats

### Vinnie
- Requests page: incoming/sent/accepted request handling, accept/decline actions

### Bill
- Schedule page: calendar view, session booking, session reviews

### Team Contributions
- Brainstorming features
- Design discussions
- General project review and testing

