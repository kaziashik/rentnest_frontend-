import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2Icon } from "lucide-react";
import { confirmPaymentSuccess } from "../../_actions/confirmPaymentSuccess";
import { PaymentSuccessStatus } from "./PaymentSuccessStatus";

type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function PaymentSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id ?? null;

  // Confirm immediately on the server so rent request becomes ACTIVE
  // even if the Stripe webhook never reaches Vercel.
  const confirmResult = sessionId
    ? await confirmPaymentSuccess(sessionId)
    : {
        success: true,
        confirmed: false,
        message: "Missing Stripe session id.",
      };

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-5 px-4 py-20 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
        <CheckCircle2Icon className="size-9" />
      </div>
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Payment successful
        </h1>
        <p className="text-muted-foreground">
          {confirmResult.confirmed
            ? "Your rent payment went through. The rental is now Active and the listing is Unavailable."
            : "Your Stripe payment went through. We are finishing the status update for your rental request."}
        </p>
      </div>

      <Suspense fallback={null}>
        <PaymentSuccessStatus
          initialConfirmed={confirmResult.confirmed}
          initialMessage={confirmResult.message}
          sessionId={sessionId}
        />
      </Suspense>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button asChild className="rounded-full">
          <Link href="/tenant-dashboard/payments" prefetch={false}>
            View payment history
          </Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/tenant-dashboard/requests" prefetch={false}>
            View my requests
          </Link>
        </Button>
      </div>
    </div>
  );
}
