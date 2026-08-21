# Repository Guidelines

## Project Structure & Module Organization

Campus Lost & Found is a small React + TypeScript app built with Vite and Tailwind CSS.

- `src/main.tsx` mounts the app; `src/App.tsx` owns demo state, effects, filtering, and integration.
- `src/components/` contains presentational `UserCard`, `ItemCard`, and `ClaimBadge` components. Keep each component’s `*Props` interface co-located.
- `src/hooks/` contains one default-exported custom hook per file.
- `src/types/index.ts` is the source of truth for `User`, `Item`, `Claim`, and shared TypeScript types.
- `src/assets/` and `public/` hold bundled and static assets.

## Build, Test, and Development Commands

Run `npm install` after cloning. Use `npm run dev` for Vite with HMR, `npm run build` for `tsc -b` plus a production Vite build, `npm run lint` for ESLint, and `npm run preview` to serve the production build locally. Use `npx tsc --noEmit` for a type-only check.

## Coding Style & Naming Conventions

Use two-space indentation, semicolons, double quotes, and trailing commas, matching the existing TypeScript. Name components and types in PascalCase; name variables, handlers, and hooks in camelCase (`usePrevious.ts`). Use `import type` for type-only imports. There are no path aliases or Prettier configuration; prefer Tailwind utility classes for UI styling.

## Testing Guidelines

No test runner or test files are configured, so there is no coverage threshold. For every change, run `npm run lint`, `npm run build`, and `npx tsc --noEmit`; manually smoke-test `npm run dev` for UI changes. If adding tests, document the chosen framework and script in the same change.

## Domain Notes

Translate course exercise terms into this project’s domain: `Course` becomes `Item`, `Submission` becomes `Claim`, and `CourseCard` becomes `ItemCard`. Preserve Campus Lost & Found sample content and extend the existing model instead of creating parallel types.

## Commit & Pull Request Guidelines

Recent commits use short imperative summaries, with prefixes such as `feat:` and `chore:` (for example, `feat: initialize React app`). Use `type: concise imperative summary` where useful. PRs should explain behavior and rationale, link a related issue or course task, list validation commands, include screenshots for UI changes, and call out follow-up work.
