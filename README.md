# Company Incorporation Tool

A full-stack web app for managing companies and their shareholders.

## Stack

- **Frontend** — React + Vite
- **Backend** — Node.js + Express
- **Database** — PostgreSQL

---

## Backend

REST API built with Express. On startup it initialises the database schema automatically.

**Routes:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/signup` | — | Register a new user |
| POST | `/auth/login` | — | Login, returns JWT |
| POST | `/company` | User | Create a company |
| POST | `/shareholder` | — | Add a single shareholder |
| POST | `/shareholders` | User | Add shareholders in bulk |
| GET | `/admin/company` | Admin | List all companies |
| GET | `/admin/shareholder/:companyId` | Admin | List shareholders for a company |

**Environment variables (`backend/.env` or root `.env` via Docker):**

| Variable | Description |
|----------|-------------|
| `DB_HOST` | Postgres host |
| `DB_PORT` | Postgres port (default `5432`) |
| `DB_USER` | Postgres user |
| `DB_PASSWORD` | Postgres password |
| `DB_NAME` | Postgres database name |
| `JWT_SECRET` | Secret used to sign JWTs |
| `BACKEND_PORT` | Port the API listens on (default `5000`) |
| `ADMIN_USERNAME` | Seeded admin account username |
| `ADMIN_PASSWORD` | Seeded admin account password |

---

## Frontend

React SPA served by Vite dev server.

**Environment variables (`frontend/.env`):**

| Variable | Description |
|----------|-------------|
| `VITE_BACKEND_URL` | Full URL of the backend API (e.g. `http://localhost:5000`) |

---

## Running with Docker

Copy the example env file and fill in the values:

```bash
cp .env.example .env
```

Then start everything:

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| Postgres | localhost:5432 |

---

## Running locally

```bash
# backend
cd backend && npm install && npm run dev

# frontend
cd frontend && npm install && npm run dev
```
