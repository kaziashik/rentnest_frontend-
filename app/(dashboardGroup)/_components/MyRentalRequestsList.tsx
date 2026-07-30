/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRentalRequest } from "@/lib/types";
import { getMyRentalRequests } from "../_actions/getMyRentalRequests";
import { MyRentalRequestCard } from "./MyRentalRequestCard";

export async function MyRentalRequestsList() {
  const result = await getMyRentalRequests();

  if (!result.success || !result.data?.length) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        You haven&apos;t made any rental requests yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {result.data.map((request: IRentalRequest | any) => (
        <MyRentalRequestCard key={request.id} request={request} />
      ))}
    </div>
  );
}