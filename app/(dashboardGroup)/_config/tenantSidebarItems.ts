import { ISidebarItem } from "@/lib/types";
import { LayoutDashboard, Search, FileText, CreditCard, Star, User } from "lucide-react";

export const TENANT_SIDEBAR_ITEMS: ISidebarItem[] = [
  {
    label: "Dashboard",
    href: "/tenant-dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Browse Properties",
    href: "/tenant-dashboard/browse",
    icon: Search,
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
    href: "/tenant-dashboard/reviews",
    icon: Star,
  },
  {
    label: "Profile",
    href: "/tenant-dashboard/profile",
    icon: User,
  },
];