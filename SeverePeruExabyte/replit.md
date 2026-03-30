# OLD MONEY — Luxury Shoe E-Commerce Platform

## Overview
A full-stack luxury footwear e-commerce platform with an "old money" aesthetic. Features a curated storefront, shopping cart, checkout flow, user accounts, and a JWT-protected admin dashboard.

## Architecture

### Backend (`/backend`) — Express.js on port 3001
- **Runtime**: Node.js / Express
- **Database**: Replit PostgreSQL (`DATABASE_URL`, `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`)
- **Auth**: JWT (`jsonwebtoken`) — secret stored in `JWT_SECRET` env var
- **Image uploads**: `multer` — files saved to `/backend/uploads/`, served at `/uploads/*`
- **Key files**:
  - `server.js` — Entry point, CORS, static uploads, route mounting
  - `routes/auth.js` — `POST /auth/login` → returns JWT
  - `routes/products.js` — CRUD: `GET/POST /products`, `GET/PUT/DELETE /products/:id`; image upload via `POST /products/:id/image`
  - `middleware/auth.js` — JWT verification middleware for protected routes
  - `db/migrate.js` — Creates `admins` + `products` tables, seeds 8 products + default admin
  - `db/index.js` — `pg` Pool configured from `DATABASE_URL`

### Frontend (`/frontend`) — Next.js 14 + Tailwind CSS on port 5000
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS — custom "old money" palette (cream, beige, dark-green, warm-black, gold)
- **Fonts**: Cormorant Garamond (serif headings) + Montserrat (sans body) via `next/font/google`
- **API proxy**: `next.config.js` rewrites `/api/*` → `http://localhost:3001/*` and `/uploads/*` → `http://localhost:3001/uploads/*`
- **Cart**: `CartContext` using `localStorage` for persistence

#### Pages
| Route | Description |
|---|---|
| `/` | Home — hero section + featured products |
| `/shop` | Full catalogue with Men's / Women's filter tabs |
| `/shop/[id]` | Product detail — size selector, add to cart |
| `/cart` | Cart summary with quantity controls |
| `/checkout` | Order form → confirmation |
| `/login` | Customer login |
| `/register` | Customer register |
| `/admin/login` | Admin login (JWT) |
| `/admin/dashboard` | Product table with edit / delete |
| `/admin/products/add` | Add product with image upload |
| `/admin/products/[id]/edit` | Edit product details |

#### Key files
- `lib/api.js` — Centralised fetch helpers (uses `/api` prefix for client-side, `http://localhost:3001` for server-side)
- `context/CartContext.js` — React context for cart state
- `components/Navbar.js` — Top navigation
- `components/Footer.js` — Site footer
- `app/layout.js` — Root layout with fonts + CartProvider

## Running the App
Single workflow `Start application` starts both servers:
```
(cd backend && node server.js) & (cd frontend && npm run dev)
```
- Frontend: `http://localhost:5000`
- Backend API: `http://localhost:3001`

## Default Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`

## Environment Variables
| Key | Value | Notes |
|---|---|---|
| `JWT_SECRET` | (shared secret) | Set via Replit secrets |
| `BACKEND_URL` | `http://localhost:3001` | Used in Next.js rewrites |
| `BACKEND_PORT` | `3001` | Backend listen port |
| `DATABASE_URL` | (managed by Replit) | PostgreSQL connection string |
