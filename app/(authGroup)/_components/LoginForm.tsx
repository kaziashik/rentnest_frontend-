"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { loginAction } from "../_actions/authAction";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

const DEMO_ACCOUNTS = [
  {
    role: "Tenant",
    description: "Browse & request rentals",
    email: process.env.NEXT_PUBLIC_DEMO_TENANT_EMAIL || "tenant@rentnest.com",
    password: process.env.NEXT_PUBLIC_DEMO_TENANT_PASSWORD || "Tenant@123",
  },
  {
    role: "Landlord",
    description: "List & manage properties",
    email: process.env.NEXT_PUBLIC_DEMO_LANDLORD_EMAIL || "landlord@rentnest.com",
    password: process.env.NEXT_PUBLIC_DEMO_LANDLORD_PASSWORD || "Landlord@123",
  },
  {
    role: "Admin",
    description: "Oversee users & listings",
    email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL || "admin@rentnest.com",
    password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || "Admin@123",
  },
];

const LoginForm = () => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "";
  const [state, action, pending] = useActionState(
    loginAction.bind(null, redirectTo),
    false,
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [demoPending, setDemoPending] = useState<string | null>(null);

  useEffect(() => {
    if (!state) return;
    if (!state.success) {
      setDemoPending(null);
      toast.error(state.message || "Login failed");
    }
  }, [state]);

  const validate = () => {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email";
    if (!password) next.password = "Password is required";
    else if (password.length < 6) next.password = "Password must be at least 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-primary/20 bg-muted/50 p-4">
        <p className="mb-3 text-center text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Quick demo access
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {DEMO_ACCOUNTS.map((account) => (
            <form
              key={account.role}
              action={action}
              onSubmit={() => setDemoPending(account.role)}
            >
              <input type="hidden" name="email" value={account.email} />
              <input type="hidden" name="password" value={account.password} />
              <button
                type="submit"
                disabled={pending}
                className="flex h-full w-full flex-col items-start gap-0.5 rounded-xl border border-primary/25 bg-card px-3 py-3 text-left transition hover:border-primary/50 hover:bg-primary/5 disabled:opacity-60"
              >
                <span className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {demoPending === account.role && pending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : null}
                  {account.role}
                </span>
                <span className="text-[11px] leading-snug text-muted-foreground">
                  {account.description}
                </span>
              </button>
            </form>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or sign in with email</span>
        </div>
      </div>

      <form
        action={action}
        className="space-y-4"
        onSubmit={(e) => {
          setDemoPending(null);
          if (!validate()) e.preventDefault();
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(errors.email)}
            required
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(errors.password)}
            required
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>

        <Button type="submit" className="w-full rounded-full" disabled={pending}>
          {pending && !demoPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
