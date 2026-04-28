# CoachUp — Sports Coaching Marketplace

A mobile-first marketplace that connects young athletes with high school and college
coaches for 1-on-1 coaching sessions. MVP build per the product spec.

## Stack

- **Next.js 14** (App Router, Server Actions) + TypeScript
- **Tailwind CSS** for mobile-first responsive UI
- **Prisma + SQLite** for the database (swap `provider` to `postgresql` for prod)
- **bcryptjs** + cookie sessions for auth
- Mock payment screen (slot in **Stripe** in `app/bookings/[id]/pay/page.tsx`)

## Getting started

```bash
cp .env.example .env
npm install
npx prisma db push
npm run db:seed     # optional: creates 6 demo coaches + a player
npm run dev
```

Open http://localhost:3000.

### Demo accounts (after seeding)

- Player: `player@example.com` / `password123`
- Coach:  `james@example.com` / `password123` (and others — see `prisma/seed.ts`)

## What's built (MVP scope from the spec)

- ✅ Signup / login (player, coach, parent roles) with session cookies
- ✅ Coach profile setup (sport, experience, rate, bio, ZIP, radius, instant-book)
- ✅ Coach browse + filter by sport / ZIP / radius / search
- ✅ Coach detail page with bio, pricing tiers, reviews
- ✅ Booking flow — date, time, 30/60/90/120 min, location, notes
- ✅ Mock payment with full price breakdown (10% platform fee shown)
- ✅ Booking lifecycle: PENDING → CONFIRMED → COMPLETED / CANCELLED
- ✅ Coach accepts/declines pending bookings (or instant-book auto-confirms)
- ✅ 5-star review + optional comment after completed sessions
- ✅ Coach ranking by avg rating (sort in `app/coaches/page.tsx`)
- ✅ Dashboard with bookings + lifetime earnings for coaches

## Phase 2+ (intentionally not in MVP)

- Real Stripe Connect payouts (replace mock pay action)
- In-app messaging
- Background checks
- Push notifications / SMS reminders
- Coach availability calendar (currently any future time accepted)

## Project layout

```
app/
  page.tsx                    Marketing home
  signup/  login/             Auth pages (server actions)
  coaches/                    Browse + detail + booking flow
  bookings/[id]/              Booking detail, mock pay, review
  coach/setup/                Coach profile create/edit
  dashboard/                  Player + coach dashboard
  api/auth/logout/            Session destroy
lib/
  prisma.ts  auth.ts  sports.ts
prisma/
  schema.prisma  seed.ts
```

## Pricing math

`priceForDuration(hourlyRate, durationMin)` computes:
- `totalCents` — what the player pays
- `platformCents` — 10% platform fee
- `coachCents` — 90% goes to the coach (Stripe Connect transfer in prod)
