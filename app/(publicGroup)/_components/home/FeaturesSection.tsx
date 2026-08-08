import { BadgeCheck, CreditCard, MessageSquareHeart, Shield } from "lucide-react";

const features = [
  {
    icon: BadgeCheck,
    title: "Verified listings",
    description:
      "Every property is tied to a real landlord account with contact details and availability status.",
  },
  {
    icon: MessageSquareHeart,
    title: "Clear request flow",
    description:
      "Tenants send move-in requests. Landlords approve or reject with full context — no guesswork.",
  },
  {
    icon: CreditCard,
    title: "Secure Stripe payments",
    description:
      "Pay rent through Stripe Checkout after approval. Status updates automatically on success.",
  },
  {
    icon: Shield,
    title: "Role-based dashboards",
    description:
      "Tenants, landlords, and admins each get a focused workspace with the tools they need.",
  },
];

export function FeaturesSection() {
  return (
    <section className="section-pad">
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold tracking-wide text-primary uppercase">
            Why RentNest
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for the full rental lifecycle
          </h2>
          <p className="mt-3 text-muted-foreground">
            From discovery to payment and reviews — one platform for everyone involved.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border/80 bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
