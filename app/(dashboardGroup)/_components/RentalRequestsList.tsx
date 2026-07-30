
import { IRentalRequest } from "@/lib/types";
import { getRentalRequests } from "../_actions/getRentalRequests";
import { RentalRequestCard } from "./RentalRequestCard";

export async function RentalRequestsList() {
  const result = await getRentalRequests();

  if (!result.success || !result.data?.length) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        You don&apos;t have any rental requests yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {result.data.map((request: IRentalRequest | any) => (
        <RentalRequestCard key={request.id} request={request} />
      ))}
    </div>
  );
}