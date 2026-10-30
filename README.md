# Campus Lost & Found

[![CI](https://github.com/Enjey-Kashlee/itelect4-project/actions/workflows/ci.yml/badge.svg)](https://github.com/Enjey-Kashlee/itelect4-project/actions/workflows/ci.yml)

A React and TypeScript tracker for items held by the campus lost and found office. Students browse reports and submit ownership claims. One office administrator adds items for selected student reporters and reviews the claims.

## Application links

- [Frontend](https://itelect4-project-mu.vercel.app)
- [Backend health](https://itelect4-backend-virid.vercel.app/api/health)
- [Backend repository](https://github.com/Enjey-Kashlee/itelect4-backend)

Deploy both repositories when their shared API changes. Local verification does not confirm which revision these URLs run.

## Local setup

Use Node.js 24. Install dependencies with `npm ci`. Copy `.env.example` to `.env.local` if one does not already exist and configure:

```dotenv
VITE_API_URL=http://localhost:4000
```

This value is the backend origin, without `/api` or a trailing slash. Vite embeds it at build time, so restart development or rebuild after changing it. Never put database credentials, admin passwords, JWT signing secrets or Gemini keys in frontend variables.

Start the sibling backend using its README, then run:

```sh
npm run dev
```

The backend must use transaction-capable MongoDB for claim submission and review. Account and item records are stored by the backend, not in a mock JSON database.

## Student workflow

1. Browse Items and open an item to inspect its details.
2. Register or log in to submit a claim. Login from item details returns a student to that item.
3. Enter ownership proof containing 10–1000 characters after trimming.
4. Open My Claims to see the outcome. An approved claim includes instructions to collect the item from the office.

**Lost** items accept claims. **Found** items do not. Approval marks the item Found and rejects its competing pending claims. Reviewed claims are final and cannot be edited or deleted. Approval reserves the item for pickup; the tracker does not record physical collection as completed.

Item cards show location and the reporting student's name without database IDs. The reporter is the student who handed the item in, not necessarily its owner. Missing records have explicit fallback labels.

## Administrator workflow

The single admin uses the normal login page and is taken to Manage Claims. Admin navigation is **Dashboard · Items · Manage Claims**, with logout and the theme toggle.

- **Items → Add item:** enter title, description and location, then choose the active registered student who handed it in. The server creates the item as Lost. Reporter emails are shown only in the admin selector.
- **Manage Claims:** switch between Pending, Approved and Rejected views. Review the claimant's proof and confirm approval or rejection. Approval also closes the item and rejects other pending claims.
- Failed submissions preserve entered values. Stale decisions refresh the queue instead of overwriting a newer result.

There is no public admin registration, default admin password or bundled provisioning command. The backend retains private provisioning logic for an owner-operated process. See the [backend README](https://github.com/Enjey-Kashlee/itelect4-backend#office-workflow) for account constraints and operations.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Welcome screen |
| `/items` | Public searchable item catalogue |
| `/items/:id` | Public details and student claim form for Lost items |
| `/register` and `/login` | Student registration and shared login |
| `/claims` | Authenticated user's own claims |
| `/review` | Authenticated AI feedback on an ownership description |
| `/admin/claims` | Admin-only claim review |
| `/admin/items/new` | Admin-only item entry |

Unknown routes show the not-found page. The interface supports mobile layouts and light/dark themes.

## Authentication and AI feedback

Private API requests use a bearer token. A 401 clears the session; a denied admin operation also clears stale admin state. Login/logout clears cached requests, and private query keys include the user ID. UI route guards control presentation; backend authorization controls access to data.

Passwords are never persisted. The token and user identity use the existing persistent-session store. New claims send only `itemId` and `proofDescription`; the backend supplies ownership, dates and status.

AI Claim Review accepts 20–2000 trimmed characters and returns advisory feedback. It never submits or approves a claim. The backend holds the Gemini key and calls the provider. The page explains that the description is sent to Google and asks students to omit sensitive information. Provider errors appear on the page; automatic retries are disabled.

## Checks

```sh
npm test
npm run lint
npm run build
npx tsc --noEmit
```

`npm test` runs the Node unit suite and the Vitest UI suite. Tests cover API requests, session handling, validation, hooks, item and claim cards, the student claim flow, admin routing, student-reporter selection, decision confirmation, error recovery and pickup instructions. Tests use mocks and a dummy API origin; they need no running backend or real accounts.

`npm run test:watch` watches the UI tests. GitHub Actions uses Node.js 24 and `npm ci`, then runs lint, both test suites and the TypeScript/Vite build. The frontend CI requires no repository secrets.

## Project layout

- `src/pages/`: student and administrator screens.
- `src/components/`: item/claim cards, route guards, layout and project-owned UI controls.
- `src/api/client.ts`: shared API requests, authorization headers and errors.
- `src/schemas/`: runtime form validation.
- `src/store/`: persisted authentication and UI settings.
- `src/App.tsx`: route declarations; `src/main.tsx`: router, query client and session cache cleanup.
- `tests/` and adjacent `*.test.tsx` files: unit and UI tests.

The frontend uses React Router, TanStack Query, Zustand, React Hook Form, Zod and Tailwind CSS. Build output, dependencies and real environment files are ignored.

## AI-use disclosure

OpenAI Codex assisted with implementation, test design, CI configuration, documentation and debugging. The author is responsible for reviewing, understanding and explaining the submitted code.
