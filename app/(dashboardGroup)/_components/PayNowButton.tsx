"use client"

import { Button } from "@/components/ui/button";
import { CreditCardIcon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { createCheckoutSession } from "../_actions/paymentActions";

type PayNowButtonProps = {
    requestId: string;
}

export function PayNowButton({ requestId }: PayNowButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handlePay = () => {
        startTransition(async () => {
            const result = await createCheckoutSession(requestId);
            if (result && !result.success) {
                toast.error(result.message || "Unable to start checkout");
            }
        });
    };

    return (
        <Button size="sm" onClick={handlePay} disabled={isPending}>
            <CreditCardIcon data-icon="inline-start" />
            {isPending ? "Redirecting..." : "Pay Now"}
        </Button>
    )
}