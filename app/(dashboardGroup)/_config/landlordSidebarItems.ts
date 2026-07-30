import { ISidebarItem } from "@/lib/types";
import { LayoutDashboard, Home, ListChecks, PlusCircle } from "lucide-react";

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
    label: "Add Property",
    href: "/landlord-dashboard/properties/create",
    icon: PlusCircle,
  },
  {
    label: "Requests",
    href: "/dashboard/landlord/requests",
    icon: ListChecks,
  },
];