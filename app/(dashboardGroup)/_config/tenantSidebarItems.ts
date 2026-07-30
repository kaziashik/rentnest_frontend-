import { ISidebarItem } from "@/lib/types";
import { LayoutDashboard, FileText, CreditCard } from "lucide-react";

export const TENANT_SIDEBAR_ITEMS: ISidebarItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard/tenant",
    icon: LayoutDashboard,
  },
  {
    label: "My Requests",
    href: "/dashboard/tenant/requests",
    icon: FileText,
  },
  {
    label: "Payments",
    href: "/dashboard/tenant/payments",
    icon: CreditCard,
  },
];