# Repository Guidelines

## Structure and scope

Campus Lost & Found uses React, TypeScript, Vite, React Router, TanStack Query, Zustand, React Hook Form, Zod, Tailwind CSS, and project-owned shadcn controls.

`src/App.tsx` contains nested routes under `Layout`: `/`, `/items`, `/items/:id`, `/login`, `/register`, protected `/claims`, and a catch-all. `src/main.tsx` mounts BrowserRouter and QueryClientProvider and clears request/cache state when authentication changes. `src/api/client.ts` contains the single request helper and real backend calls. `src/store/authStore.ts` persists the server token and user under `itelect4-auth-v2`; never persist passwords. `src/schemas/claimSchema.ts` validates ObjectId strings, loaded-item membership, and 10–1000 characters of trimmed proof. `src/types/index.ts` defines domain types and course examples.

`LoginPage.tsx` renders login or registration mode depending on the route. Registration creates an account and then logs in. Login and registration return to the selected item when entered from its detail page. `ClaimsPage.tsx` lists only the authenticated student's claims. `ItemDetailPage.tsx` renders `ItemClaimForm` for signed-in students; it submits the selected lost item and proof, then opens My Claims. Found items show a non-claimable notice. Claim cards use item names and locations from the claim API response and preserve records whose item is missing. `DashboardPage.tsx` uses the authenticated user, without mock users. Admin login opens `/admin/claims`; `AdminRoute` protects that page and `/admin/items/new`. Admin navigation replaces Claims/AI Claim Review with Manage Claims. Admin item entry selects a registered active student as reporter; server-owned initial status is Lost.

## Domain and API

Course maps to Item; Submission maps to Claim. `reportedById` identifies the item reporter; the public item response includes `reportedBy: { id, name }` or `null`, and cards display the name. `claimantId` identifies the claim owner. IDs are strings. API timestamps are ISO strings and become Date values for display. Claims use `pending`, `approved`, and `rejected` status.

Item reads are public. Claim reads and writes require a Bearer token. The browser sends only `itemId` and `proofDescription` when creating claims; ownership, dates, and status come from the server. Server-side validation and ownership checks remain authoritative. A private 401 clears the session; a 403 on an admin operation also removes a stale admin session. Keep admin query keys scoped to the user. Decisions are final, and student-approved claims show office pickup instructions without implying physical collection. Keep claims query keys scoped to the user and clear cached private data on session changes.

## Commands and verification

Use Node.js 24. Install with `npm ci`. Copy `.env.example` to ignored `.env.local` and set `VITE_API_URL` to the backend origin. Run the separate backend, then `npm run dev`. JSON Server and db.json are removed.

Run `npm test`, `npm run lint`, `npm run build`, and `npx tsc --noEmit`. `npm test` runs the existing Node suite in `tests/`, then Vitest tests beside source files. Vitest uses jsdom, cleanup, restored spies, and a dummy VITE_API_URL from vite.config.ts. Existing Node API tests supply Vite environment input using a module load hook. No coverage threshold is configured.

The `usePrevious` hook remembers the last distinct value and has regression tests. Do not suppress lint rules.

Browser checks should cover public items/detail, protected claims redirect, register/login, invalid proof, creating a claim, refresh persistence, logout, account isolation, direct route refreshes, and the catch-all. Use temporary local MongoDB for automated tests, never Atlas.

## UI and code conventions

Use two spaces, double quotes, semicolons, trailing commas, PascalCase components/types, and camelCase variables/hooks. Use type-only imports. Preserve existing project-owned shadcn files and prefer their Button, Input, and Label controls. Keep form labels, error messages, pending states, and dark-mode readability.

Import routing APIs from `react-router`, not `react-router-dom`. Keep the only BrowserRouter in `src/main.tsx` and route declarations in `src/App.tsx`. Use Link for internal links and useNavigate for actions. Keep `/claims` under ProtectedRoute and preserve the catch-all. The `@/*` alias maps to `src/*`.

## Configuration and Git

`VITE_API_URL` contains a backend origin without `/api` or a trailing slash. Vite embeds it at build time; rebuild after changes. Never put database credentials or JWT signing secrets in frontend variables. Commit `.env.example`, never real environment files. `vercel.json` provides the SPA route fallback.

Use short-lived `codex/` feature branches from main for new work. Use concise imperative commit subjects with prefixes such as feat:, fix:, docs: or chore:. Keep tests with feature changes and keep dependency updates separate. Ask the user before every push, including tags. PRs describe behavior, validation, screenshots, and configuration/API changes. Deployment and release tags require separate authorization.
