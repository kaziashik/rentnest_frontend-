import { ISidebarItem } from "@/lib/types";
import { TENANT_SIDEBAR_ITEMS } from "./tenantSidebarItems";
import { LANDLORD_SIDEBAR_ITEMS } from "./landlordSidebarItems";
import { ADMIN_SIDEBAR_ITEMS } from "./adminSidebarItems";

export const sidebarMenuItems = {
  TENANT: TENANT_SIDEBAR_ITEMS,
  LANDLORD: LANDLORD_SIDEBAR_ITEMS,
  ADMIN: ADMIN_SIDEBAR_ITEMS,
};