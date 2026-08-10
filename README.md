# 🏠 RentNest — Frontend

A modern, responsive **Next.js** rental property marketplace. Landlords list and manage properties, tenants browse and rent with secure payments, and admins moderate the whole platform — all through role-based dashboards.

[![Live Site](https://img.shields.io/badge/Live-rentnest--frontend--theta.vercel.app-4c8bf5)](https://rentnest-frontend-theta.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend-rentnestbackend.vercel.app-6cc644)](https://rentnestbackend.vercel.app)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Links](#-live-links)
- [Tech Stack](#-tech-stack)
- [Roles & Permissions](#-roles--permissions)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#️-environment-variables)
- [Routes](#-routes)
- [API Integration](#-api-integration)
- [Payment Flow](#-payment-flow)
- [Admin Access (Demo)](#-admin-access-demo)
- [Author](#-author)

---

## 📖 Overview

RentNest is a **frontend-only** Next.js application that consumes a separate backend REST API. It covers the full rental lifecycle:

**Browse → Request → Approve → Pay → Review**, across three roles — **Tenant**, **Landlord**, and **Admin** — with role-based UI rendering and route protection via Next.js Middleware.

---
## 🔗 Live Links

| Resource | Link |
|---|---|
| **Live Frontend** | [rentnest-frontend-theta.vercel.app](https://rentnest-frontend-theta.vercel.app) |
| **Backend API** | [rentnestbackend.vercel.app](https://rentnestbackend.vercel.app) |
| **Frontend Repo** | [github.com/kaziashik/rentnest_frontend-](https://github.com/kaziashik/rentnest_frontend-) |
| **Backend Repo** | [github.com/kaziashik/rentnest_backend](https://github.com/kaziashik/rentnest_backend) |
| **API Integration Doc** | [`API_INTEGRATION.md`](./API_INTEGRATION.md) |

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router) — Server & Client Components, Server Actions
- **Auth:** JWT (access + refresh tokens), Next.js Middleware for route protection
- **Payments:** Stripe Checkout
- **Image Hosting:** ImgBB (via a server-side proxy API route)
- **Data Fetching / Caching:** Next.js `fetch` with tag-based `revalidateTag` invalidation
- **UI Feedback:** Toast notifications, skeleton loaders, `error.tsx` boundaries

---

## 👥 Roles & Permissions

| Role | Description | UI Access |
|---|---|---|
| **Tenant** | Users looking for rentals | Public browsing, request forms, payment checkout, reviews, protected tenant dashboard |
| **Landlord** | Property owners | Protected dashboard, property CRUD, request approve/reject, tenant history |
| **Admin** | Platform moderators | Protected dashboard, user ban/unban, platform stats, content moderation |

> Role is selected at registration. The UI adapts dynamically based on the authenticated user's role, and protected routes are enforced by **Next.js Middleware**.

---

## ✨ Features

### Public
- Responsive property grid with optimized images (`next/image`)
- Search & filter by location, price range, property type, amenities
- Property details page — gallery, description, landlord info, reviews, "Request to Rent" CTA
- Skeleton loaders + graceful `error.tsx` fallbacks

### Tenant
- Registration / login with inline validation errors
- Submit rental requests; track status (`Pending` → `Approved`/`Rejected` → `Active` → `Completed`)
- Stripe Checkout payment flow with `/success` and `/cancel` pages
- Dashboard: request history, payment history, leave reviews on active/completed rentals

### Landlord
- Dashboard overview: total properties, active requests, earnings
- Full property CRUD with image uploads and availability toggle
- Incoming request management with Approve/Reject actions + toast feedback

### Admin
- Platform-wide dashboard (users, properties, pending requests)
- User management table — search, paginate, ban/unban, delete
- Category management (create/edit/delete)
- View all properties and rental requests across the platform

---

## 📁 Project Structure

```
rentnest/
├── app/
│   ├── (authGroup)/               # Route group — auth pages (no shared URL segment)
│   │   ├── _actions/
│   │   │   └── authAction.ts      # login / register server actions
│   │   ├── _components/
│   │   ├── login/
│   │   └── register/
│   │
│   ├── (dashboardGroup)/          # Route group — all protected dashboards
│   │   ├── _actions/
│   │   ├── _components/
│   │   ├── _config/                # nav config, role-based menu items, etc.
│   │   ├── admin-dashboard/
│   │   ├── dashboard/               # shared dashboard shell/layout logic
│   │   ├── landlord-dashboard/
│   │   ├── tenant-dashboard/
│   │   └── layout.tsx               # wraps all dashboard routes (auth/role guarded)
│   │
│   ├── (publicGroup)/             # Route group — public-facing pages
│   │   ├── _actions/
│   │   ├── _components/
│   │   ├── about/
│   │   ├── cancel/                  # Stripe cancel redirect
│   │   ├── contact/
│   │   ├── propertiesDetails/       # /propertiesDetails/[id]
│   │   ├── services/
│   │   ├── success/                 # Stripe success redirect
│   │   ├── layout.tsx
│   │   └── page.tsx                 # Home page
│   │
│   ├── api/
│   │   └── upload-image/
│   │       └── route.ts           # Server-side proxy → ImgBB (keeps API key server-side)
│   │
│   ├── error.tsx                  # Global error boundary
│   ├── loading.tsx                 # Global loading UI / skeleton
│   ├── not-found.tsx               # Global 404 page
│   ├── globals.css
│   ├── layout.tsx                  # Root layout
│   └── favicon.ico
│
├── components/
│   ├── shared/
│   │   ├── Footer.tsx
│   │   ├── navbar.tsx
│   │   ├── theme-provider.tsx
│   │   └── ThemeToggle.tsx
│   └── ui/                        # shadcn/ui primitives
│
├── hooks/
│   └── use-mobile.ts
│
├── lib/
│   ├── statusBadge.ts              # rental status → badge color/label mapping
│   ├── types.ts
│   └── utils.ts
│
├── service/                       # Shared auth/session service calls
│   ├── getMe.ts
│   ├── logout.ts
│   └── refreshToken.ts
│
├── utils/
│   └── jwt.ts                     # JWT sign/verify helpers
│
├── public/
├── .env                           # local secrets (gitignored)
├── .gitignore
├── components.json                # shadcn/ui config
├── AGENTS.md
├── CLAUDE.md
├── API_INTEGRATION.md
└── README.md
```

> `.next/`, `.vercel/`, and `node_modules/` are build/dependency artifacts and are omitted above.
>
> Routes are organized into three **Next.js route groups** — `(authGroup)`, `(dashboardGroup)`, `(publicGroup)` — which let related pages share a layout without adding a segment to the URL. Middleware enforces role-based access on top of this at the `(dashboardGroup)` level.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm (or pnpm/yarn)
- A running instance of the [backend API](https://rentnestbackend.vercel.app) (local or deployed)

### Installation

```bash
git clone https://github.com/kaziashik/rentnest_frontend-.git
cd rentnest_frontend-
npm install
```

### Configure environment variables

```bash
cp .env.example .env.local
```

Fill in the values in `.env.local` (see [Environment Variables](#️-environment-variables) below).

### Run the dev server

```bash
npm run dev
```

Visit **http://localhost:3000**.

### Build for production

```bash
npm run build
npm start
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root with the following keys. **No values are provided here** — obtain real secrets from the project owner or your own service dashboards (ImgBB, JWT secret generator, etc.). Never commit `.env.local`.

| Variable | Scope | Used For |
|---|---|---|
| `BACKEND_API_URL` | Server only | Base URL server actions/server components use to reach the backend API (kept server-side, never shipped to the browser bundle) |
| `NEXT_PUBLIC_BACKEND_API_URL` | Client + Server | Same backend base URL, exposed to client components that fetch the API directly |
| `JWT_ACCESS_SECRET` | Server only | Signs/verifies short-lived access tokens |
| `JWT_REFRESH_SECRET` | Server only | Signs/verifies long-lived refresh tokens, used by the silent-refresh flow in `getAccessToken` |
| `IMGBB_API_KEY` | Server only | Server-side key for the `/api/upload-image` proxy route, keeping the key out of the client bundle |

**`.env.example`** (commit this one, with no real values):

```dotenv
# Server-only
BACKEND_API_URL=

# Client + Server (must be prefixed NEXT_PUBLIC_ to be exposed to the browser)
NEXT_PUBLIC_BACKEND_API_URL=

# Auth
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

# Image uploads
IMGBB_API_KEY=
```

> 💡 Swap `BACKEND_API_URL` / `NEXT_PUBLIC_BACKEND_API_URL` between your local backend (`http://localhost:5000`) and the deployed backend (`https://rentnestbackend.vercel.app`) depending on what you're testing against.

---

## 🗺️ Frontend Routes & API Integration

| Next.js Route | Component/Feature | Backend API Consumption |
|---|---|---|
| `/` | Home page with featured properties | `GET /api/properties` |
| `/properties` | Browse & filter properties | `GET /api/properties`, `GET /api/categories` |
| `/propertiesDetails/[id]` | Property details, gallery, reviews & request CTA | `GET /api/properties/:propertyId`, `GET /api/review/:propertyId` |
| `/register` | Role selection & registration form | `POST /api/users/register` |
| `/login` | Login form | `POST /api/auth/login` |
| `/dashboard/tenant` | Tenant overview & request history | `GET /api/rentals`, `GET /api/pay` |
| `/dashboard/tenant/requests/[id]/pay` | Payment initiation page | `POST /api/pay/create-checkout-session` |
| `/payment/success` & `/payment/cancel` | Payment outcome pages | *(Revalidates cache based on Stripe redirect)* |
| `/dashboard/landlord` | Landlord overview & property list | `GET /api/properties/landlord` |
| `/dashboard/landlord/properties/new` | Create property form | `POST /api/properties/landlord` |
| `/dashboard/landlord/requests` | Manage incoming requests | `GET /api/rentals`, `PUT /api/rentals/:id/status` |
| `/dashboard/admin` | Admin overview & user management | `GET /api/admin/dashboard`, `GET /api/admin/allusers`, `PATCH /api/admin/user/:id/status` |

> Access: everything above `/dashboard/tenant` is public. Everything under `/dashboard/*` is protected via **Next.js Middleware** and scoped to the matching role (tenant / landlord / admin).

Full component-level and per-action breakdown (including reviews, image uploads, and caching strategy) lives in [`API_INTEGRATION.md`](./API_INTEGRATION.md).

---

## 🔌 API Integration

Full request/response-level mapping of every frontend component to its backend endpoint lives in [`API_INTEGRATION.md`](./API_INTEGRATION.md), including:

- Public property/category endpoints
- Landlord property CRUD
- Rental request lifecycle
- Payments (Stripe Checkout)
- Reviews
- Auth & profile
- Admin user/category management
- Image upload proxy
- Caching & revalidation strategy

---

## 💳 Payment Flow

# Property Rental Lifecycle

The property availability follows the complete rental lifecycle.

## Availability Rules

The property should follow these rules throughout the rental process:

| Rental Status           | Property Availability |
| ----------------------- | --------------------- |
| Rental Request Pending  | **AVAILABLE**         |
| Rental Request Approved | **AVAILABLE**         |
| Payment Pending         | **AVAILABLE**         |
| Payment Completed       | **UNAVAILABLE**       |
| Rental Active           | **UNAVAILABLE**       |
| Rental Completed        | **AVAILABLE**         |

### After Successful Payment

When the tenant successfully completes the payment:

```text
Payment = COMPLETED
       ↓
Rental Request = ACTIVE
       ↓
Property = UNAVAILABLE
```

The property must remain unavailable while the rental is active so that other tenants cannot rent the same property.

### When the Rental Is Completed

When the landlord or system marks the active rental as **COMPLETED**, the property must become available again.

```text
Rental Request = ACTIVE
       ↓
Rental Completed
       ↓
Rental Request = COMPLETED
       ↓
Property = AVAILABLE
```

This allows the property to be rented again by another tenant.

---

# Complete Property Lifecycle

```text
                 ┌─────────────────┐
                 │    AVAILABLE    │
                 └────────┬────────┘
                          │
                          │ Tenant submits request
                          ↓
                 ┌─────────────────┐
                 │     PENDING     │
                 └────────┬────────┘
                          │
                          │ Landlord approves
                          ↓
                 ┌─────────────────┐
                 │    APPROVED     │
                 │ Property still  │
                 │    AVAILABLE    │
                 └────────┬────────┘
                          │
                          │ Tenant pays
                          ↓
                 ┌─────────────────┐
                 │     ACTIVE      │
                 │                 │
                 │ Property        │
                 │ UNAVAILABLE     │
                 └────────┬────────┘
                          │
                          │ Rental period ends
                          │ / marked completed
                          ↓
                 ┌─────────────────┐
                 │    COMPLETED    │
                 │                 │
                 │ Property        │
                 │ AVAILABLE       │
                 └────────┬────────┘
                          │
                          │ Available for
                          │ another tenant
                          ↓
                 ┌─────────────────┐
                 │    AVAILABLE    │
                 └─────────────────┘
```

## Important Business Rule

> **A property should only become `UNAVAILABLE` after the tenant's payment has been successfully confirmed and the rental becomes `ACTIVE`.**

Likewise:

> **When an active rental is marked `COMPLETED`, the property must be changed back to `AVAILABLE`.**

Therefore, the system should **not** leave the property permanently unavailable after a rental has ended.

### Final Lifecycle

```text
AVAILABLE
    ↓
PENDING
    ↓
APPROVED
    ↓
PAYMENT COMPLETED
    ↓
ACTIVE
    ↓
UNAVAILABLE
    ↓
RENTAL COMPLETED
    ↓
AVAILABLE
```

## Completion Handling

When a rental is marked as `COMPLETED`, the backend should:

1. Update the rental request status to `COMPLETED`.
2. Update the associated property availability to `AVAILABLE`.
3. Revalidate the rental request cache.
4. Revalidate the property cache.
5. Revalidate the tenant's payment/rental history if required.
6. Ensure the property appears as available on the property listing page.
7. Allow a new tenant to submit a rental request for the property.

```text
Mark Rental as COMPLETED
          ↓
Rental Request → COMPLETED
          ↓
Property → AVAILABLE
          ↓
Revalidate Property Cache
          ↓
Revalidate Rental Cache
          ↓
Property Listing Updated
          ↓
Property Can Be Rented Again
```

This ensures the property availability correctly follows the entire rental lifecycle rather than remaining `UNAVAILABLE` after the previous rental has ended.


---



---

## 👤 Author

**Kazi Ashik**
© 2026 RentNest. Built by Kazi Ashik.
