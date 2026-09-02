# Repository Guidelines

## Project Structure & Module Organization

Campus Lost & Found is a small React + TypeScript app built with Vite and Tailwind CSS.

- `src/main.tsx` is the entry point. It mounts the app inside `StrictMode` and `BrowserRouter`.
- `src/App.tsx` contains the route table only. The current routes are `/` for the dashboard, `/items` for the item list, `/items/:id` for item details, `/login` for demo login, `/claims` for the protected claims page, and `*` for the not-found page.
- `src/pages/` contains screen-level components. `DashboardPage.tsx` owns dashboard user/claim state; `ItemsPage.tsx` owns item loading, search, filtering, and links; `ItemDetailPage.tsx` reads an item ID from the URL; `LoginPage.tsx` owns the name-based demo login form; `ClaimsPage.tsx` renders the mock claims list; `NotFoundPage.tsx` handles unknown URLs.
- `src/data/mockData.ts` is the shared source for the sample student, lost/found items, and claims used by pages. `itemLookup.ts` contains the typed URL-ID lookup helper.
- `src/components/` contains the shared `Layout`, the `ProtectedRoute` auth boundary, the pure `protectedRouteDecision` helper, and presentational `UserCard`, `ItemCard`, and `ClaimBadge` components. Keep each component’s `*Props` interface co-located.
- `src/hooks/` contains one default-exported custom hook per file.
- `src/store/authStore.ts` contains the typed Zustand auth store used by the shared layout.
- `src/types/index.ts` is the source of truth for `User`, `Item`, `Claim`, and shared TypeScript types.
- `src/assets/` and `public/` hold bundled and static assets.
- `tests/protectedRouteDecision.test.ts` contains focused tests for the protected-route redirect decision.

## Routing Conventions

- This project uses the `react-router` package. Import `BrowserRouter`, `Routes`, `Route`, and `Link` from `react-router`; do not add `react-router-dom` for browser routing.
- Keep the single `BrowserRouter` wrapper in `src/main.tsx` and keep route declarations in `src/App.tsx`.
- Put screen UI in `src/pages/` and use `Link` for internal navigation instead of plain anchors that reload the app. Use `useNavigate` for navigation triggered by event handlers such as Back buttons.
- Use typed `useParams<{ id: string }>()` for item detail URLs and compare the string parameter with `String(item.id)`.
- Keep child routes nested under `Layout` so the navigation bar, theme toggle, and `<Outlet />` wrap every page.
- Keep `/claims` nested under `ProtectedRoute`; unauthenticated users should be redirected to `/login`, while authenticated users should render the protected page through `<Outlet />`.
- Keep the demo login flow in `LoginPage.tsx`: reject a blank trimmed name, call the auth store's `login` action, and navigate to `/claims`. The shared layout owns the Login/Logout navigation controls.
- Preserve the `*` catch-all route so unknown URLs render `NotFoundPage` with a way back to `/`.

## Build, Test, and Development Commands

Run `npm install` after cloning. Use `npm run dev` for Vite with HMR, `npm run build` for `tsc -b` plus a production Vite build, `npm run lint` for ESLint, `npm test` for the Node built-in protected-route tests, and `npm run preview` to serve the production build locally. Use `npx tsc --noEmit` for a type-only check.

## Coding Style & Naming Conventions

Use two-space indentation, semicolons, double quotes, and trailing commas, matching the existing TypeScript. Name components and types in PascalCase; name variables, handlers, and hooks in camelCase (`usePrevious.ts`). Use `import type` for type-only imports. There are no path aliases or Prettier configuration; prefer Tailwind utility classes for UI styling.

## Testing Guidelines

The project uses Node's built-in test runner through the `npm test` script; there is no coverage threshold. For every change, run `npm run lint`, `npm run build`, `npx tsc --noEmit`, and `npm test`; manually smoke-test `npm run dev` for UI changes. For routing changes, verify that `/` renders the dashboard, `/items` renders the searchable item list, `/items/101` renders an item detail page, `/items/999` shows the invalid-ID message, `/claims` redirects to `/login` while logged out, a non-empty login reaches `/claims`, logout returns to `/login`, and an unknown path such as `/does-not-exist` renders the 404 page and its link back to the dashboard.

At present, `npm run lint` may report the existing React hooks `refs` violation at `src/hooks/usePrevious.ts:12` (`return ref.current`). Treat that as a baseline issue while working on routing, verify that new changes do not add lint errors, and fix the hook separately when requested.

## Domain Notes

Translate course exercise terms into this project’s domain: `Course` becomes `Item`, `Submission` becomes `Claim`, and `CourseCard` becomes `ItemCard`. Preserve Campus Lost & Found sample content and extend the existing model instead of creating parallel types. Treat the current repository structure and domain names as authoritative when adapting coursework instructions.

## Commit & Pull Request Guidelines

Recent commits use short imperative summaries, with prefixes such as `feat:` and `chore:` (for example, `feat: initialize React app`). Use `type: concise imperative summary` where useful. PRs should explain behavior and rationale, link a related issue or course task, list validation commands, include screenshots for UI changes, and call out follow-up work.
