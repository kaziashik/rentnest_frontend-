"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmPaymentSuccess } from "../../_actions/confirmPaymentSuccess";

export function PaymentSuccessStatus() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"confirming" | "done" | "error">(
    "confirming",
  );
  const [message, setMessage] = useState(
    "Confirming payment and updating your rental status...",
  );

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 6;

    const runConfirm = async () => {
      if (cancelled) return;

      const result = await confirmPaymentSuccess(sessionId);
      attempts += 1;

      if (cancelled) return;

      if (result.confirmed) {
        setStatus("done");
        setMessage("Payment confirmed. Your rental is now Active.");
        router.refresh();
        return;
      }

      if (attempts < maxAttempts) {
        setMessage(result.message || "Waiting for Stripe confirmation...");
        setTimeout(runConfirm, 1500);
      } else {
        setStatus("error");
        setMessage(
          result.message ||
            "Payment may still be processing. Refresh payments in a moment.",
        );
        router.refresh();
      }
    };

    runConfirm();
    return () => {
      cancelled = true;
    };
  }, [router, sessionId]);

  if (status === "done") {
    return (
      <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
        {message}
      </p>
    );
  }

  if (status === "error") {
    return <p className="text-xs font-medium text-amber-700">{message}</p>;
  }

  return <p className="text-xs text-muted-foreground">{message}</p>;
}
