# RentNest — Full Workflow

![RentNest presentation poster](RentNest-poster.png)

RentNest is a rental marketplace. Visitors browse listings. A **tenant** requests a property, a **landlord** approves or rejects it, the tenant pays with Stripe, and an **admin** moderates users, categories, listings, and requests.

Roles in the database: `TENANT`, `LANDLORD`, `ADMIN`.
Registration only allows `TENANT` or `LANDLORD`. Admin accounts are created directly in the database.



## 1. One-look system flow

```mermaid
flowchart TD
    A["👀 Visitor opens the site"] --> B["🔍 Browse and filter properties"]
    B --> C["🏢 Open a property page"]
    C --> D{"🏠 Logged in as tenant?"}
    D -- No --> E["🔐 Register or login as TENANT"]
    E --> C
    D -- Yes --> F["📝 Submit rental request"]
    F --> G["⏳ Status PENDING"]
    G --> H{"🔑 Landlord decision"}
    H -- Reject --> I["❌ Status REJECTED"]
    I --> Z["🚫 Request closed"]
    H -- Approve --> J["✅ Status APPROVED"]
    J --> K["🔒 Property set to UNAVAILABLE"]
    K --> L["💳 Tenant pays with Stripe"]
    L --> M{"💳 Stripe webhook"}
    M -- Payment completed --> N["🟢 Payment PAID and status ACTIVE"]
    M -- Checkout cancelled --> O["✅ Stay APPROVED - tenant can pay again"]
    N --> P["🏁 Landlord or admin marks COMPLETED"]
    P --> Q["⭐ Tenant writes one review"]

    classDef visitor fill:#ede9fe,stroke:#7c3aed,color:#1e1b4b
    classDef tenant fill:#dbeafe,stroke:#2563eb,color:#1e3a8a
    classDef landlord fill:#dcfce7,stroke:#16a34a,color:#14532d
    classDef pay fill:#fef9c3,stroke:#ca8a04,color:#713f12
    class A,B,C visitor
    class D,E,F,Q tenant
    class H,P landlord
    class L,M,N,O pay
```

---

## 2. Rental status machine

These are the only transitions the API allows (`ALLOWED_TRANSITIONS` in the rental service). `REJECTED` and `COMPLETED` cannot move again.

```mermaid
stateDiagram-v2
    [*] --> PENDING
    state "⏳ PENDING" as PENDING
    state "✅ APPROVED" as APPROVED
    state "❌ REJECTED" as REJECTED
    state "🟢 ACTIVE" as ACTIVE
    state "🏁 COMPLETED" as COMPLETED
    PENDING --> APPROVED: 🔑 landlord or 🛡️ admin approves
    PENDING --> REJECTED: 🔑 landlord or 🛡️ admin rejects
    APPROVED --> ACTIVE: 💳 Stripe webhook after payment
    ACTIVE --> COMPLETED: 🔑 landlord or 🛡️ admin ends the rental
    REJECTED --> [*]
    COMPLETED --> [*]
```

What each status means:

| Status | Meaning | Who moves it |
|---|---|---|
| ⏳ `PENDING` | Request sent, waiting for a decision | Created by the tenant |
| ✅ `APPROVED` | Landlord accepted. Property is taken off the market | Landlord or admin |
| ❌ `REJECTED` | Landlord declined. Terminal | Landlord or admin |
| 🟢 `ACTIVE` | Stripe payment recorded. Tenant is renting | Stripe webhook (`checkout.session.completed`) |
| 🏁 `COMPLETED` | Rental finished. Review is now allowed | Landlord or admin |

Approving a request sets that property’s `availability` to `UNAVAILABLE`, so it cannot be requested again while the booking is open.

A tenant cannot submit a second request for the same property while one is already `PENDING`, `APPROVED`, or `ACTIVE`.

---

## 3. Public user flow

Anyone can use the public site without an account.

Pages: `/` (home and listings), `/propertiesDetails/[id]`, `/about`, `/services`, `/contact`, `/success`, `/cancel`.

```mermaid
flowchart TD
    A["👀 Open Home"] --> B["🔍 Search and filter listings"]
    B --> C["📍 Location, price, category, sort, page"]
    C --> D["🏢 Property cards"]
    D --> E["🏢 Property details"]
    E --> F["🖼️ Photos, price, owner contact, reviews"]
    F --> G{"🏠 Want to rent?"}
    G -- Not logged in --> H["🔐 Go to Register or Login"]
    G -- Logged in as tenant --> I["📝 Open Request Rental dialog"]
    I --> J["📅 Move-in date and message"]
    J --> K["📝 POST /api/rentals"]
    H --> L{"🔐 Choose role"}
    L -- Tenant --> M["🏠 Tenant dashboard after login"]
    L -- Landlord --> N["🔑 Landlord dashboard after login"]

    classDef visitor fill:#ede9fe,stroke:#7c3aed,color:#1e1b4b
    classDef tenant fill:#dbeafe,stroke:#2563eb,color:#1e3a8a
    classDef landlord fill:#dcfce7,stroke:#16a34a,color:#14532d
    class A,B,C,D,E,F visitor
    class G,I,J,K,M tenant
    class N landlord
```

Public property search uses `GET /api/properties` with `location`, `minPrice`, `maxPrice`, `category`, `sort` (`price_asc` / `price_desc`), `page`, and `limit`.

---

## 4. Shared account flow

Every logged-in person shares the same account steps. The navbar then sends them to the dashboard that matches their role.

```mermaid
flowchart TD
    A["🔐 Register"] --> B{"🔐 Role"}
    B -- TENANT or LANDLORD --> C["🔒 Password hashed, user ACTIVE"]
    B -- ADMIN --> X["🛡️ Rejected - admin cannot self-register"]
    C --> D["🔐 Login with email and password"]
    D --> E{"🚫 Account banned?"}
    E -- Yes --> F["🚫 Login blocked"]
    E -- No --> G["🍪 Access token and refresh token cookies"]
    G --> H{"🔐 Role"}
    H -- TENANT --> I["🏠 /dashboard"]
    H -- LANDLORD --> J["🔑 /landlord-dashboard"]
    H -- ADMIN --> K["🛡️ /admin-dashboard"]
    G --> L["👤 GET /api/users/me"]
    L --> M["✏️ Update own name, email, phone, or password"]
    G --> N["⏱️ Access token expired"]
    N --> O["🔄 POST /api/auth/refresh-token"]
    O --> G
    G --> P["🚪 Logout clears cookies"]

    classDef tenant fill:#dbeafe,stroke:#2563eb,color:#1e3a8a
    classDef landlord fill:#dcfce7,stroke:#16a34a,color:#14532d
    classDef admin fill:#ffedd5,stroke:#ea580c,color:#7c2d12
    classDef blocked fill:#fee2e2,stroke:#dc2626,color:#7f1d1d
    class I tenant
    class J landlord
    class K,X admin
    class E,F blocked
```

Dashboard pages require a valid session. If `GET /api/users/me` fails, the layout redirects to `/login`.

---

## 5. Tenant flow

Sidebar: Dashboard, Profile, My Requests, Payments, My Reviews, Rent a House.

```mermaid
flowchart TD
    A["🏠 Tenant dashboard"] --> B["🔍 Browse listings on Home"]
    B --> C["🏢 Open property details"]
    C --> D{"🏢 Property AVAILABLE?"}
    D -- No --> E["🚫 Request blocked"]
    D -- Yes --> F{"📝 Already have PENDING, APPROVED, or ACTIVE request?"}
    F -- Yes --> E
    F -- No --> G["📝 Submit request with move-in date and message"]
    G --> H["⏳ Status PENDING"]
    H --> I["📝 My Requests page"]
    I --> J{"🔑 Landlord response"}
    J -- REJECTED --> K["❌ Request closed - pick another property"]
    J -- APPROVED --> L["💳 Pay Now"]
    L --> M["💳 Stripe Checkout"]
    M --> N{"💳 Result"}
    N -- Cancel --> O["↩️ /cancel - still APPROVED"]
    O --> L
    N -- Success --> P["✅ /success"]
    P --> Q["🟢 Webhook writes Payment PAID"]
    Q --> R["🟢 Status becomes ACTIVE"]
    R --> S["💳 Payments page shows history"]
    R --> T["🏁 Landlord or admin marks COMPLETED"]
    T --> U["⭐ Write one review, rating 1 to 5"]
    U --> V["⭐ My Reviews"]

    classDef tenant fill:#dbeafe,stroke:#2563eb,color:#1e3a8a
    classDef landlord fill:#dcfce7,stroke:#16a34a,color:#14532d
    classDef pay fill:#fef9c3,stroke:#ca8a04,color:#713f12
    classDef blocked fill:#fee2e2,stroke:#dc2626,color:#7f1d1d
    class A,B,C,F,G,H,I,U,V tenant
    class J,T landlord
    class L,M,N,O,P,Q,S pay
    class E,K blocked
```

Tenant rules from the API:

- Can only pay a request that is `APPROVED` and that they submitted.
- Checkout amount is the property `rentPrice` in USD cents.
- A review is allowed only when the request is `COMPLETED`, the request belongs to that tenant, and that request has no review yet.
- One review per rental request, and one review per tenant per property.

### Tenant payment sequence

```mermaid
sequenceDiagram
    participant T as 🏠 Tenant
    participant Web as 💻 Next.js app
    participant API as ⚙️ RentNest API
    participant S as 💳 Stripe
    participant DB as 🗄️ PostgreSQL

    T->>Web: 💳 Pay Now on an APPROVED request
    Web->>API: POST /api/pay/create-checkout-session
    API->>DB: Load request and confirm tenant plus APPROVED
    API->>S: Create Checkout session with requestId
    S-->>Web: checkout URL
    Web->>S: Redirect tenant to pay
    alt Payment succeeds
        S->>API: POST /api/subscription/webhook
        API->>API: Verify Stripe signature
        API->>DB: Create Payment PAID and set request ACTIVE
        S-->>Web: Redirect to /success
    else Payment cancelled
        S-->>Web: Redirect to /cancel
        Note over DB: Request stays APPROVED
    end
```

---

## 6. Landlord flow

The landlord is the property owner. Sidebar: Dashboard, Profile, My Properties, Add Property, Rent Requests.

```mermaid
flowchart TD
    A["🔑 Landlord dashboard"] --> B["➕ Create a listing"]
    B --> C["🏢 Title, location, category, rent, rooms, features, images"]
    C --> D["🟢 Availability starts as AVAILABLE"]
    D --> E["🏢 My Properties"]
    E --> F["✏️ Edit or delete own listing"]
    D --> G["🏠 Tenant submits a request"]
    G --> H["📝 Rent Requests page"]
    H --> I{"🔑 Decision"}
    I -- Reject --> J["❌ Status REJECTED"]
    I -- Approve --> K["✅ Status APPROVED"]
    K --> L["🔒 Property becomes UNAVAILABLE"]
    L --> M["💳 Tenant pays"]
    M --> N["🟢 Webhook sets ACTIVE"]
    N --> O["🏁 Landlord marks COMPLETED when the stay ends"]
    O --> P["⭐ Tenant may leave a review on the listing"]

    classDef tenant fill:#dbeafe,stroke:#2563eb,color:#1e3a8a
    classDef landlord fill:#dcfce7,stroke:#16a34a,color:#14532d
    classDef pay fill:#fef9c3,stroke:#ca8a04,color:#713f12
    class A,B,C,D,E,F,H,I,O landlord
    class G,P tenant
    class M,N pay
```

A landlord only sees requests for properties they own. Updating another landlord’s request fails the ownership check.

Landlord property routes:

| Action | Route |
|---|---|
| Create listing | `POST /api/properties/landlord` |
| Update own listing | `PUT /api/properties/landlord/:id` |
| Delete own listing | `DELETE /api/properties/landlord/:id` |
| List own listings | `GET /api/properties/my-properties` |
| Change request status | `PUT /api/rentals/:id/status` |

---

## 7. Admin flow

Admin accounts are not created from the register form. Sidebar: Dashboard, Profile, Users, Categories, All Properties, Rental Requests.

```mermaid
flowchart TD
    A["🛡️ Admin login"] --> B["📊 Admin dashboard"]
    B --> C["📊 Counts of users, properties, requests, and revenue"]
    B --> D["👥 Users"]
    D --> E{"🛡️ Action"}
    E -- Ban --> F["🚫 activeStatus BANNED - login blocked"]
    E -- Unban --> G["🟢 activeStatus ACTIVE"]
    E -- Delete --> H["🗑️ Remove the user account"]
    B --> I["🗂️ Categories"]
    I --> J["✏️ Create, rename, or delete a category"]
    J --> K["🚫 Delete fails if properties still use it"]
    B --> L["🏢 All properties"]
    B --> M["📝 All rental requests"]
    M --> N["🔑 Same status rules as a landlord"]
    N --> O["⏳ PENDING to APPROVED or REJECTED"]
    N --> P["✅ APPROVED to ACTIVE"]
    N --> Q["🏁 ACTIVE to COMPLETED"]
    B --> R["💳 Open a single payment if needed"]

    classDef admin fill:#ffedd5,stroke:#ea580c,color:#7c2d12
    classDef blocked fill:#fee2e2,stroke:#dc2626,color:#7f1d1d
    class A,B,C,D,E,I,J,L,M,N,R admin
    class F,H,K blocked
```

Admin dashboard numbers come from `GET /api/admin/dashboard`:

- Users: total, tenants, landlords
- Properties: total, available, rented (`UNAVAILABLE`)
- Requests: total, pending, approved
- Payments: count, and sum of amounts where status is `PAID`

```mermaid
flowchart LR
    A["🛡️ Admin"] --> B["👥 All users"]
    A --> C["🚫 Ban or unban"]
    A --> D["🗑️ Delete user"]
    A --> E["🗂️ Categories"]
    A --> F["🏢 All properties"]
    A --> G["📝 All rental requests"]
    A --> H["📊 Dashboard metrics"]
    A --> I["💳 Payment details"]

    classDef admin fill:#ffedd5,stroke:#ea580c,color:#7c2d12
    class A,B,C,D,E,F,G,H,I admin
```

---

## 8. How the three roles meet on one rental

```mermaid
sequenceDiagram
    participant V as 👀 Visitor
    participant T as 🏠 Tenant
    participant L as 🔑 Landlord
    participant A as 🛡️ Admin
    participant API as ⚙️ API
    participant S as 💳 Stripe

    V->>API: 🔍 Browse properties
    T->>API: 📝 Register and submit rental request
    API-->>L: Request appears on Rent Requests
    alt Landlord approves
        L->>API: ✅ Set APPROVED
        API-->>API: 🔒 Property UNAVAILABLE
        T->>API: 💳 Start checkout
        API->>S: Checkout session
        S->>API: Webhook payment completed
        API-->>T: 🟢 Request is ACTIVE
        L->>API: 🏁 Set COMPLETED
        T->>API: ⭐ Post review
    else Landlord rejects
        L->>API: ❌ Set REJECTED
    else Dispute or manual step
        A->>API: 🚫 Ban a user, or move status along the same allowed path
    end
```

---

## 9. Data model

```mermaid
erDiagram
    USER ||--o{ PROPERTY : "owns as landlord"
    USER ||--o{ RENTAL_REQUEST : "submits as tenant"
    USER ||--o{ REVIEW : "writes as tenant"
    CATEGORY ||--o{ PROPERTY : classifies
    PROPERTY ||--o{ RENTAL_REQUEST : receives
    PROPERTY ||--o{ REVIEW : has
    RENTAL_REQUEST ||--o| PAYMENT : "paid by"
    RENTAL_REQUEST ||--o| REVIEW : "reviewed after COMPLETED"

    USER {
        string id PK
        string name
        string email UK
        string password
        enum role "TENANT | LANDLORD | ADMIN"
        enum activeStatus "ACTIVE | BANNED"
        string phone
        string photo
    }

    CATEGORY {
        string id PK
        string name UK
        string description
    }

    PROPERTY {
        string id PK
        string propertyOwnerId FK
        string categoryId FK
        string title
        string location
        decimal rentPrice
        int bedRooms
        int bathRooms
        enum availability "AVAILABLE | UNAVAILABLE"
    }

    RENTAL_REQUEST {
        string id PK
        string propertyId FK
        string tenantId FK
        enum status "PENDING | APPROVED | REJECTED | ACTIVE | COMPLETED"
        datetime moveInDate
        string message
    }

    PAYMENT {
        string id PK
        string requestId FK "unique"
        decimal amount
        string transactionId UK
        enum paymentStatus "PENDING | PAID | FAILED"
        datetime paidAt
    }

    REVIEW {
        string id PK
        string propertyId FK
        string tenantId FK
        string requestId FK "unique"
        int rating "1 to 5"
        string comment
    }
```

---

## 10. Where each role can go

| Step | 👀 Public visitor | 🏠 Tenant | 🔑 Landlord | 🛡️ Admin |
|---|:---:|:---:|:---:|:---:|
| Browse and search listings | Yes | Yes | Yes | Yes |
| Register from the site | Yes, as tenant or landlord | — | — | No |
| Submit a rental request | No | Yes | No | No |
| Approve or reject a request | No | No | Own properties | Any request |
| Pay with Stripe | No | Own approved request | No | No |
| Mark a rental completed | No | No | Own properties | Any request |
| Write a review | No | After COMPLETED | No | No |
| Create and edit listings | No | No | Own listings | Can use landlord routes |
| Ban or delete users | No | No | No | Yes |
| Manage categories | No | No | No | Yes |
| See platform revenue | No | No | No | Yes |

---

## 11. Screen map

```mermaid
flowchart LR
    subgraph pub ["👀 Public"]
        Home["🏠 / listings"]
        Details["🏢 /propertiesDetails/id"]
        About["ℹ️ /about"]
        Services["🛠️ /services"]
        Contact["✉️ /contact"]
        Success["✅ /success"]
        Cancel["↩️ /cancel"]
    end

    subgraph auth ["🔐 Auth"]
        Login["🔐 /login"]
        Register["📝 /register"]
    end

    subgraph tenant ["🏠 Tenant"]
        TD["📊 /dashboard"]
        TP["👤 /tenant-dashboard/profile"]
        TR["📝 /tenant-dashboard/requests"]
        TPay["💳 /tenant-dashboard/payments"]
        TRev["⭐ /dashboard/reviews"]
    end

    subgraph landlord ["🔑 Landlord"]
        LD["📊 /landlord-dashboard"]
        LP["👤 /landlord-dashboard/profile"]
        LList["🏢 /landlord-dashboard/properties"]
        LAdd["➕ /landlord-dashboard/properties/create"]
        LReq["📝 /landlord-dashboard/properties/requests"]
    end

    subgraph admin ["🛡️ Admin"]
        AD["📊 /admin-dashboard"]
        AP["👤 /admin-dashboard/profile"]
        AU["👥 /admin-dashboard/users"]
        AC["🗂️ /admin-dashboard/categories"]
        AProp["🏢 /admin-dashboard/properties"]
        AR["📝 /admin-dashboard/rentals"]
    end

    Home --> Details
    Details --> Login
    Register --> Login
    Login --> TD
    Login --> LD
    Login --> AD
    Details --> Success
    Details --> Cancel

    style pub fill:#ede9fe,stroke:#7c3aed,color:#1e1b4b
    style auth fill:#f1f5f9,stroke:#475569,color:#0f172a
    style tenant fill:#dbeafe,stroke:#2563eb,color:#1e3a8a
    style landlord fill:#dcfce7,stroke:#16a34a,color:#14532d
    style admin fill:#ffedd5,stroke:#ea580c,color:#7c2d12
```

Open this file in a Markdown preview that supports Mermaid (Cursor, GitHub, or VS Code with a Mermaid extension) to see the diagrams rendered.
