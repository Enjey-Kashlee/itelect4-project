# itelect4-project — Campus Lost & Found

A small React + TypeScript admin-facing tracker for campus lost-and-found items and student claims. The administrator reviews item reports and records claim requests in the app; the current demo uses one default mock student.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for dev server and bundling
- [React Router](https://reactrouter.com/) for client-side routes and URL parameters
- [TanStack Query](https://tanstack.com/query/latest) for API queries, mutations, and cache invalidation
- [Zustand](https://zustand.docs.pmnd.rs/) for typed shared authentication state
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) for claim-form state and runtime validation
- [shadcn/ui](https://ui.shadcn.com/) generated, project-owned `Button`, `Input`, and `Label` components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling and dark mode
- [JSON Server](https://github.com/typicode/json-server) for the local items and claims API
- [ESLint](https://eslint.org/) with `typescript-eslint`

## Getting started

```bash
npm install
```

Start the local API in one terminal:

```bash
npm run api
```

In a second terminal, start the frontend:

```bash
npm run dev
```

The app runs at `http://localhost:5173` and the local API runs at `http://localhost:3001`.

## Scripts

| Command           | Description                                     |
| ------------------ | ------------------------------------------------ |
| `npm run dev`      | Start the Vite dev server with HMR                    |
| `npm run api`      | Start JSON Server on port 3001                        |
| `npm run build`    | Type-check (`tsc -b`) and build for production        |
| `npm run lint`     | Run ESLint over the project                           |
| `npm run preview`  | Preview the production build locally                  |
| `npm test`         | Run the Node test suite                                |

## Project structure

```
src/
├── App.tsx                # Declares the nested application routes
├── api/
│   └── client.ts          # Typed JSON Server fetch and mutation functions
├── components/
│   ├── Layout.tsx         # Shared navigation, auth controls, theme toggle, and Outlet
│   ├── ProtectedRoute.tsx  # Redirects unauthenticated users from protected routes
│   ├── protectedRouteDecision.ts # Pure protected-route redirect decision
│   ├── UserCard.tsx        # Displays a User; typed onClick + onChange handlers
│   ├── ItemCard.tsx        # Displays a lost/found Item
│   ├── ClaimBadge.tsx      # Displays a Claim and its verification status
│   └── ui/                 # Project-owned shadcn Button, Input, and Label
├── data/
│   ├── itemLookup.ts       # Finds an Item from a string URL ID
│   └── mockData.ts         # Default mock student used by the demo
├── lib/
│   └── utils.ts            # Shared class-name utility used by shadcn components
├── schemas/
│   └── claimSchema.ts      # Claim field rules and existing-item validation
├── hooks/
│   ├── usePrevious.ts      # Remembers the previous value of a state variable
│   └── useToggle.ts        # Reusable boolean state helper
├── pages/
│   ├── DashboardPage.tsx   # Dashboard user content
│   ├── ItemsPage.tsx       # Searchable item list with detail links
│   ├── ItemDetailPage.tsx  # Detail view for /items/:id
│   ├── LoginPage.tsx       # Name-based demo login form
│   ├── ClaimsPage.tsx      # Admin-facing claims list and record form
│   └── NotFoundPage.tsx    # Catch-all 404 screen
├── store/
│   ├── authStore.ts        # Typed Zustand auth state and actions
│   └── uiStore.ts          # Search and dark-mode UI state
├── types/
│   └── index.ts             # Domain types: interfaces, aliases, unions, generics, enums
└── main.tsx                # App entry point

tests/
├── apiClient.test.ts              # API client behavior
├── authStore.test.ts              # Demo auth behavior
├── claimSchema.test.ts            # Claim validation behavior
├── protectedRouteDecision.test.ts  # Protected-route decision tests
└── uiStore.test.ts                # UI store behavior
```

## Routes

- `/` — dashboard content inside the shared layout.
- `/items` — searchable and filterable lost/found item list.
- `/items/:id` — detail page that reads the item ID from the URL.
- `/login` — name-based demo login page.
- `/claims` — authenticated admin-facing claims page protected by the auth store.
- `*` — not-found page with a link back to the dashboard.

Item cards use `Link` for client-side navigation. The detail page uses typed `useParams` to read the URL ID and `useNavigate` for its Back button. The shared `Layout` remains mounted around all child routes.

## Admin workflow

The current scope is an administrator’s tracker. The administrator uses the Items page to review item records and the Claims page to record a student’s claim request. The claim form currently defaults every new record to the mock student in [`src/data/mockData.ts`](src/data/mockData.ts).

New claims start with `verified: false`; they represent requests that still need an administrative decision. The current UI displays verification status but does not yet provide separate approve or reject actions.

`reportedById` on an item identifies who reported the item, while `claimantId` on a claim identifies the student associated with the claim. They represent different relationships.

## Demo authentication

Authentication is intentionally local demo authentication. The login page accepts a non-empty name, stores a demo token and user name in the typed Zustand auth store, and navigates to `/claims`. `ProtectedRoute` reads the token and redirects unauthenticated users to `/login`; authenticated users render the nested claims route through `Outlet`. The shared layout exposes Login and Logout controls, and logging out clears the store.

The login name is not currently connected to different student records or a role-based permission system. It acts as a demo access gate for the admin-facing UI and does not provide real account security.

## Claim form validation

[`src/schemas/claimSchema.ts`](src/schemas/claimSchema.ts) validates the claim form at runtime. It checks that the item ID is numeric, a whole number, and positive. `createClaimSchema(existingItemIds)` adds a data-dependent `.refine()` rule requiring the ID to exist in the items loaded from the API.

`ClaimsPage` loads the items with TanStack Query, converts their IDs to numbers, and gives those IDs to the schema factory. An unknown ID displays an error and stops React Hook Form before `createClaim` sends a claim request. The API should repeat this relationship check in a production backend; the local JSON Server does not enforce it itself.

## Shared UI components

The shadcn CLI generated project-owned components in `src/components/ui/`. `ClaimsPage` and `LoginPage` use the shared `Button`, `Input`, and `Label` components. `components.json` records the shadcn configuration, and `src/lib/utils.ts` provides the shared class-name helper. The shared `Input` includes the theme-aware `text-foreground` class so typed values remain readable in dark mode.

## Domain model

Defined in [`src/types/index.ts`](src/types/index.ts):

- **`User`** — a student or security admin account.
- **`Item`** — a lost or found item report (`status: "lost" | "found"`).
- **`Claim`** — a claim filed against an item, pending admin verification.
- **`ApiResponse<T>`** — generic wrapper for API responses, reusable across any data type.
- Utility types (`UserUpdate`, `UserPreview`, `PublicUser`, `RoleCount`) derived from `User` via `Partial`, `Pick`, `Omit`, and `Record`.
- **`ClaimStatus`** / **`Role`** — a regular enum and a `const enum` for claim state and account role.

Each component in `src/components/` declares its own `Props` interface and consumes one of these domain types directly, so the UI stays in sync with the type definitions. The current sample data uses one mock student; the API records in `db.json` provide the item and claim collections.

## Type-checking

The project must build with zero TypeScript errors:

```bash
npx tsc --noEmit
```
