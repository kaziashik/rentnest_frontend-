import { ISidebarItem } from "@/lib/types";
import { LayoutDashboard, Users, Building2, ShieldCheck } from "lucide-react";

export const ADMIN_SIDEBAR_ITEMS: ISidebarItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/admin-dashboard/users",
    icon: Users,
  },
   {
    label: "Properties",
    href: "/admin-dashboard/properties",
    icon: Building2,
  },
  {
    label: "Categories",
    href: "/admin-dashboard/categories",
    icon: ShieldCheck,
  },
];