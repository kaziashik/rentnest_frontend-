import Link from "next/link";
import RegisterForm from "../_components/RegisterForm";
import { HomeIcon } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      <div className="relative w-full max-w-md space-y-6 rounded-3xl border bg-card/95 p-8 shadow-xl backdrop-blur">
        <div className="space-y-3 text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <HomeIcon className="size-5" />
            </div>
          </Link>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Join RentNest as a tenant or landlord in minutes.
          </p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
