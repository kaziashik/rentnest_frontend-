import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersIcon, HomeIcon, ListChecksIcon, DollarSignIcon } from "lucide-react";
import { getAdminDashboard } from "../_actions/getAdminDashboard";
import { IAdminDashboard } from "@/lib/types";

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

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Users
          </CardTitle>
          <UsersIcon className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-2xl font-bold">{data.users.total}</p>
          <p className="text-xs text-muted-foreground">
            {data.users.tenants} tenants · {data.users.landlords} landlords
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Properties
          </CardTitle>
          <HomeIcon className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-2xl font-bold">{data.properties.total}</p>
          <p className="text-xs text-muted-foreground">
            {data.properties.available} available · {data.properties.rented} rented
          </p>
        </CardContent>
      </Card>

      <Card>
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Revenue
          </CardTitle>
          <DollarSignIcon className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-2xl font-bold">RM {Number(data.payments.revenue).toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">
            {data.payments.total} payments
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  );
}

const AdminDashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Platform-wide overview of users, properties, and revenue.
        </p>
      </div>

      <Suspense fallback={<AdminStatsSkeleton />}>
        <AdminStats />
      </Suspense>
    </div>
  );
}

export default AdminDashboardPage