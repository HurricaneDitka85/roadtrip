# 🛣️ Road Trip HQ

A summer road-trip companion for the whole car. Five tools in one mobile-first app:

- **License Plate Bingo** — all 50 states + DC, tap to collect, saves all summer
- **Farkle Scoreboard** — players, banked scores, undo, first-to-10,000, scoring reference
- **Road Trivia** — 30 family-friendly highway & Americana questions, shuffled each round
- **Scavenger Hunt** — 24 roadside sights with point values
- **Trip Log** — odometer miles, stops, and a running expense total

All data persists in `localStorage` on the device — no accounts, no backend, works offline once loaded.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Vercel auto-detects Vite. Accept the defaults and click **Deploy**.

That's it — build command `npm run build`, output `dist`, zero config.

## Customize

- Add trivia questions or scavenger items in `src/data.js`.
- Colors and type live as CSS variables at the top of `src/index.css`.
