import { SuccessRevalidator } from "./SuccessRevalidator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2Icon } from "lucide-react";

export default function PaymentSuccessPage() {
    return (
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
            <SuccessRevalidator />
            <CheckCircle2Icon className="size-16 text-green-500" />
            <h1 className="text-2xl font-semibold">Payment Successful</h1>
            <p className="text-muted-foreground">
                Your rent payment has been processed successfully.
            </p>
            <Link href="/tenant-dashboard/payments">
                <Button>View Payment History</Button>
            </Link>
        </div>
    );
}