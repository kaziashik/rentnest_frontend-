import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, ListChecksIcon, ArrowRightIcon } from "lucide-react";
import { getMyProperties } from "../_actions/getMyProperties";
import { getRentalRequests } from "../_actions/getRentalRequests";

async function LandlordStats() {
  const [propertiesResult, requestsResult] = await Promise.all([
    getMyProperties(),
    getRentalRequests(),
  ]);

  const properties = propertiesResult.success ? propertiesResult.data : [];
  const requests = requestsResult.success ? requestsResult.data : [];

  const availableCount = properties.filter((p: any) => p.availability === "AVAILABLE").length;
  const unavailableCount = properties.filter((p: any) => p.availability === "UNAVAILABLE").length;
  const pendingRequests = requests.filter((r: any) => r.status === "PENDING").length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{properties.length}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{availableCount}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{unavailableCount}</p>
        </CardContent>
      </Card>

      <Card>
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
  );
}

function LandlordStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  );
}

const landlordDashboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s an overview of your properties and requests.
          </p>
        </div>
        <Link href="/landlord-dashboard/properties/create">
          <Button>
            <PlusIcon data-icon="inline-start" />
            Add Property
          </Button>
        </Link>
      </div>

      <Suspense fallback={<LandlordStatsSkeleton />}>
        <LandlordStats />
      </Suspense>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Rental Requests</CardTitle>
            <Link href="/landlord-dashboard/properties/requests" className="flex items-center gap-1 text-sm text-primary hover:underline">
              View all
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            <ListChecksIcon className="mr-1 inline size-4" />
            Review and respond to tenant requests on the requests page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default landlordDashboardPage