# GT4 Part 2: deployment and submission

The code is prepared locally on `gt4-part2` in both repositories. Nothing has been pushed. Ask Codex to push only when you are ready; Codex must ask before any push. Account setup, Atlas network changes, Vercel deployments, live checks, PR merges, and course submission remain for you.

## 1. Publish the reviewed branches

After the local work is reviewed, authorize a push of `gt4-part2` for both repositories. Create a PR from `gt4-part2` to `main` in each repository. The backend branch includes earlier backend work that has not yet reached `main`; review the full PR diff. Do not discard those earlier commits.

Merge both PRs when checks pass. Vercel normally deploys `main` as Production. If you import before merging, explicitly select the intended branch rather than deploying stale `main` code. The pre-existing frontend lint issue is documented in README; build and tests must pass.

## 2. Prepare Atlas

Use your existing database and database user. Confirm the URI includes the intended database name. If you have not seeded items, run `npm run seed:items` in the backend using that database's local `.env`; it inserts sample items without overwriting existing ones.

In Atlas, open your project's Network Access/IP Access List. The lecture uses `0.0.0.0/0` for Vercel's changing outbound IPs. This permits connection attempts from any IP; database authentication still applies. Make this access change yourself and keep the database credentials private. Do not paste the URI into chat, Git, or frontend settings.

## 3. Deploy the backend

1. Sign in to Vercel with GitHub. Import `Enjey-Kashlee/itelect4-backend` as a separate project.
2. Use the Express framework preset and Node.js 24. Keep the project root at the repository root. Leave framework defaults for build/output settings; do not set `dist` as a static output directory. The platform loads the default Express export in `src/app.ts`.
3. Add these environment variables to the environments you deploy (Production, and Preview if used):

| Variable      | Value                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------- |
| `MONGODB_URI` | Your private Atlas URI, including the database name                                               |
| `JWT_SECRET`  | A private random secret of at least 32 characters; keep the existing value if preserving sessions |
| `CORS_ORIGIN` | Initially `http://localhost:5173`                                                                 |

`PORT` is for local startup; the hosted Express export does not open its own listener. Never expose `JWT_SECRET` or `MONGODB_URI` as `VITE_` variables.

4. Deploy. Save the stable production origin, such as `https://your-backend.vercel.app`.
5. Open `<backend-origin>/api/health`. Expect HTTP 200 and `{ "ok": true, "db": true }`.
6. Open `<backend-origin>/api/items`. Expect the seeded item array without signing in. If the API reports an error, check the deployment logs and Atlas credentials/network access.

## 4. Deploy the frontend

1. Import `Enjey-Kashlee/itelect4-project` as another Vercel project.
2. Use the Vite preset, Node.js 24, build command `npm run build`, and output directory `dist`.
3. Set `VITE_API_URL` to the backend production origin. No trailing slash, `/api`, or route suffix. Add it to Production and Preview if both are used.
4. Deploy and save the stable frontend production origin. The committed `vercel.json` makes direct route visits and refreshes serve the React app.
5. Return to the **backend** Vercel project's environment settings. Set `CORS_ORIGIN` to the exact frontend production origin with no trailing slash. To allow local development too, use a comma-separated list: `https://your-frontend.vercel.app,http://localhost:5173`.
6. Redeploy the backend to apply the changed value. Changing a frontend variable also requires a new frontend build/deployment.

If deployment protection blocks a frontend-to-backend request, review the backend project's protection settings so the public production API is reachable. Use the stable production domain rather than an unrelated preview URL.

## 5. Verify the live application

Use a private/incognito window:

- Visit `/items` while logged out; open one item detail page.
- Visit `/claims`; it should redirect to `/login`.
- Visit `/register`; create your own test account. You should land on `/claims` with an empty list.
- Choose an item and enter 10–1000 characters of identifying proof. Submit, refresh, and confirm the claim remains pending.
- In browser DevTools Network, confirm the claim request goes to the deployed backend `/api/claims` and carries a Bearer header. Do not copy or share its token.
- Log out and confirm claims are protected. Log in again and confirm your claim is still present.
- Create a second account and confirm it cannot see the first account's claims.
- Directly open and refresh `/items/<real-item-id>`, `/login`, `/register`, and `/claims`; confirm the route fallback works. Check an unknown URL shows the app's 404 page.
- Check the browser console for unexpected errors.

Tokens expire after two hours. A private API response of 401 signs the user out; log in again.

## 6. Final submission

Confirm both PRs are merged and both production deployments use the merged code. Tag `gt4` on both merged repositories only after the live checks pass. Authorize any tag push separately, or push it yourself.

Submit four links: the backend repository, the frontend repository, the backend live URL, and the frontend live URL. Keep both deployments running for the next session.

Before publishing, inspect `git log --all -- .env .env.local` in each repo: no secret files should appear. `.env.example` is safe to commit; actual `.env` files are ignored. If a real secret was ever committed, deleting the file alone is insufficient; rotate it and clean the history before publishing.

References: [Express on Vercel](https://vercel.com/docs/frameworks/backend/express), [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite), [Vite environment variables](https://vite.dev/guide/env-and-mode), and the Session 10 handout.
