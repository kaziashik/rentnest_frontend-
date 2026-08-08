"use client"

import { useEffect, useState } from "react";
import { confirmPaymentSuccess } from "../_actions/confirmPaymentSuccess";

export function SuccessRevalidator() {
    const [confirming, setConfirming] = useState(true);

    useEffect(() => {
        let attempts = 0;
        const maxAttempts = 4;

        const runConfirm = async () => {
            await confirmPaymentSuccess();
            attempts++;

            if (attempts < maxAttempts) {
                setTimeout(runConfirm, 1500);
            } else {
                setConfirming(false);
            }
        };

        runConfirm();
    }, []);

    return confirming ? (
        <p className="text-xs text-muted-foreground">Confirming your payment...</p>
    ) : null;
}