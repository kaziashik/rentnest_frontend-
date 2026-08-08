import { ISidebarItem } from "@/lib/types";
import { LayoutDashboard, Home, ListChecks, PlusCircle, User } from "lucide-react";

export const LANDLORD_SIDEBAR_ITEMS: ISidebarItem[] = [
   {
    label: "Dashboard",
    href: "/landlord-dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    href: "/landlord-dashboard/profile",
    icon: User,
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
    label: " Rent Requests",
    href: "/landlord-dashboard/properties/requests",
    icon: ListChecks,
  },
];