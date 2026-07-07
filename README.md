# ⬡ PixelVault — Digital Design Marketplace

A full-stack, production-ready e-commerce platform for digital design assets —
web templates, app designs, Blender 3D characters, UI kits, animations and
illustrations. Built with Next.js 15, Prisma and Stripe.

![Stack](https://img.shields.io/badge/Next.js-15-black) ![Prisma](https://img.shields.io/badge/Prisma-6-2D3748) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)

## ✨ Features

### Storefront
- **Artistic product presentation** — 3D tilt cards with glare tracking, animated
  gradient auroras, glassmorphism, film grain, a rotating 3D cube viewer on
  Blender/3D products, format badges, poly-count/rig chips, and staggered
  scroll reveals (Framer Motion).
- **Full catalog** — search, category filters, price caps, five sort orders.
- **Product pages** — spec grids, feature checklists, long descriptions,
  related products, verified-purchase reviews.
- **Cart & wishlist** — guest carts persist in localStorage and merge into the
  account automatically at sign-in; slide-out cart drawer.

### Commerce
- **Payments** — Stripe Checkout (test/live) when keys are configured, with a
  built-in **demo gateway** fallback (test card `4242 4242 4242 4242`) so the
  full purchase flow works with zero configuration.
- **Coupons** — percentage codes with usage caps (`WELCOME10`, `CREATOR25` seeded).
- **Orders & instant delivery** — tokenized, ownership-checked download
  endpoint that issues a license bundle per purchased item.
- **Verified reviews** — only paying customers can review; ratings roll up
  onto products automatically.

### Custom requests (commissions)
- Users submit briefs (category, budget, deadline) → admins **quote** →
  users **accept/decline** → status pipeline through delivery, with a private
  **message thread** per request between customer and admin.

### Roles & admin
- JWT sessions (httpOnly cookies) with **USER / ADMIN** roles enforced in
  middleware, API routes, and UI.
- **Admin dashboard** — revenue analytics (30-day chart with crosshair
  tooltips + data-table view), sales by category, top products, order status
  management, full product CRUD with live image picker, user role management,
  request pipeline, review moderation.

### Data
- **16 realistic seeded products** across 7 categories, 7 users, 11 orders,
  16 reviews, 3 custom-request threads with messages, and 2 coupons.

## 🚀 Quick start

```bash
npm install
npm run setup     # creates .env, pushes schema to SQLite, seeds demo data
npm run dev       # http://localhost:3000
```

### Demo accounts

| Role  | Email                 | Password  |
|-------|-----------------------|-----------|
| Admin | `admin@pixelvault.dev`| `Admin123!` |
| User  | `user@pixelvault.dev` | `User123!`  |

The seeded user already owns products (downloads unlocked) and has active
custom-request threads. Checkout works immediately with the demo gateway —
use card `4242 4242 4242 4242`, any future expiry, any CVC.

## 🧱 Tech stack

| Layer      | Choice |
|------------|--------|
| Framework  | Next.js 15 (App Router, RSC + route handlers) |
| Language   | TypeScript, Zod validation on every mutation |
| Database   | Prisma ORM — SQLite by default, Postgres-ready |
| Auth       | jose JWT in httpOnly cookies, bcrypt hashing, role middleware |
| Payments   | Stripe Checkout + webhook, demo gateway fallback |
| Styling    | Tailwind CSS 4, custom design tokens, Framer Motion |

## 💳 Enabling real Stripe payments

1. Grab keys from the [Stripe dashboard](https://dashboard.stripe.com/test/apikeys).
2. Set in `.env`:
   ```env
   STRIPE_SECRET_KEY="sk_test_…"
   STRIPE_WEBHOOK_SECRET="whsec_…"   # optional locally
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```
3. Point a webhook at `/api/webhooks/stripe` for `checkout.session.completed`
   (`stripe listen --forward-to localhost:3000/api/webhooks/stripe` locally).
   The success page also verifies sessions directly, so local checkout works
   even without the webhook.

Without keys, checkout automatically uses the demo gateway.

## 📦 Deployment

### Docker (recommended — zero external services)

```bash
docker build -t pixelvault .
docker run -p 3000:3000 \
  -v pixelvault-data:/app/data \
  -e AUTH_SECRET="$(openssl rand -base64 32)" \
  -e NEXT_PUBLIC_APP_URL="https://your-domain.com" \
  pixelvault
```

First boot creates and seeds the SQLite database on the mounted volume.
Works as-is on Railway, Fly.io, Render, or any VPS.

### Vercel / serverless

Serverless filesystems are ephemeral, so switch to a hosted Postgres
(Neon, Supabase, Vercel Postgres):

1. In `prisma/schema.prisma`: `provider = "postgresql"`.
2. Set `DATABASE_URL` to your Postgres connection string.
3. `npx prisma db push && npx prisma db seed` once against production.
4. Set `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, and (optionally) Stripe vars in
   the Vercel project, then deploy. The build command is already
   `prisma generate && next build`.

No code changes are needed — the schema uses no SQLite-specific features.

## 🗂 Project structure

```
prisma/
  schema.prisma          # 11 models: users, products, orders, requests…
  seed.ts                # 16 products + users/orders/reviews/requests
src/
  middleware.ts          # /account + /checkout auth, /admin role gate
  lib/                   # db, auth (JWT), stripe, orders, validation
  components/            # store provider (cart/wishlist/toast), UI kit
  app/
    api/                 # 22 route handlers (auth, cart, checkout, admin…)
    products/            # catalog + artistic product detail
    checkout/            # order review → payment → success
    account/             # dashboard, orders/downloads, wishlist, requests
    admin/               # analytics, products, orders, users, requests, reviews
    requests/            # public commissions landing page
```

## 🔐 Security notes

- Passwords hashed with bcrypt (cost 10); sessions are signed JWTs in
  httpOnly, SameSite=Lax cookies.
- Every mutation validates input with Zod and re-checks authorization
  server-side (never trusts the client role).
- Downloads are tokenized per order item and verify both ownership and paid
  status; admin endpoints require the ADMIN role at the API layer, not just
  in middleware.
- Set a strong `AUTH_SECRET` in production.
