# Proposal AI SaaS

Monorepo: **backend** (Express API), **frontend** ([Horizon UI Chakra](https://github.com/horizon-ui/horizon-ui-chakra)), optional **Mongo** via Docker.

## Prerequisites

- Node.js **LTS**
- MongoDB reachable at `MONGODB_URI`, or Docker (see below)

## Quick start

1. **Database (pick one)**

   ```bash
   docker compose up -d
   ```

   Or use Atlas / local Mongo already running.

2. **Backend**

   ```bash
   cd backend
   cp .env.example .env
   ```

   Edit `.env`: set `JWT_SECRET`, `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`; adjust `MONGODB_URI` if needed. For AI: set `GROQ_API_KEY` (production-style) **or** run Ollama locally and leave `OLLAMA_URL` default.

   ```bash
   npm install
   npm run dev
   ```

   API: `http://localhost:4000` · health: `GET /api/health`

3. **Frontend**

   ```bash
   cd frontend
   npm install
   npm start
   ```

   App: `http://localhost:3000` (CRA `proxy` forwards `/api` to port 4000)

   Optional: `cp .env.example .env` inside `frontend/` if you need `REACT_APP_API_URL` for a non-proxied API.

## Roles / routes

| Panel        | Path prefix |
|-------------|--------------|
| End user    | `/app`       |
| Admin       | `/staff`     |
| Super admin | `/super`     |

First super admin is created once from `SUPER_ADMIN_*` in `.env` if none exists.

## Password reset emails

Configure `RESEND_API_KEY` and `APP_URL` in `backend/.env`. Without Resend, the API logs the reset link to the console in development.
