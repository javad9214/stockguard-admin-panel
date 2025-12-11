# Vue 3 + TypeScript + Vite

Admin panel for StockGuard mobile apps. Use it to manage app versions (Android/iOS) through the StockGuard server.

## Prerequisites
- Node.js 18+
- Access to a running StockGuard server (see https://github.com/javad9214/StockGuard_ServerSide)

## Setup
```bash
npm install
```

Create a `.env` file (or `.env.local`) with your API base:
```bash
VITE_API_BASE_URL=http://localhost:8080/api
```
Update the URL to point at your deployed server.

## Develop
```bash
npm run dev
```

Login uses `/auth/login` (adjust if your server differs) and stores the returned token in `localStorage` under `admin_token`. Protected routes redirect to `/login` when unauthenticated.

## Build
```bash
npm run build
```

## Notes
- Auth header uses `admin_token` from `localStorage` if you need to protect the admin APIs.
- Version CRUD calls the `/version/admin/*` endpoints provided by the server project above.
