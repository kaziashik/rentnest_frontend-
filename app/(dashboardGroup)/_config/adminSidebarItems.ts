import { ISidebarItem } from "@/lib/types";
import { LayoutDashboard, Users, Building2, ShieldCheck, User, ListChecks } from "lucide-react";

export const ADMIN_SIDEBAR_ITEMS: ISidebarItem[] = [
  {
    label: "Dashboard",
    href: "/admin-dashboard",
    icon: LayoutDashboard,
  },
   {
    label: "Profile",
    href: "/admin-dashboard/profile",
    icon: User,
  },
  {
    label: "Users",
    href: "/admin-dashboard/users",
    icon: Users,
  },
 
  {
    label: "Categories",
    href: "/admin-dashboard/categories",
    icon: ShieldCheck,
  },

    {
    label: "All Properties",
    href: "/admin-dashboard/properties",
    icon: Building2,
},
{
    label: "Rental Requests",
    href: "/admin-dashboard/rentals",
    icon: ListChecks,
},
];