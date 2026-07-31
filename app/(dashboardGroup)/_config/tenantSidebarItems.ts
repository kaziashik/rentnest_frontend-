import { ISidebarItem } from "@/lib/types";
import {
  LayoutDashboard,
  Search,
  FileText,
  CreditCard,
  Star,
  User,
} from "lucide-react";

export const TENANT_SIDEBAR_ITEMS: ISidebarItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    href: "/tenant-dashboard/profile",
    icon: User,
  },
 
  {
    label: "My Requests",
    href: "/tenant-dashboard/requests",
    icon: FileText,
  },
  {
    label: "Payments",
    href: "/tenant-dashboard/payments",
    icon: CreditCard,
  },
  {
    label: "My Reviews",
    href: "/dashboard/reviews",
    icon: Star,
  },
   {
    label: "Rent a House",
    href: "/",
    icon: Search,
  },
];
