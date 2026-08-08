import { redirect } from "next/navigation";

/** Tenant overview lives at /dashboard — keep this route as a convenience redirect. */
export default function TenantDashboardIndexPage() {
  redirect("/dashboard");
}
