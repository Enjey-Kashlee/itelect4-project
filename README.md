# Campus Lost & Found

Campus Lost & Found connects a React/TypeScript frontend to an Express/MongoDB backend. Visitors browse public items. Students register, log in, and submit their own claims with proof of ownership. The server assigns ownership, dates, and pending status; administrator review is outside this task.

## Live application

- Frontend: [https://itelect4-project-mu.vercel.app](https://itelect4-project-mu.vercel.app)
- Backend API: [https://itelect4-backend-virid.vercel.app](https://itelect4-backend-virid.vercel.app)
- API checks: [Health](https://itelect4-backend-virid.vercel.app/api/health) · [Items](https://itelect4-backend-virid.vercel.app/api/items)

## Run locally

Use Node.js 24 and `npm ci`. Copy `.env.example` to `.env.local` and set `VITE_API_URL` to the backend origin, normally `http://localhost:4000`. Start and seed the sibling backend using its README, then run `npm run dev` here. Restart Vite after changing environment values.

`VITE_API_URL` contains only the origin: no `/api` and no trailing slash. Vite embeds it during build. Never put MongoDB credentials or JWT signing secrets in frontend environment variables.

## Behavior

- `/` shows a welcome screen and account links.
- `/items` and `/items/:id` read the public catalogue.
- `/register` creates an account, then logs in through the API.
- `/login` accepts email/password and stores the returned token and user.
- `/claims` requires a session, shows only the current student's claims, and accepts an item plus proof (10–1000 characters after trimming).
- `/review` requires a session and reviews an ownership description through the backend's `POST /api/ai`. The validated form accepts 20–2000 trimmed characters and displays summary, useful details, improvements, and description readiness. This is advisory feedback; it never approves or submits a claim.
- Unknown routes show the existing not-found screen.

The API client sends `Authorization: Bearer <token>` on private requests. A 401 clears the session. Session changes cancel requests and clear cached data; claim query keys also include the user ID. Passwords are never persisted. JWTs remain in browser storage for the course's persistent-session flow, so protecting against injected scripts remains important. Server authorization is the security boundary.

Item and user IDs are strings, API timestamps are ISO strings, and claims use `pending`, `approved`, or `rejected` status. The client supplies only `itemId` and `proofDescription` when creating a claim.

The Gemini key stays in the backend `.env` and backend Vercel settings. The browser never calls Gemini directly. The review page explains that the submitted description is sent to Google and asks students to omit sensitive information. API quota and provider errors are shown on the page; automatic retries are disabled. See the sibling backend's `docs/gt5-ai.md` for local simulation checks and the remaining GT5 deployment, PR, tag, and submission steps.

## Checks

```sh
npm test
npm run lint
npm run build
npx tsc --noEmit
```

The existing lint failure at `src/hooks/usePrevious.ts` (`react-hooks/refs`) predates this integration and remains a separate issue. Unit tests cover API routes, authorization headers, error handling, persisted auth, claim validation, route decisions, and UI settings.

## Stack

React, Vite, TypeScript, React Router, TanStack Query, Zustand, React Hook Form, Zod, Tailwind CSS, and project-owned shadcn controls.
