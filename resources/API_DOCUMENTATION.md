# RentNest — API Documentation

Backend REST API for the RentNest rental property marketplace.

| | |
|---|---|
| **Base URL (production)** | `https://rentnestbackend.vercel.app` |
| **Base URL (local)** | `http://localhost:5000` |
| **Auth** | httpOnly cookies (`accessToken`, `refreshToken`) |
| **Postman** | [`RentNest.postman_collection.json`](./RentNest.postman_collection.json) |

---

## Response format

```json
{
  "success": true,
  "StatusCodes": 200,
  "message": "Human-readable description",
  "data": {},
  "meta": { "page": 1, "limit": 10, "total": 42 }
}
```

Errors use the same envelope with `success: false`.

---

## Roles

| Role | Access |
|------|--------|
| **TENANT** | Browse, request rentals, pay, review |
| **LANDLORD** | Manage own listings, approve/reject/complete requests |
| **ADMIN** | Users, categories, all properties & rentals, dashboard |

---

## Endpoints

### Authentication
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/users/register` | Public | Register TENANT or LANDLORD |
| `POST` | `/api/auth/login` | Public | Login — sets cookies |
| `POST` | `/api/auth/refresh-token` | Cookie | Refresh access token |
| `POST` | `/api/auth/logout` | Cookie | Clear session |

### Profile
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/users/me` | Any role | Current user profile |
| `PUT` | `/api/users/updateProfile` | Any role | Update name, phone, photo |

### Properties
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/properties` | Public | List/search properties |
| `GET` | `/api/properties/:propertyId` | Public | Property details |
| `GET` | `/api/properties/my-properties` | Landlord | Own listings |
| `POST` | `/api/properties/landlord` | Landlord | Create listing |
| `PUT` | `/api/properties/landlord/:id` | Landlord | Update listing |
| `DELETE` | `/api/properties/landlord/:id` | Landlord | Delete listing |

### Categories
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/categories` | Public | List categories |
| `POST` | `/api/categories` | Admin | Create category |
| `PUT` | `/api/categories/:id` | Admin | Update category |
| `DELETE` | `/api/categories/:id` | Admin | Delete category |

### Rental requests
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/rentals` | Tenant / Landlord / Admin | List requests (scoped by role) |
| `GET` | `/api/rentals/:requestId` | Tenant / Landlord / Admin | Request details |
| `POST` | `/api/rentals` | Tenant | Submit rental request |
| `PUT` | `/api/rentals/:id/status` | Landlord / Admin | Update status (`APPROVED`, `REJECTED`, `COMPLETED`, …) |

### Payments (Stripe)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/pay/create-checkout-session` | Tenant | Start Stripe Checkout |
| `POST` | `/api/pay/confirm-checkout-session` | Tenant | Confirm paid session |
| `GET` | `/api/pay` | Tenant | Payment history |
| `GET` | `/api/pay/:id` | Tenant / Landlord / Admin | Payment details |

### Reviews
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/review` | Tenant | Leave review (after COMPLETED) |
| `GET` | `/api/review/:propertyId` | Any | Reviews for a property |
| `GET` | `/api/review/tenant-reviews` | Any | Reviews by current tenant |

### Admin
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/admin/dashboard` | Admin | Platform metrics |
| `GET` | `/api/admin/allusers` | Admin | All users |
| `GET` | `/api/admin/user/:id` | Admin | Single user |
| `PATCH` | `/api/admin/user/:id/status` | Admin | Ban / unban (`ACTIVE` / `BANNED`) |
| `DELETE` | `/api/admin/user/:id` | Admin | Delete user |

### Contact
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/contact` | Public | Contact form submission |

---

## Rental lifecycle

```
AVAILABLE → request (PENDING) → landlord APPROVED (still AVAILABLE)
         → tenant pays → ACTIVE + property UNAVAILABLE
         → landlord COMPLETED → property AVAILABLE again
```

Landlord may also `REJECTED` a pending request (property stays AVAILABLE).

---

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Tenant | `tenant@rentnest.com` | `Tenant@123` |
| Landlord | `landlord@rentnest.com` | `Landlord@123` |
| Admin | `admin@rentnest.com` | `Admin@123` |

---

## Related files

- Full backend design doc (backend repo): `Resources/docs/RentNest_API_Design_Documentation.md`
- Frontend route ↔ API map: [`../API_INTEGRATION.md`](../API_INTEGRATION.md)
- Import Postman: [`RentNest.postman_collection.json`](./RentNest.postman_collection.json) — set `baseUrl` to production or local
