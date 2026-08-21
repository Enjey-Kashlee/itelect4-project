# itelect4-project — Campus Lost & Found

A small React + TypeScript app for reporting and claiming lost/found items on campus. Built as a GT1 exercise in TypeScript fundamentals: interfaces, type aliases, unions, intersections, generics, utility types, and enums, applied to a real UI.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for dev server and bundling
- [React Router](https://reactrouter.com/) for client-side routes and URL parameters
- [Zustand](https://zustand.docs.pmnd.rs/) for typed shared authentication state
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling and dark mode
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
├── App.tsx                # Declares the nested application routes
├── components/
│   ├── Layout.tsx         # Shared navigation, auth controls, theme toggle, and Outlet
│   ├── UserCard.tsx        # Displays a User; typed onClick + onChange handlers
│   ├── ItemCard.tsx        # Displays a lost/found Item
│   └── ClaimBadge.tsx      # Displays a Claim and its verification status
├── data/
│   ├── itemLookup.ts       # Finds an Item from a string URL ID
│   └── mockData.ts         # Sample users, items, and claims
├── hooks/
│   ├── usePrevious.ts      # Remembers the previous value of a state variable
│   └── useToggle.ts        # Reusable boolean state helper
├── pages/
│   ├── DashboardPage.tsx   # Dashboard user and claim content
│   ├── ItemsPage.tsx       # Searchable item list with detail links
│   ├── ItemDetailPage.tsx  # Detail view for /items/:id
│   └── NotFoundPage.tsx    # Catch-all 404 screen
├── store/
│   └── authStore.ts        # Typed Zustand auth state and actions
├── types/
│   └── index.ts             # Domain types: interfaces, aliases, unions, generics, enums
└── main.tsx                # App entry point
```

## Routes

- `/` — dashboard content inside the shared layout.
- `/items` — searchable and filterable lost/found item list.
- `/items/:id` — detail page that reads the item ID from the URL.
- `*` — not-found page with a link back to the dashboard.

Item cards use `Link` for client-side navigation. The detail page uses typed `useParams` to read the URL ID and `useNavigate` for its Back button. The shared `Layout` remains mounted around all child routes.

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
