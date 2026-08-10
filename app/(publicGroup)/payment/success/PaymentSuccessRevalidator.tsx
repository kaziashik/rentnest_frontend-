"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { confirmPaymentSuccess } from "../../_actions/confirmPaymentSuccess";

export function PaymentSuccessRevalidator() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(true);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 4;
    let cancelled = false;

    const runConfirm = async () => {
      if (cancelled) return;
      await confirmPaymentSuccess();
      attempts += 1;
      router.refresh();

      if (attempts < maxAttempts) {
        setTimeout(runConfirm, 1500);
      } else if (!cancelled) {
        setConfirming(false);
      }
    };

    runConfirm();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return confirming ? (
    <p className="text-xs text-muted-foreground">
      Confirming payment and updating your rental status...
    </p>
  ) : (
    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
      Payment confirmed. Your rental is now Active.
    </p>
  );
}
