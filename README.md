# Offer Tracker

A personal job application tracker: log applications, move them through a status
board, and keep a timeline of what happened with each one.

This project exists to be **contributed to**. It's a CodePath capstone codebase —
real, working, and deliberately left with room for more features and a few small
bugs, so that picking up an issue and opening a PR looks like it would on any
open source project.

## What's implemented

- Add, edit, and delete applications
- A list view (`/applications`) with status filtering and search
- A Kanban-style board view (`/applications/board`) with per-status columns
- A detail page per application with a full activity timeline
- Quick status changes from the list and board views
- A dashboard with per-status counts and recent activity

## What's not (yet) — see [open issues](../../issues)

Tags, contacts, drag-and-drop on the board, CSV export, pagination, charts,
a calendar view, file attachments, and real authentication are all intentionally
left for contributors to build. There are also a handful of small, non-breaking
bugs scattered around — see issues labeled `bug`.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Prisma](https://www.prisma.io) + SQLite — no external database server
- Tailwind CSS
- [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com)

No Docker, no external services — just Node.

## Getting started

Before you start, you'll need to make sure you have npm installed, in order to
install project dependencies. You can check this by running:

```bash
npm -v
```

to see which version of npm you have installed. If you don't have it, you'll need
to download and install Node.js from the [official site](https://nodejs.org/en).

Once installed, run the following commands:

```bash
git clone <this-repo-url>
cd offer-tracker
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The database is a local
SQLite file (`prisma/dev.db`) that's created and seeded with ~18 sample
applications automatically the first time you run `npm run dev`.

## Project structure

```
prisma/schema.prisma       # data model
prisma/seed.ts             # sample data
src/app/                   # pages and API routes (Next.js App Router)
src/components/            # UI components
src/lib/                   # data access, validation, constants
tests/                     # unit, component, and API route tests
```

## npm scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Applies migrations, seeds the DB if empty, starts the dev server |
| `npm run build` | Production build |
| `npm start` | Runs the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Runs the test suite once |
| `npm run test:watch` | Runs tests in watch mode |
| `npm run db:seed` | Re-runs the seed script (no-ops if data already exists) |
| `npm run db:reset` | Drops and recreates the local database |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Start with an issue labeled
[`good-first-issue`](../../issues?q=is%3Aissue+is%3Aopen+label%3Agood-first-issue).

## License

MIT — see [LICENSE](LICENSE).
