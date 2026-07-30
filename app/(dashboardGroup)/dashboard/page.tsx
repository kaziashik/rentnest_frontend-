import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchIcon, FileTextIcon, ArrowRightIcon } from "lucide-react";
import { getMyRentalRequests } from "../_actions/getMyRentalRequests";

async function DashboardStats() {
  const result = await getMyRentalRequests();
  const requests = result.success ? result.data : [];

  const activeCount = requests.filter((r: any) => r.status === "ACTIVE").length;
  const approvedCount = requests.filter((r: any) => r.status === "APPROVED").length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{requests.length}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Pending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{activeCount}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Approved
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{approvedCount}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TenantDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s an overview of your rental activity.
          </p>
        </div>
        <Link href="/">
          <Button>
            <SearchIcon data-icon="inline-start" />
            Browse Properties
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div className="h-24 animate-pulse rounded-2xl bg-muted" />}>
        <DashboardStats />
      </Suspense>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Requests</CardTitle>
            <Link href="/tenant-dashboard/requests" className="flex items-center gap-1 text-sm text-primary hover:underline">
              View all
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            <FileTextIcon className="mr-1 inline size-4" />
            Check your requests page to see full details and statuses.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}