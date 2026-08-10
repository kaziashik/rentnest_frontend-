import { LucideProps } from "lucide-react";


import { ForwardRefExoticComponent, RefAttributes } from "react";

// ---------- Enums ----------
export type IRole = "TENANT" | "LANDLORD" | "ADMIN";
export type IActiveStatus = "ACTIVE" | "BANNED";
export type IAvailability = "AVAILABLE" | "UNAVAILABLE";

export type IPaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";


// ---------- User ----------
export type IUser = {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    photo: string | null;
    activeStatus: string;
    createdAt: string;
    updatedAt: string;
  };
};


export type NavbarProps = {
    user: IUser
}


export type ISidebarItem = {
    label: string,
    href: string,
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
}






export interface IProperty {
    id: string;
    propertyOwnerId: string;
    categoryId: string;
    title: string;
    location: string;
    rentPrice: string;
    bedRooms: number;
    bathRooms: number;
    fetures: string[];
    availability: "AVAILABLE" | "UNAVAILABLE";
    property_image: string[];
    createdAt: string;
    updatedAt: string;
    category: {
        name: string;
    };
    propertyOwner: {
        name: string;
        email: string;
        phone: string;
    };
}



export interface ICategory {
    id: string;
    name: string;
}


export type IRentalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED";

export interface IRentalRequest {
    id: string;
    propertyId: string;
    tenantId: string;
    status: IRentalStatus;   
    moveInDate: string;
    message: string;
    createdAt: string;
    updatedAt: string;
    tenant: {
        id: string;
        name: string;
        email: string;
    };
    property: {
        id: string;
        title: string;
        location?: string;
        rentPrice: string;
        availability?: IAvailability;
        property_image?: string[] | null;
        propertyOwner?: {
            id?: string;
            name: string;
            email: string;
            phone?: string | null;
        };
    };
}






export type IRegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: IRole;
  phone: string;
};


export interface IAdminDashboard {
    users: {
        total: number;
        tenants: number;
        landlords: number;
    };
    properties: {
        total: number;
        available: number;
        rented: number;
    };
    rentalRequests: {
        total: number;
        pending: number;
        approved: number;
    };
    payments: {
        total: number;
        revenue: string;
    };
}


export type PaymentStatus = "PAID" | "PENDING" | "FAILED";

export interface IPayment {
    id: string;
    requestId: string;
    amount: string;
    paymentMethod: string;
    transactionId: string;
    paymentStatus: PaymentStatus;
    paidAt: string;
    createdAt: string;
    rentalRequest: {
        id: string;
        propertyId: string;
        tenantId: string;
        status: string;
        moveInDate: string;
        message: string;
        createdAt: string;
        updatedAt: string;
        property: {
            id: string;
            title: string;
            location: string;
            rentPrice: string;
            property_image?: string[] | null;
        };
    };
}




// ---------- User Data (plain object, used in lists/rows like Admin > Users) ----------
export interface IUserData {
  id: string;
  name: string;
  email: string;
  role: IRole;
  phone: string | null;
  photo: string | null;
  activeStatus: IActiveStatus;
  createdAt: string;
  updatedAt: string;
}


export interface IReview {
    id: string;
    propertyId: string;
    tenantId: string;
    requestId: string;
    rating: number;
    comment: string;
    createdAt: string;
    tenant: {
        name: string;
        photo: string | null;
    };
}


export interface IPropertyReviewsData {
    reviews: IReview[];
    totalCount: number;
    averageRating: number;
}


export interface IProfile {
    id: string;
    name: string;
    email: string;
    role: IRole;
    phone: string | null;
    photo: string | null;
    activeStatus: IActiveStatus;
    createdAt: string;
    updatedAt: string;
}


export interface IAdminDashboard {
    users: {
        total: number;
        tenants: number;
        landlords: number;
    };
    properties: {
        total: number;
        available: number;
        rented: number;
    };
    rentalRequests: {
        total: number;
        pending: number;
        approved: number;
    };
    payments: {
        total: number;
        revenue: string;
    };
}