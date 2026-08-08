import Link from "next/link";
import { HomeIcon, ShieldCheckIcon, UsersIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: HomeIcon,
    title: "Wide selection",
    description:
      "Browse rooms, apartments, houses, and studios across Malaysia’s major cities with clear pricing.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Verified landlords",
    description:
      "Every listing is tied to a landlord account — request, approve, and pay with a transparent trail.",
  },
  {
    icon: UsersIcon,
    title: "Built for every role",
    description:
      "Tenants, landlords, and admins each get a focused dashboard with the tools that matter.",
  },
  {
    icon: SparklesIcon,
    title: "Simple & secure",
    description:
      "Stripe Checkout handles rent payments after approval — no cash handovers, fewer disputes.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-page space-y-16 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">About</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          About RentNest
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          RentNest connects tenants and landlords across Malaysia, making it simple to find a
          place to call home — or to list a property with confidence. We focus on clarity at every
          step: browse, request, approve, pay, and review.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {values.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="space-y-2 rounded-2xl border bg-card p-6">
              <Icon className="size-8 text-primary" />
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          );
        })}
      </div>

      <div className="space-y-4 rounded-3xl border bg-muted/40 px-8 py-12 text-center">
        <h2 className="font-display text-2xl font-semibold">Our mission</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Finding a home shouldn&apos;t require endless chat threads and unclear deposits. RentNest
          removes friction between tenants and landlords with role-based tools and secure payments.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link href="/properties">
            <Button className="rounded-full">Browse properties</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" className="rounded-full">
              Create account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
