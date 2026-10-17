# Repository Guidelines

## Structure and scope

Campus Lost & Found uses React, TypeScript, Vite, React Router, TanStack Query, Zustand, React Hook Form, Zod, Tailwind CSS, and project-owned shadcn controls.

`src/App.tsx` contains nested routes under `Layout`: `/`, `/items`, `/items/:id`, `/login`, `/register`, protected `/claims`, and a catch-all. `src/main.tsx` mounts BrowserRouter and QueryClientProvider and clears request/cache state when authentication changes. `src/api/client.ts` contains the single request helper and real backend calls. `src/store/authStore.ts` persists the server token and user under `itelect4-auth-v2`; never persist passwords. `src/schemas/claimSchema.ts` validates ObjectId strings, loaded-item membership, and 10–1000 characters of trimmed proof. `src/types/index.ts` defines domain types and course examples.

`LoginPage.tsx` renders login or registration mode depending on the route. Registration creates an account and then logs in. `ClaimsPage.tsx` lists only the authenticated student's claims and submits an item and proof. `DashboardPage.tsx` uses the authenticated user, without mock users. Administrator review is outside this task.

## Domain and API

Course maps to Item; Submission maps to Claim. `reportedById` identifies the item reporter; `claimantId` identifies the claim owner. IDs are strings. API timestamps are ISO strings and become Date values for display. Claims use `pending`, `approved`, and `rejected` status.

Item reads are public. Claim reads and writes require a Bearer token. The browser sends only `itemId` and `proofDescription` when creating claims; ownership, dates, and status come from the server. Server-side validation and ownership checks remain authoritative. A private 401 clears the session. Keep claims query keys scoped to the user and clear cached private data on session changes.

## Commands and verification

Use Node.js 24. Install with `npm ci`. Copy `.env.example` to ignored `.env.local` and set `VITE_API_URL` to the backend origin. Run the separate backend, then `npm run dev`. JSON Server and db.json are removed.

Run `npm test`, `npm run lint`, `npm run build`, and `npx tsc --noEmit`. Tests use Node's test runner. API tests supply Vite environment input using a Node module load hook. No coverage threshold is configured.

The existing lint error at `src/hooks/usePrevious.ts` (`react-hooks/refs`) predates GT4 integration. Keep it visible and fix it separately when requested; do not suppress the rule.

Browser checks should cover public items/detail, protected claims redirect, register/login, invalid proof, creating a claim, refresh persistence, logout, account isolation, direct route refreshes, and the catch-all. Use temporary local MongoDB for automated tests, never Atlas.

## UI and code conventions

Use two spaces, double quotes, semicolons, trailing commas, PascalCase components/types, and camelCase variables/hooks. Use type-only imports. Preserve existing project-owned shadcn files and prefer their Button, Input, and Label controls. Keep form labels, error messages, pending states, and dark-mode readability.

Import routing APIs from `react-router`, not `react-router-dom`. Keep the only BrowserRouter in `src/main.tsx` and route declarations in `src/App.tsx`. Use Link for internal links and useNavigate for actions. Keep `/claims` under ProtectedRoute and preserve the catch-all. The `@/*` alias maps to `src/*`.

## Configuration and Git

`VITE_API_URL` contains a backend origin without `/api` or a trailing slash. Vite embeds it at build time; rebuild after changes. Never put database credentials or JWT signing secrets in frontend variables. Commit `.env.example`, never real environment files. `vercel.json` provides the SPA route fallback.

Work on `gt4-part2`. Use concise imperative commit subjects with prefixes such as feat: or docs:. Ask the user before every push, including tags. PRs describe behavior, validation, screenshots, and configuration changes. Merge both project PRs and pass live checks before tagging `gt4` and submitting both repository and live URLs. The user will perform deployment and account-specific settings.
