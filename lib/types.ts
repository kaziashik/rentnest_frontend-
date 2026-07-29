// import { LucideProps } from "lucide-react";
// import { ForwardRefExoticComponent, RefAttributes } from "react";

// ---------- Enums ----------
export type IRole = "TENANT" | "LANDLORD" | "ADMIN";
export type IActiveStatus = "ACTIVE" | "BANNED";
export type IAvailability = "AVAILABLE" | "UNAVAILABLE";
export type IRentalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED";
export type IPaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";


// ---------- User ----------
export type IUser = {
  id: string;
  name: string;
  email: string;
  role: IRole;
  phone: string;
  photo: string | null;
  activeStatus: IActiveStatus;
  createdAt: string;
  updatedAt: string;
};

export type IRegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: IRole;
  phone: string;
};

export type ILoginPayload = {
  email: string;
  password: string;
};

export type IUpdateProfilePayload = {
  name?: string;
  phone?: string;
};

// ---------- Category ----------
export type ICategory = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type ICategoryPayload = {
  name?: string;
  description?: string;
};


///Property

export type ICategorySummary = {
  name: string;
};

export type IPropertyOwnerSummary = {
  name: string;
  email: string;
  phone: string;
};

export type IProperty = {
  id: string;
  propertyOwnerId: string;
  categoryId: string;
  title: string;
  location: string;
  rentPrice: string;
  bedRooms: number;
  bathRooms: number;
  fetures: string[];
  availability: IAvailability;
  property_image: string[];
  createdAt: string;
  updatedAt: string;
  category?: ICategorySummary;
  propertyOwner?: IPropertyOwnerSummary;
};

export type IPropertyPayload = {
  title: string;
  location: string;
  categoryId: string;
  rentPrice: number;
  bedRooms: number;
  bathRooms: number;
  fetures: string[];
  availability: IAvailability;
  property_image: string[];
};

// query params for GET /api/properties
export type IPropertyFilters = {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  sort?: "price_asc" | "price_desc";
  page?: number;
  limit?: number;
};

// ---------- Rental Request ----------
export type IRentalRequest = {
  id: string;
  propertyId: string;
  property?: IProperty;
  tenantId: string;
  tenant?: IUser;
  message: string;
  moveInDate: string;
  status: IRentalStatus;
  createdAt: string;
  updatedAt: string;
};

export type IRentalRequestPayload = {
  propertyId: string;
  message: string;
  moveInDate: string;
};

export type IRentalStatusPayload = {
  status: IRentalStatus;
};

// ---------- Payment ----------
export type IPayment = {
  id: string;
  requestId: string;
  request?: IRentalRequest;
  tenantId: string;
  amount: number;
  status: IPaymentStatus;
  sessionUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type ICreateCheckoutPayload = {
  requestId: string;
};

export type ICheckoutSessionResponse = {
  url: string;
};

// ---------- Review ----------
export type IReview = {
  id: string;
  propertyId: string;
  tenantId: string;
  tenant?: IUser;
  requestId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type IReviewPayload = {
  propertyId: string;
  requestId: string;
  rating: number;
  comment: string;
};

// ---------- Admin ----------
export type IAdminDashboardStats = {
  totalUsers: number;
  totalTenants: number;
  totalLandlords: number;
  totalProperties: number;
  totalRentalRequests: number;
  pendingRentalRequests: number;
  totalPayments: number;
};

export type IUserStatusPayload = {
  activeStatus: IActiveStatus;
};

// ---------- UI / Component Props ----------
export type NavbarProps = {
  user: IUser | null;
};

// export type ISidebarItem = {
//   label: string;
//   href: string;
//   icon: ForwardRefExoticComponent
//     Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
// };