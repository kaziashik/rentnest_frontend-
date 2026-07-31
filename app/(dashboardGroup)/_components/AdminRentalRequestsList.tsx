import { IRentalRequest } from "@/lib/types";
import { getAllRentalRequests } from "../_actions/getAllRentalRequests";
import { AdminRentalRequestRow } from "./AdminRentalRequestRow";

export async function AdminRentalRequestsList() {
  const result = await getAllRentalRequests();

  if (!result.success || !result.data?.length) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No rental requests found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {result.data.map((request: IRentalRequest) => (
        <AdminRentalRequestRow key={request.id} request={request} />
      ))}
    </div>
  );
}