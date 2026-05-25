# AI Todo

Full-stack todo app built with React, Vite, Express, TypeScript, MongoDB, JWT auth, and a local dev fallback store.

## Project Structure

```text
AI-Todo-/
  backend/          Express API, auth, todo routes, MongoDB models
  frontend/         React/Vite client
  package.json      Root scripts for running both apps together
```

## Getting Started

Install dependencies:

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

Create environment files:

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

Run both apps:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:4000
```

## Useful Scripts

```bash
npm run dev              # backend + frontend
npm run dev:backend      # backend only
npm run dev:frontend     # frontend only
npm run build            # backend + frontend production builds
npm run start            # start compiled backend
```

## Development Storage

If MongoDB is unavailable, the backend falls back to `backend/.dev-store.json` for local development. That file is ignored by Git.
