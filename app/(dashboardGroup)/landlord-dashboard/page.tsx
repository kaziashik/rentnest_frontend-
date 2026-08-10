import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { getMyProperties } from "../_actions/getMyProperties";
import { getRentalRequests } from "../_actions/getRentalRequests";
import { SimpleBarChart, SimplePieChart } from "@/components/shared/DashboardCharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { DashboardActionQueue } from "@/components/shared/DashboardActionQueue";
import { IProperty, IRentalRequest } from "@/lib/types";

async function LandlordStats() {
  const [propertiesResult, requestsResult] = await Promise.all([
    getMyProperties(),
    getRentalRequests(),
  ]);

  const properties: IProperty[] = propertiesResult.success ? propertiesResult.data : [];
  const requests: IRentalRequest[] = requestsResult.success ? requestsResult.data : [];

  const availableCount = properties.filter((p) => p.availability === "AVAILABLE").length;
  const unavailableCount = properties.filter((p) => p.availability === "UNAVAILABLE").length;
  const pendingRequests = requests.filter((r) => r.status === "PENDING").length;
  const approvedRequests = requests.filter((r) => r.status === "APPROVED").length;
  const activeRequests = requests.filter((r) => r.status === "ACTIVE").length;

  const actions = [
    {
      title: "Pending tenant requests",
      description: "Approve or reject new rental applications",
      href: "/landlord-dashboard/properties/requests",
      count: pendingRequests,
      tone: "warning" as const,
    },
    {
      title: "My properties",
      description: "Edit listings, photos, and availability",
      href: "/landlord-dashboard/properties",
      count: properties.length,
    },
    {
      title: "Add a listing",
      description: "Create a new property for tenants to find",
      href: "/landlord-dashboard/properties/create",
      tone: "success" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardActionQueue items={actions} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{properties.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{availableCount}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unavailable</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{unavailableCount}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pendingRequests}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SimpleBarChart
          title="Incoming requests"
          data={[
            { label: "Pending", value: pendingRequests },
            { label: "Approved", value: approvedRequests },
            { label: "Active", value: activeRequests },
            { label: "Total", value: requests.length },
          ]}
        />
        <SimplePieChart
          title="Property availability"
          data={[
            { label: "Available", value: availableCount, color: "oklch(0.5 0.1 195)" },
            { label: "Unavailable", value: unavailableCount, color: "oklch(0.72 0.12 75)" },
          ]}
        />
      </div>
    </div>
  );
}

function LandlordStatsSkeleton() {
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
    </div>
  );
}

export default function LandlordDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back"
        description="Manage listings, approve tenants, and track rental activity."
        action={
          <Link href="/landlord-dashboard/properties/create">
            <Button className="rounded-full">
              <PlusIcon data-icon="inline-start" />
              Add Property
            </Button>
          </Link>
        }
      />

      <Suspense fallback={<LandlordStatsSkeleton />}>
        <LandlordStats />
      </Suspense>
    </div>
  );
}
