const steps = [
  {
    step: "01",
    title: "Browse & shortlist",
    description: "Filter by location, price, and category to find homes that match your needs.",
  },
  {
    step: "02",
    title: "Request to rent",
    description: "Send a move-in date and message. The landlord reviews your request directly.",
  },
  {
    step: "03",
    title: "Pay & move in",
    description: "Once approved, complete payment via Stripe Checkout and start your tenancy.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="section-pad bg-muted/40">
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold tracking-wide text-primary uppercase">
            How it works
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            Three steps to your next home
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="relative rounded-2xl border bg-card p-8">
              <span className="font-display text-5xl font-semibold text-primary/15">
                {item.step}
              </span>
              <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
