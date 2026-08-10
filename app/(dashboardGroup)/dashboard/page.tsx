import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchIcon } from "lucide-react";
import { getMyRentalRequests } from "../_actions/getMyRentalRequests";
import { SimpleBarChart, SimplePieChart } from "@/components/shared/DashboardCharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { DashboardActionQueue } from "@/components/shared/DashboardActionQueue";
import { IRentalRequest } from "@/lib/types";

async function DashboardStats() {
  const result = await getMyRentalRequests();
  const requests: IRentalRequest[] = result.success ? result.data : [];

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;
  const approvedCount = requests.filter((r) => r.status === "APPROVED").length;
  const activeCount = requests.filter((r) => r.status === "ACTIVE").length;
  const completedCount = requests.filter((r) => r.status === "COMPLETED").length;
  const rejectedCount = requests.filter((r) => r.status === "REJECTED").length;

  const actions = [
    {
      title: "Awaiting payment",
      description: "Approved requests ready for Stripe checkout",
      href: "/tenant-dashboard/payments",
      count: approvedCount,
      tone: "warning" as const,
    },
    {
      title: "My rental requests",
      description: "Track pending, active, and completed applications",
      href: "/tenant-dashboard/requests",
      count: requests.length,
    },
    {
      title: "Browse homes",
      description: "Find and request your next rental",
      href: "/properties",
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
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{requests.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{approvedCount}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{activeCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SimpleBarChart
          title="Requests by status"
          data={[
            { label: "Pending", value: pendingCount },
            { label: "Approved", value: approvedCount },
            { label: "Active", value: activeCount },
            { label: "Done", value: completedCount },
          ]}
        />
        <SimplePieChart
          title="Request mix"
          data={[
            { label: "Pending", value: pendingCount, color: "oklch(0.72 0.12 75)" },
            { label: "Approved", value: approvedCount, color: "oklch(0.5 0.1 195)" },
            { label: "Active", value: activeCount, color: "oklch(0.55 0.08 160)" },
            { label: "Rejected", value: rejectedCount, color: "oklch(0.55 0.2 25)" },
          ]}
        />
      </div>
    </div>
  );
}

export default function TenantDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back"
        description="Track requests, payments, and reviews from your tenant workspace."
        action={
          <Link href="/properties">
            <Button className="rounded-full">
              <SearchIcon data-icon="inline-start" />
              Browse Properties
            </Button>
          </Link>
        }
      />

      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="h-64 animate-pulse rounded-2xl bg-muted" />
              <div className="h-64 animate-pulse rounded-2xl bg-muted" />
            </div>
          </div>
        }
      >
        <DashboardStats />
      </Suspense>
    </div>
  );
}
