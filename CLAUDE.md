# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Campus Lost & Found — a small React + TypeScript app built as a GT (guided tutorial) exercise for an ITELECT4 course. It started as a TypeScript-fundamentals exercise (interfaces, type aliases, unions, intersections, generics, utility types, enums) and has since progressed into a React-hooks exercise (`useState`, `useEffect`, `useRef`, custom hooks) — still no backend, routing, or dedicated state library; `App.tsx` is the single stateful component.

## Commands

```bash
npm install        # install dependencies
npm run dev         # start Vite dev server with HMR at http://localhost:5173
npm run build        # type-check via `tsc -b`, then production build via Vite
npm run lint         # run ESLint over the project
npm run preview       # preview the production build locally
npx tsc --noEmit       # type-check only, no build output — the project must pass this with zero errors
```

There is no test runner configured in this project (no test script, no test files).

## Slide/GT terminology mapping

Course slides and exercise handouts use a generic `User` / `Course` / `Submission` domain (a student-enrollment example), but this project's actual domain is Campus Lost & Found. When implementing an exercise from a slide, translate terms before writing code — do not introduce new `Course` or `Submission` types:

| Slide term   | This project's type |
| ------------ | -------------------- |
| `User`       | `User` (same)         |
| `Course`     | `Item`                |
| `Submission` | `Claim`                |

Apply the same translation to variable/state names (e.g. a slide's `courses` state becomes `items`, `setCourses` becomes `setItems`), not just type names. If a slide's snippet doesn't map cleanly to the existing fields on `Item`/`Claim`, flag the mismatch rather than silently inventing a new field or type.

**Concrete `Course` → `Item` field mapping** (established when a slide's `Course` had `code`/`title`/`units`/`semester`, which don't correspond to `Item`'s real fields — flagged and resolved by reusing `Item`'s existing slots instead of adding a new type):

| Slide `Course` field | `Item` field    | Note |
| --------------------- | ---------------- | ----- |
| `code`                | `id`               | `Item.id` is typed `ID` (`number \| string`) specifically to allow this |
| `title`               | `title`            | direct match |
| `units`                | `description`      | folded in, e.g. `"3 units"` |
| `semester`             | `location`         | repurposed, not a literal match |
| *(none)*               | `status`           | no course equivalent — set to a placeholder (`"found"`) since it's a required literal field |
| *(implicit)*           | `reportedById`      | set to the enrolled student's `User.id` |

`CourseCard` → reuse `ItemCard` (no new component). This mapping intentionally trades semantic accuracy for reusing the existing domain model — apply the same table if a future slide's `Course` data reappears.

**Mechanics vs. sample content**: a slide's *hooks/state/handler code* (the mechanics — `useState`, `useEffect`, custom hooks, event typing, etc.) should be followed faithfully regardless of domain. Its *literal sample values* (e.g. `"IT Elective 4"`, `"3 units"`) should not be — swap those for plausible lost-and-found content (an item title/description/status/location that would make sense to someone actually using this app), even while the underlying field types/mapping stay as documented above. The app's rendered output should always read as Campus Lost & Found, never as leftover course data.

## Architecture

- `src/types/index.ts` is the single source of truth for the domain model and doubles as an annotated reference of TypeScript features (each section is commented with `===== SECTION =====` headers explaining the concept). New GT exercises are expected to extend this file rather than fork it elsewhere.
  - `User`, `Item`, `Claim` — core interfaces. `Item.status` is `"lost" | "found"`; `Claim.verified` is optional until a security admin acts on it.
  - `ApiResponse<T>` — generic wrapper intended for reuse by any future data-fetching code.
  - `UserUpdate`, `UserPreview`, `PublicUser`, `RoleCount` — utility types derived from `User` via `Partial`, `Pick`, `Omit`, `Record`, showing the idiomatic way to derive rather than redeclare shapes.
  - `ClaimStatus` (regular enum) vs `Role` (`const enum`) — intentionally uses both enum flavors side by side to contrast runtime vs. compile-time-only behavior.
- `src/components/` — one presentational component per domain type (`UserCard`, `ItemCard`, `ClaimBadge`), each declaring its own local `Props` interface and importing the corresponding type from `src/types/index.ts` with `import type`. Follow this pattern for new components: co-locate a `*Props` interface, type-only import domain types, no shared prop-types file. `ClaimBadge` exists but is currently unused by `App.tsx` (no slide has exercised `Claim`/`Submission` yet).
- `src/hooks/` — custom hooks (`useToggle`, `usePrevious`), each a single default-exported function, generic where useful (`usePrevious<T>`). Follow this pattern for new hooks: one file per hook, default export, explicit return type.
- `src/App.tsx` — the app's one stateful component. Owns all `useState`/`useEffect`/`useRef` and the custom hooks; fetches (mocked via `setTimeout`) and filters `Item[]` data, tracks `selectedUser` from `UserCard`, and renders `ItemCard` per filtered item. This is the manual "integration point" to update when adding a new component, hook, or domain type to the demo.
- Path aliases: none configured — imports are relative (`../types/index`, `./components/...`, `./hooks/...`).

## TypeScript/tooling notes

- `verbatimModuleSyntax` is enabled in `tsconfig.app.json`, so type-only imports/exports must use `import type` / `export type` explicitly (already the convention in every component).
- `noUnusedLocals` and `noUnusedParameters` are enabled — unused function params (e.g. unused event args in handlers) will fail the build; prefix intentionally-unused params with `_` or omit them.
- `erasableSyntaxOnly` is set, which disallows TS syntax that requires runtime transformation (e.g. parameter properties, non-const enums with certain patterns) — keep this in mind before adding new enums or class-based code.
- ESLint config (`eslint.config.js`) is flat-config based: `@eslint/js` recommended + `typescript-eslint` recommended + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` (Vite variant). No Prettier is configured.
