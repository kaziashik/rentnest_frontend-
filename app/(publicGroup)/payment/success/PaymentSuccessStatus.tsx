"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { confirmPaymentSuccess } from "../../_actions/confirmPaymentSuccess";

type PaymentSuccessStatusProps = {
  sessionId: string | null;
  initialConfirmed: boolean;
  initialMessage: string;
};

export function PaymentSuccessStatus({
  sessionId,
  initialConfirmed,
  initialMessage,
}: PaymentSuccessStatusProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"confirming" | "done" | "error">(
    initialConfirmed ? "done" : sessionId ? "confirming" : "error",
  );
  const [message, setMessage] = useState(initialMessage);

  useEffect(() => {
    if (initialConfirmed || !sessionId) {
      router.refresh();
      return;
    }

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 5;

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
  }, [initialConfirmed, router, sessionId]);

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
