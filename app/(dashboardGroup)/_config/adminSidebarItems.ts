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
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    label: "Properties",
    href: "/dashboard/admin/properties",
    icon: Building2,
  },
  {
    label: "Categories",
    href: "/admin-dashboard/categories",
    icon: ShieldCheck,
  },
];