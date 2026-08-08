import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchIcon, FileTextIcon, ArrowRightIcon } from "lucide-react";
import { getMyRentalRequests } from "../_actions/getMyRentalRequests";
import { SimpleBarChart, SimplePieChart } from "@/components/shared/DashboardCharts";
import { IRentalRequest } from "@/lib/types";

async function DashboardStats() {
  const result = await getMyRentalRequests();
  const requests: IRentalRequest[] = result.success ? result.data : [];

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;
  const approvedCount = requests.filter((r) => r.status === "APPROVED").length;
  const activeCount = requests.filter((r) => r.status === "ACTIVE").length;
  const completedCount = requests.filter((r) => r.status === "COMPLETED").length;
  const rejectedCount = requests.filter((r) => r.status === "REJECTED").length;

  return (
    <div className="space-y-6">
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Track requests, payments, and reviews from your tenant workspace.
          </p>
        </div>
        <Link href="/properties">
          <Button className="rounded-full">
            <SearchIcon data-icon="inline-start" />
            Browse Properties
          </Button>
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="h-64 animate-pulse rounded-2xl bg-muted" />
            <div className="h-64 animate-pulse rounded-2xl bg-muted" />
          </div>
        }
      >
        <DashboardStats />
      </Suspense>

      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent activity</CardTitle>
            <Link
              href="/tenant-dashboard/requests"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View all
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            <FileTextIcon className="mr-1 inline size-4" />
            Open My Requests for full status history, or Payments to settle approved rentals.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
