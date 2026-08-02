# API Integration — RentNest Frontend

This document maps every frontend component/server action to the backend API endpoint it consumes. Use it as a quick reference for what calls what.

---

## 🏠 Public — Properties & Categories

| Frontend Component | Server Action | Backend Endpoint | Method |
|---|---|---|---|
| `PropertyList` (Home page) | `getHouseRentalProperties` | `/api/properties` | GET |
| `PropertyDetails` | `getPropertyById` | `/api/properties/:propertyId` | GET |
| `PropertyReviews` | `getPropertyReviews` | `/api/review/:propertyId` | GET |
| `CreatePropertyForm` (category dropdown) | `getCategories` | `/api/categories` | GET |

---

## 🏘️ Landlord — Property Management

| Frontend Component | Server Action | Backend Endpoint | Method |
|---|---|---|---|
| `MyPropertiesList` | `getMyProperties` | `/api/properties/landlord` | GET |
| `CreatePropertyForm` | `createProperty` | `/api/properties/landlord` | POST |
| `PropertyFormDialog` (edit mode) | `updateProperty` | `/api/properties/landlord/:id` | PUT |
| `DeletePropertyDialog` | `deleteProperty` | `/api/properties/landlord/:id` | DELETE |

---

## 📋 Rental Requests

| Frontend Component | Server Action | Backend Endpoint | Method |
|---|---|---|---|
| `RequestRentalDialog` (tenant, on property details page) | `createRentalRequest` | `/api/rentals` | POST |
| `RentalRequestsList` (landlord — all requests on their properties) | `getRentalRequests` | `/api/rentals` | GET |
| `MyRentalRequestsList` (tenant — their own requests) | `getMyRentalRequests` | `/api/rentals` | GET |
| `AdminRentalRequestsList` (admin — platform-wide moderation) | `getAllRentalRequests` | `/api/rentals` | GET |
| `RentalRequestCard` (landlord Accept/Reject buttons) | `updateRentalStatus` | `/api/rentals/:id/status` | PUT |

> Status flow: `PENDING → APPROVED / REJECTED → ACTIVE → COMPLETED`
> UI badge colors (via `getStatusBadgeClass`): Pending = yellow, Approved = blue, Rejected = red, Active = green, Completed = gray.

---

## 💳 Payments

| Frontend Component | Server Action | Backend Endpoint | Method |
|---|---|---|---|
| `PayNowButton` | `createCheckoutSession` | `/api/pay/create-checkout-session` | POST |
| `TenantPaymentsList` / `PaymentHistoryTable` | `getPaymentHistory` | `/api/pay` | GET |
| `/success` page | `confirmPaymentSuccess` (revalidates cache after Stripe redirect) | — (internal cache revalidation only) | — |

> Stripe redirects to `/success` or `/cancel` after checkout, based on `success_url`/`cancel_url` set by the backend.

---

## ⭐ Reviews

| Frontend Component | Server Action | Backend Endpoint | Method |
|---|---|---|---|
| `WriteReviewDialog` (tenant, shown on `ACTIVE` requests) | `createReview` | `/api/review` | POST |
| `PropertyReviews` (public property details page) | `getPropertyReviews` | `/api/review/:propertyId` | GET |
| `MyReviewsPage` (tenant dashboard) | `getTenantReviews` | `/api/review/tenant-reviews` | GET |

---

## 🔐 Authentication & Profile

| Frontend Component | Server Action | Backend Endpoint | Method |
|---|---|---|---|
| `RegisterForm` | `registerAction` | `/api/users/register` | POST |
| `LoginForm` | `loginAction` | `/api/auth/login` | POST |
| `Navbar`, `DashboardGroupLayout`, `PublicGroupLayout` (get current user) | `getMe` | `/api/users/me` | GET |
| `getAccessToken` (internal, called by nearly every action) | `getNewAccessToken` | `/api/auth/refresh-token` | POST |
| `ProfileForm` (Tenant / Landlord / Admin — shared component) | `updateProfile` | `/api/users/updateProfile` | PUT |
| `Navbar` logout menu item | `logout` | `/api/auth/logout` | POST |

> `getAccessToken` is a shared utility: checks if the access token is valid, and silently refreshes it via the refresh token if expired — used internally by nearly all server actions above instead of reading cookies directly.

---

## 🛠️ Admin

| Frontend Component | Server Action | Backend Endpoint | Method |
|---|---|---|---|
| `AdminDashboardPage` | `getAdminDashboard` | `/api/admin/dashboard` | GET |
| `UsersList` / `UsersTable` | `getAllUsers` | `/api/admin/allusers` | GET |
| `UserRow` (Ban / Unban toggle) | `updateUserStatus` | `/api/admin/user/:id/status` | PATCH |
| `UserRow` (Delete) | `deleteUser` | `/api/admin/user/:id` | DELETE |
| `CategoriesList` | `getAllCategories` | `/api/categories` | GET |
| `CategoryFormDialog` (create mode) | `createCategory` | `/api/categories` | POST |
| `CategoryFormDialog` (edit mode) | `updateCategory` | `/api/categories/:id` | PUT |
| `DeleteCategoryDialog` | `deleteCategory` | `/api/categories/:id` | DELETE |
| `AllPropertiesList` (admin — platform-wide, read-only) | `getHouseRentalProperties` (reused public action) | `/api/properties` | GET |

---

## 🖼️ Image Uploads (Third-Party — ImgBB)

| Frontend Component | Internal Route | External Service | Method |
|---|---|---|---|
| `RegisterForm` (optional profile photo) | `/api/upload-image` (own Next.js API route, proxies to ImgBB) | ImgBB API | POST |
| `ProfileForm` (update profile photo) | `/api/upload-image` | ImgBB API | POST |
| `CreatePropertyForm` (multiple property images) | `/api/upload-image` | ImgBB API | POST |

> Images are uploaded directly from the browser to `/api/upload-image`, which securely proxies the request to ImgBB (keeping the API key server-side), then returns a public URL that gets submitted as part of the form data (`property_image`, `photo`).

---

## 📌 Notes on Caching Strategy

| Data Type | Strategy | Reasoning |
|---|---|---|
| Properties, categories | `revalidate: 60`, tagged | Changes occasionally; short cache is fine |
| Rental requests, payment history | `cache: "no-store"` | Must always reflect real-time status (payments, approvals) |
| User profile (`getMe`) | `cache: "no-store"` | Must always reflect the currently logged-in user, never cached/shared across visitors |
| Reviews | Tagged (`property-reviews-:id`, `tenant-reviews`) | Revalidated on-demand via `revalidateTag` after a new review is submitted |

All mutating actions (`create`/`update`/`delete`) call `revalidateTag(...)` on success to invalidate the relevant cached reads, so the UI reflects changes without requiring a manual refresh.

---

## 📊 Flow Diagrams

### 📜 Sequence Diagram

This shows the same flow as a timeline of messages between the tenant, the platform, the landlord, the payment gateway, and the admin.

```mermaid
sequenceDiagram
    participant T as Tenant
    participant R as RentNest
    participant L as Landlord
    participant S as Stripe
    participant A as Admin

    T->>R: Browse properties (public, no login required)
    T->>R: View property details + reviews
    T->>R: Register / Login
    T->>L: Submit rental request (PENDING)
    L->>R: Review request (tenant profile, message, move-in date)
    L->>T: Approve request (status → APPROVED)
    T->>S: Pay Now → create checkout session
    S->>T: Payment successful → redirect to /success
    R->>R: Revalidate cache (payment history, rental requests)
    Note over T,L: Rental status becomes ACTIVE
    T->>R: Leave review (rating + comment)
    R->>A: Admin monitors all users, properties, and requests
    A->>R: Ban/unban users, manage categories
```

[⬆ Back to top](#api-integration--rentnest-frontend)

---

### 🌐 Website Flowchart

This is the full site-level flow, showing what each role can do after logging in, and how a rental request moves through its actual status lifecycle.

```mermaid
flowchart TD
    Start([Start]) --> Open[Open RentNest Website]
    Open --> Browse[Browse Properties — Public, No Login Needed]
    Browse --> AuthCheck{Logged In?}
    AuthCheck -->|No| Auth[Register / Login]
    Auth --> Role{User Role}
    AuthCheck -->|Yes| Role

    Role --> Tenant[Tenant Dashboard]
    Role --> Landlord[Landlord Dashboard]
    Role --> Admin[Admin Dashboard]

    Tenant --> T1[View Property Details]
    T1 --> T2[Submit Rental Request]
    T2 --> Pending[Status: PENDING]

    Landlord --> L1[Create / Edit / Delete Listing]
    Landlord --> L2[View Incoming Requests]
    L2 --> Pending

    Pending --> Decision{Landlord Decision}
    Decision -->|Reject| Rejected([Status: REJECTED])
    Decision -->|Approve| Approved[Status: APPROVED]

    Approved --> PayNow[Tenant: Pay Now Button Appears]
    PayNow --> Stripe[Stripe Checkout]
    Stripe --> Success[/success Page]
    Success --> Active[Status: ACTIVE]

    Active --> WriteReview[Tenant: Leave Review Button Appears]
    WriteReview --> Review[Submit Rating + Comment]
    Review --> Completed([Status: COMPLETED])

    Admin --> A1[Manage Users — Ban / Unban / Delete]
    Admin --> A2[Manage Categories — Create / Edit / Delete]
    Admin --> A3[Moderate All Properties]
    Admin --> A4[Moderate All Rental Requests]

    Completed --> End([End])
    Rejected --> End
```

[⬆ Back to top](#api-integration--rentnest-frontend)
