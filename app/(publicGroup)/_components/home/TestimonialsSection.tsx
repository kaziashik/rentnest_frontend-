const testimonials = [
  {
    quote:
      "I found a furnished apartment in Penang within a week. The request and payment flow was clearer than WhatsApp negotiations.",
    name: "Aisha Rahman",
    role: "Tenant · Software Engineer",
  },
  {
    quote:
      "Managing approvals from one dashboard saved me hours. Tenants pay through Stripe, so I always know when rent is settled.",
    name: "Daniel Tan",
    role: "Landlord · 6 listings",
  },
  {
    quote:
      "As a first-time renter abroad, RentNest made the process feel professional — listings, reviews, and status tracking in one place.",
    name: "Mei Ling",
    role: "Tenant · Graduate student",
  },
];

export function TestimonialsSection() {
  return (
    <section className="section-pad">
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold tracking-wide text-primary uppercase">
            Testimonials
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            Trusted by renters and owners
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote
              key={item.name}
              className="flex h-full flex-col justify-between rounded-2xl border bg-card p-6"
            >
              <p className="text-sm leading-relaxed text-foreground/90">“{item.quote}”</p>
              <footer className="mt-6 border-t pt-4">
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
