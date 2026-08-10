import Link from "next/link";
import RegisterForm from "../_components/RegisterForm";
import { ArrowLeft, HomeIcon } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

      <Link
        href="/"
        className="absolute top-5 left-5 z-10 inline-flex items-center gap-2 rounded-full border bg-card/90 px-3.5 py-2 text-sm font-medium text-foreground backdrop-blur transition hover:bg-card"
      >
        <ArrowLeft className="size-4" />
        Back to home
      </Link>

      <div className="relative w-full max-w-md space-y-6 rounded-3xl border bg-card/95 p-8 backdrop-blur">
        <div className="space-y-3 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 transition hover:opacity-90"
            aria-label="Go to RentNest home"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <HomeIcon className="size-5" />
            </div>
            <span className="font-display text-2xl font-semibold tracking-tight text-primary">
              RentNest
            </span>
          </Link>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Join RentNest as a tenant or landlord in minutes.
          </p>
        </div>
        <RegisterForm />
        <div className="space-y-3 text-center text-sm text-muted-foreground">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
          >
            <HomeIcon className="size-3.5" />
            Continue browsing without signing in
          </Link>
        </div>
      </div>
    </div>
  );
}
