# itelect4-project — Campus Lost & Found

A small React + TypeScript app for reporting and claiming lost/found items on campus. Built as a GT1 exercise in TypeScript fundamentals: interfaces, type aliases, unions, intersections, generics, utility types, and enums, applied to a real UI.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for dev server and bundling
- [ESLint](https://eslint.org/) with `typescript-eslint`

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Scripts

| Command           | Description                                     |
| ------------------ | ------------------------------------------------ |
| `npm run dev`      | Start the Vite dev server with HMR               |
| `npm run build`    | Type-check (`tsc -b`) and build for production   |
| `npm run lint`     | Run ESLint over the project                      |
| `npm run preview`  | Preview the production build locally             |

## Project structure

```
src/
├── App.tsx                # Renders sample User/Item/Claim data through the cards below
├── components/
│   ├── UserCard.tsx        # Displays a User; typed onClick + onChange handlers
│   ├── ItemCard.tsx        # Displays a lost/found Item
│   └── ClaimBadge.tsx      # Displays a Claim and its verification status
├── types/
│   └── index.ts             # Domain types: interfaces, aliases, unions, generics, enums
└── main.tsx                # App entry point
```

## Domain model

Defined in [`src/types/index.ts`](src/types/index.ts):

- **`User`** — a student or security admin account.
- **`Item`** — a lost or found item report (`status: "lost" | "found"`).
- **`Claim`** — a claim filed against an item, pending admin verification.
- **`ApiResponse<T>`** — generic wrapper for API responses, reusable across any data type.
- Utility types (`UserUpdate`, `UserPreview`, `PublicUser`, `RoleCount`) derived from `User` via `Partial`, `Pick`, `Omit`, and `Record`.
- **`ClaimStatus`** / **`Role`** — a regular enum and a `const enum` for claim state and account role.

Each component in `src/components/` declares its own `Props` interface and consumes one of these domain types directly, so the UI stays in sync with the type definitions.

## Type-checking

The project must build with zero TypeScript errors:

```bash
npx tsc --noEmit
```
