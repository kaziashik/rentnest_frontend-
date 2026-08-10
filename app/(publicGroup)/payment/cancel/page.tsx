import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircleIcon } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-5 px-4 py-20 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-300">
        <XCircleIcon className="size-9" />
      </div>
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Payment cancelled
        </h1>
        <p className="text-muted-foreground">
          Checkout was not completed. Your request is still Approved — you can try
          paying again anytime.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button asChild className="rounded-full">
          <Link href="/tenant-dashboard/payments">Back to payments</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/tenant-dashboard/requests">My requests</Link>
        </Button>
      </div>
    </div>
  );
}
