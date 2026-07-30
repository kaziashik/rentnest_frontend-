import { ISidebarItem } from "@/lib/types";
import { LayoutDashboard, Home, ListChecks } from "lucide-react";

export const LANDLORD_SIDEBAR_ITEMS: ISidebarItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard/landlord",
    icon: LayoutDashboard,
  },
  {
    label: "My Properties",
    href: "/landlord-dashboard/properties",
    icon: Home,
  },
  {
    label: "Requests",
    href: "/dashboard/landlord/requests",
    icon: ListChecks,
  },
];