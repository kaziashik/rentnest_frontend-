import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircleIcon } from "lucide-react";

export default function PaymentCancelPage() {
    return (
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
            <XCircleIcon className="size-16 text-red-500" />
            <h1 className="text-2xl font-semibold">Payment Cancelled</h1>
            <p className="text-muted-foreground">
                Your payment was not completed. You can try again anytime.
            </p>
            <Link href="/tenant-dashboard/payments">
                <Button>Back to Payments</Button>
            </Link>
        </div>
    );
}