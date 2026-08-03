# 🗺️ Frontend Routes & API Integration — RentNest

A complete, route-by-route breakdown of every page in the app: what it renders, which route group and access level it belongs to, which components/server actions live behind it, and exactly which backend endpoint(s) it calls.

---

## 📋 Table of Contents

- [How Routing Is Organized](#-how-routing-is-organized)
- [Access Levels](#-access-levels)
- [1. Public Routes](#1-public-routes-publicgroup)
- [2. Auth Routes](#2-auth-routes-authgroup)
- [3. Tenant Dashboard Routes](#3-tenant-dashboard-routes-dashboardgroup)
- [4. Landlord Dashboard Routes](#4-landlord-dashboard-routes-dashboardgroup)
- [5. Admin Dashboard Routes](#5-admin-dashboard-routes-dashboardgroup)
- [6. Internal API Routes](#6-internal-api-routes)
- [Quick-Reference Table](#-quick-reference-table)
- [Caching & Revalidation Notes](#-caching--revalidation-notes)

---

## 🧩 How Routing Is Organized

The app uses **Next.js route groups** to share layouts without adding a URL segment:

| Route Group | Folder | Purpose | Guarded By |
|---|---|---|---|
| Public | `app/(publicGroup)/` | Home, listings, static pages, payment redirects | — (open to everyone) |
| Auth | `app/(authGroup)/` | Login, register | Redirects away *if already logged in* |
| Dashboard | `app/(dashboardGroup)/` | Tenant, landlord, admin dashboards | Next.js **Middleware** — requires valid session + matching role |

Middleware reads the JWT session (via `getAccessToken`, silently refreshing through `/api/auth/refresh-token` if expired) before allowing access to anything under `(dashboardGroup)`, and redirects unauthenticated or wrong-role users back to `/login`.

---

## 🔐 Access Levels

| Badge | Meaning |
|---|---|
| 🟢 Public | No login required |
| 🟡 Tenant | Requires login, role = `tenant` |
| 🔵 Landlord | Requires login, role = `landlord` |
| 🔴 Admin | Requires login, role = `admin` |

---

## 1. Public Routes `(publicGroup)`

### `/` — Home
🟢 Public

| | |
|---|---|
| **Renders** | Featured/latest property grid, search bar |
| **Key Components** | `PropertyList`, `SearchFilterBar`, `PropertyCard` |
| **Server Action** | `getHouseRentalProperties()` |
| **Backend Call** | `GET /api/properties` |
| **Loading State** | Skeleton grid (`loading.tsx`) |

---

### `/properties` — Browse & Filter
🟢 Public

| | |
|---|---|
| **Renders** | Full property grid with sidebar/top filters (location, price range, type, amenities) and pagination |
| **Key Components** | `PropertyList`, `FilterSidebar`, `Pagination` |
| **Server Actions** | `getHouseRentalProperties(searchParams)`, `getCategories()` |
| **Backend Calls** | `GET /api/properties` (with query params), `GET /api/categories` |
| **Notes** | Filters are read from/written to the URL query string so results are shareable/bookmarkable |

---

### `/propertiesDetails/[id]` — Property Details
🟢 Public *(the "Request to Rent" action itself requires login)*

| | |
|---|---|
| **Renders** | Image gallery, description, amenities, landlord info, reviews list, "Request to Rent" CTA |
| **Key Components** | `PropertyDetails`, `ImageGallery`, `PropertyReviews`, `RequestRentalDialog` |
| **Server Actions** | `getPropertyById(id)`, `getPropertyReviews(id)` |
| **Backend Calls** | `GET /api/properties/:propertyId`, `GET /api/review/:propertyId` |
| **Behind Login** | Submitting the rental request → `createRentalRequest()` → `POST /api/rentals` |
| **Error State** | `error.tsx` fallback if property ID doesn't exist |

---

### `/about`, `/services`, `/contact` — Static Pages
🟢 Public

| | |
|---|---|
| **Renders** | Static marketing/info content |
| **Backend Call** | None |

---

### `/success` — Payment Success
🟢 Public *(reached only via Stripe redirect after checkout)*

| | |
|---|---|
| **Renders** | Payment confirmation UI, link back to tenant dashboard |
| **Server Action** | `confirmPaymentSuccess()` — revalidates cached tags for payment history & rental requests |
| **Backend Call** | — (internal cache revalidation only; the actual payment was confirmed server-side by Stripe webhook/callback) |
| **Notes** | `success_url` is set by the backend when the checkout session is created |

---

### `/cancel` — Payment Cancelled
🟢 Public *(reached only via Stripe redirect if checkout is abandoned)*

| | |
|---|---|
| **Renders** | "Payment cancelled" message, retry CTA back to the rental request |
| **Backend Call** | None |

---

## 2. Auth Routes `(authGroup)`

### `/login`
🟢 Public

| | |
|---|---|
| **Renders** | Login form (email, password) with inline validation errors |
| **Key Component** | `LoginForm` |
| **Server Action** | `loginAction()` |
| **Backend Call** | `POST /api/auth/login` |
| **On Success** | Sets JWT cookies, redirects to role-appropriate dashboard (or `redirectTo` query param if present) |

---

### `/register`
🟢 Public

| | |
|---|---|
| **Renders** | Registration form — name, email, password, phone, role selector (tenant/landlord), optional profile photo |
| **Key Component** | `RegisterForm` |
| **Server Actions** | `registerAction()`, and `POST /api/upload-image` if a photo is attached |
| **Backend Calls** | `POST /api/users/register`, `POST /api/upload-image` (ImgBB proxy, optional) |
| **On Success** | Redirects to `/login` (or auto-logs in, depending on implementation) |

---

## 3. Tenant Dashboard Routes `(dashboardGroup)`

### `/dashboard/tenant`
🟡 Tenant

| | |
|---|---|
| **Renders** | Overview of rental request history (status badges), payment history table, review form for eligible rentals |
| **Key Components** | `MyRentalRequestsList`, `PaymentHistoryTable`, `WriteReviewDialog` |
| **Server Actions** | `getMyRentalRequests()`, `getPaymentHistory()` |
| **Backend Calls** | `GET /api/rentals`, `GET /api/pay` |
| **Cache Strategy** | `cache: "no-store"` — must always reflect real-time status |

---

### `/dashboard/tenant/requests/[id]/pay`
🟡 Tenant

| | |
|---|---|
| **Renders** | "Pay Now" confirmation screen for an approved rental request |
| **Key Component** | `PayNowButton` |
| **Server Action** | `createCheckoutSession(requestId)` |
| **Backend Call** | `POST /api/pay/create-checkout-session` |
| **On Success** | Redirects to Stripe Checkout (external), which then redirects back to `/success` or `/cancel` |

---

## 4. Landlord Dashboard Routes `(dashboardGroup)`

### `/dashboard/landlord`
🔵 Landlord

| | |
|---|---|
| **Renders** | Overview cards — total properties, active requests, earnings |
| **Key Component** | `LandlordDashboardOverview` |
| **Server Action** | `getMyProperties()` (+ aggregated stats) |
| **Backend Call** | `GET /api/properties/landlord` |

---

### `/dashboard/landlord/properties/new`
🔵 Landlord

| | |
|---|---|
| **Renders** | Create-property form — title, description, price, location, category, amenities, image upload |
| **Key Components** | `CreatePropertyForm`, image upload UI |
| **Server Actions** | `createProperty()`, `getCategories()` (for category dropdown), `POST /api/upload-image` per image |
| **Backend Calls** | `POST /api/properties/landlord`, `GET /api/categories`, `POST /api/upload-image` |

---

### `/dashboard/landlord/properties` *(edit/delete, via dialogs)*
🔵 Landlord

| | |
|---|---|
| **Renders** | List of the landlord's properties with edit/delete actions and availability toggle |
| **Key Components** | `MyPropertiesList`, `PropertyFormDialog` (edit), `DeletePropertyDialog` |
| **Server Actions** | `updateProperty()`, `deleteProperty()` |
| **Backend Calls** | `PUT /api/properties/landlord/:id`, `DELETE /api/properties/landlord/:id` |

---

### `/dashboard/landlord/requests`
🔵 Landlord

| | |
|---|---|
| **Renders** | Table of incoming rental requests on the landlord's properties, with Approve/Reject actions |
| **Key Components** | `RentalRequestsList`, `RentalRequestCard` |
| **Server Actions** | `getRentalRequests()`, `updateRentalStatus()` |
| **Backend Calls** | `GET /api/rentals`, `PUT /api/rentals/:id/status` |
| **UX** | Optimistic UI update on approve/reject + toast notification, no full page reload |

---

## 5. Admin Dashboard Routes `(dashboardGroup)`

### `/dashboard/admin`
🔴 Admin

| | |
|---|---|
| **Renders** | Platform-wide stats — total users, properties, pending requests |
| **Key Component** | `AdminDashboardPage` |
| **Server Action** | `getAdminDashboard()` |
| **Backend Call** | `GET /api/admin/dashboard` |

---

### `/dashboard/admin/users` *(users table)*
🔴 Admin

| | |
|---|---|
| **Renders** | Searchable, paginated table of all users with Ban/Unban and Delete actions |
| **Key Components** | `UsersList`, `UsersTable`, `UserRow` |
| **Server Actions** | `getAllUsers()`, `updateUserStatus()`, `deleteUser()` |
| **Backend Calls** | `GET /api/admin/allusers`, `PATCH /api/admin/user/:id/status`, `DELETE /api/admin/user/:id` |

---

### `/dashboard/admin/categories` *(category management)*
🔴 Admin

| | |
|---|---|
| **Renders** | CRUD table for property categories |
| **Key Components** | `CategoriesList`, `CategoryFormDialog`, `DeleteCategoryDialog` |
| **Server Actions** | `getAllCategories()`, `createCategory()`, `updateCategory()`, `deleteCategory()` |
| **Backend Calls** | `GET /api/categories`, `POST /api/categories`, `PUT /api/categories/:id`, `DELETE /api/categories/:id` |

---

### `/dashboard/admin/moderation` *(properties & requests, platform-wide)*
🔴 Admin

| | |
|---|---|
| **Renders** | Read-only view of every property and every rental request across the platform |
| **Key Components** | `AllPropertiesList`, `AdminRentalRequestsList` |
| **Server Actions** | `getHouseRentalProperties()` (reused), `getAllRentalRequests()` |
| **Backend Calls** | `GET /api/properties`, `GET /api/rentals` |

---

## 6. Internal API Routes

These are **Next.js route handlers inside the frontend app itself** (`app/api/...`) — not backend endpoints, but server-side proxies the frontend exposes to keep secrets off the client.

### `POST /api/upload-image`
| | |
|---|---|
| **Purpose** | Proxies image uploads to ImgBB so `IMGBB_API_KEY` never reaches the browser |
| **Called From** | `RegisterForm` (profile photo), `ProfileForm` (photo update), `CreatePropertyForm` (property images) |
| **Flow** | Client sends `FormData` → this route → ImgBB API → returns public image URL → URL is submitted as part of the outer form (`property_image`, `photo`) |

---

## 📊 Quick-Reference Table

| Next.js Route | Access | Component/Feature | Backend API Consumption |
|---|---|---|---|
| `/` | 🟢 Public | Home — featured properties | `GET /api/properties` |
| `/properties` | 🟢 Public | Browse & filter properties | `GET /api/properties`, `GET /api/categories` |
| `/propertiesDetails/[id]` | 🟢 Public | Property details, reviews, request CTA | `GET /api/properties/:propertyId`, `GET /api/review/:propertyId` |
| `/about` `/services` `/contact` | 🟢 Public | Static pages | — |
| `/success` | 🟢 Public | Payment success feedback | *(cache revalidation only)* |
| `/cancel` | 🟢 Public | Payment cancelled feedback | — |
| `/login` | 🟢 Public | Login form | `POST /api/auth/login` |
| `/register` | 🟢 Public | Registration form | `POST /api/users/register`, `POST /api/upload-image` |
| `/dashboard/tenant` | 🟡 Tenant | Request & payment history | `GET /api/rentals`, `GET /api/pay` |
| `/dashboard/tenant/requests/[id]/pay` | 🟡 Tenant | Payment initiation | `POST /api/pay/create-checkout-session` |
| `/dashboard/landlord` | 🔵 Landlord | Overview & property list | `GET /api/properties/landlord` |
| `/dashboard/landlord/properties/new` | 🔵 Landlord | Create property | `POST /api/properties/landlord`, `GET /api/categories`, `POST /api/upload-image` |
| `/dashboard/landlord/properties` | 🔵 Landlord | Edit/delete listings | `PUT /api/properties/landlord/:id`, `DELETE /api/properties/landlord/:id` |
| `/dashboard/landlord/requests` | 🔵 Landlord | Approve/reject requests | `GET /api/rentals`, `PUT /api/rentals/:id/status` |
| `/dashboard/admin` | 🔴 Admin | Platform stats | `GET /api/admin/dashboard` |
| `/dashboard/admin/users` | 🔴 Admin | User management | `GET /api/admin/allusers`, `PATCH /api/admin/user/:id/status`, `DELETE /api/admin/user/:id` |
| `/dashboard/admin/categories` | 🔴 Admin | Category CRUD | `GET/POST/PUT/DELETE /api/categories` |
| `/dashboard/admin/moderation` | 🔴 Admin | Platform-wide listings & requests | `GET /api/properties`, `GET /api/rentals` |
| *(internal)* `app/api/upload-image` | — | ImgBB upload proxy | External: ImgBB API |

---

## ⏱️ Caching & Revalidation Notes

| Data Type | Strategy | Reasoning |
|---|---|---|
| Properties, categories | `revalidate: 60`, tagged | Changes occasionally — short cache is fine |
| Rental requests, payment history | `cache: "no-store"` | Must always reflect real-time status (payments, approvals) |
| Current user (`getMe`) | `cache: "no-store"` | Must always reflect the logged-in session, never shared across visitors |
| Reviews | Tagged (`property-reviews-:id`, `tenant-reviews`) | Revalidated on-demand via `revalidateTag` after a new review is submitted |

Every mutating action (`create` / `update` / `delete`) calls `revalidateTag(...)` on success so the UI reflects changes immediately without a manual refresh.
