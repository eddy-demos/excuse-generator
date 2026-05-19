# Excuse Generator

A small CRUD web app for generating, managing, and copying excuses across categories like work, school, social, family, and other.

## Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + React Router
- **Backend**: Node.js + Express
- **Database**: `lowdb` (single JSON file — no migrations required)

## Project Structure

```
excuse-generator/
├── server/        # Express API (port 3001)
│   ├── index.js
│   ├── routes/excuses.js
│   ├── db/index.js
│   └── db/seed.js
├── client/        # React + Vite app (port 5173)
│   ├── src/
│   └── index.html
└── README.md
```

## Setup

```bash
# Backend
cd server
npm install
npm run db:seed    # loads 20 starter excuses
npm run dev        # http://localhost:3001

# Frontend (new terminal)
cd client
npm install
npm run dev        # http://localhost:5173
```

The Vite dev server proxies `/api/*` to `localhost:3001`, so no CORS friction in dev.

## API

Base path: `/api/excuses`

| Method | Endpoint                | Purpose                                                |
| ------ | ----------------------- | ------------------------------------------------------ |
| GET    | `/api/excuses`          | List all (`?category=`, `?sort=createdAt\|timesUsed`)  |
| GET    | `/api/excuses/random`   | Random pick (`?category=`)                             |
| GET    | `/api/excuses/:id`      | Get one                                                |
| POST   | `/api/excuses`          | Create `{ text, category, severity }`                  |
| PUT    | `/api/excuses/:id`      | Update (partial allowed)                               |
| PATCH  | `/api/excuses/:id/used` | Increment `timesUsed`                                  |
| DELETE | `/api/excuses/:id`      | Delete                                                 |

Validation: `text` 1–500 chars; `category` ∈ {work, school, social, family, other}; `severity` integer 1–5.

## Production

```bash
cd client && npm run build       # outputs client/dist/
cd ../server && NODE_ENV=production npm start
```

Express will serve the built client from `client/dist/` so the whole app runs on a single port.
