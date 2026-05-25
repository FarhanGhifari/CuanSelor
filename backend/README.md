# CuanSelor Backend

Express API for CuanSelor financial planning workflows. The backend owns:

- Better Auth authentication at `/api/auth/*`
- Session-based authorization middleware for protected API routes
- Supabase PostgreSQL access for app data
- Financial onboarding, profile, and retirement projection routes

## Setup

1. Copy `.env.example` to `.env`.
2. Fill `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`, and `BETTER_AUTH_SECRET`.
3. Install backend dependencies:

```bash
npm install --prefix backend
```

4. Apply Better Auth migrations against Supabase:

```bash
cd backend
npx auth@latest migrate --config ./src/config/auth.js --yes
```

5. Apply `../supabase_schema.sql` for the app tables.
6. Start the server:

```bash
npm run dev --prefix backend
```

## Auth Endpoints

Better Auth is mounted directly in Express:

- `POST /api/auth/sign-up/email`
- `POST /api/auth/sign-in/email`
- `POST /api/auth/sign-out`
- `GET /api/auth/get-session`

Compatibility endpoint:

- `GET /api/auth/me`

Protected app routes use `requireAuth`, which validates the Better Auth session cookie and exposes `req.user` and `req.session`.

## Project Structure

```text
backend/
  src/
    app.js                 # Express app composition and global middleware
    server.js              # Process entrypoint
    config/                # Environment, Better Auth, Supabase clients
    middlewares/           # Auth, role guard, error handling
    modules/               # Domain modules grouped by feature
      auth/
      health/
      onboarding/
      profile/
      projection/
    routes/                # API route aggregator
    utils/                 # Shared helpers and app error primitives
```
