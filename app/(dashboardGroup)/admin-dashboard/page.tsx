import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersIcon, HomeIcon, ListChecksIcon, DollarSignIcon } from "lucide-react";
import { getAdminDashboard } from "../_actions/getAdminDashboard";
import { IAdminDashboard } from "@/lib/types";
import { SimpleBarChart, SimplePieChart } from "@/components/shared/DashboardCharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { DashboardActionQueue } from "@/components/shared/DashboardActionQueue";

async function AdminStats() {
  const result = await getAdminDashboard();

  if (!result.success) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        Unable to load dashboard data.
      </p>
    );
  }

  const data: IAdminDashboard = result.data;

  const actions = [
    {
      title: "Pending rental requests",
      description: "Review open tenant requests across the platform",
      href: "/admin-dashboard/rentals",
      count: data.rentalRequests.pending,
      tone: "warning" as const,
    },
    {
      title: "Manage users",
      description: "Ban, unban, or review tenants and landlords",
      href: "/admin-dashboard/users",
      count: data.users.total,
    },
    {
      title: "All properties",
      description: "Inspect listings, owners, tenants, and availability",
      href: "/admin-dashboard/properties",
      count: data.properties.total,
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardActionQueue items={actions} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Users</CardTitle>
            <UsersIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-bold">{data.users.total}</p>
            <p className="text-xs text-muted-foreground">
              {data.users.tenants} tenants · {data.users.landlords} landlords
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Properties</CardTitle>
            <HomeIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-bold">{data.properties.total}</p>
            <p className="text-xs text-muted-foreground">
              {data.properties.available} available · {data.properties.rented} rented
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rental Requests
            </CardTitle>
            <ListChecksIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-bold">{data.rentalRequests.total}</p>
            <p className="text-xs text-muted-foreground">
              {data.rentalRequests.pending} pending · {data.rentalRequests.approved} approved
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
            <DollarSignIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-bold">
              RM {Number(data.payments.revenue).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">{data.payments.total} payments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SimpleBarChart
          title="Request pipeline"
          data={[
            { label: "Pending", value: data.rentalRequests.pending },
            { label: "Approved", value: data.rentalRequests.approved },
            { label: "Total", value: data.rentalRequests.total },
          ]}
        />
        <SimplePieChart
          title="User distribution"
          data={[
            { label: "Tenants", value: data.users.tenants, color: "oklch(0.5 0.1 195)" },
            { label: "Landlords", value: data.users.landlords, color: "oklch(0.72 0.12 75)" },
            {
              label: "Other",
              value: Math.max(
                0,
                data.users.total - data.users.tenants - data.users.landlords,
              ),
              color: "oklch(0.55 0.08 160)",
            },
          ]}
        />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Need categories?{" "}
        <Link href="/admin-dashboard/categories" className="font-medium text-primary hover:underline">
          Manage listing categories
        </Link>
      </p>
    </div>
  );
}

function AdminStatsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Platform overview — jump into queues that need action."
      />

      <Suspense fallback={<AdminStatsSkeleton />}>
        <AdminStats />
      </Suspense>
    </div>
  );
}
