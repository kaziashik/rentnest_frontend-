"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main
      role="alert"
      className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center"
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangleIcon
          className="size-8 text-destructive"
          aria-hidden="true"
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Something went wrong!
        </h2>

        <p className="max-w-md text-sm text-muted-foreground">
          We encountered an unexpected error while loading this page.
          Please try again or return to the homepage.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={() => reset()}>
          Try again
        </Button>

        <Button variant="outline" asChild>
          <Link href="/">
            Go Home
          </Link>
        </Button>
      </div>
    </main>
  );
}