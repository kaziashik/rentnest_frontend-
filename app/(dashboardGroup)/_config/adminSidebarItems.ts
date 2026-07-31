import { ISidebarItem } from "@/lib/types";
import { LayoutDashboard, Users, Building2, ShieldCheck, User } from "lucide-react";

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
    href: "/",
    icon: Building2,
  },
];