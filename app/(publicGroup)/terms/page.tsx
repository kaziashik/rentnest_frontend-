export default function TermsPage() {
  return (
    <div className="container-page px-4 py-16 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl space-y-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Last updated: March 2026</p>
        <p className="text-muted-foreground leading-relaxed">
          By using RentNest you agree to provide accurate listing and account information, respect
          other users, and use the platform only for lawful rental activity in Malaysia.
        </p>
        <h2 className="text-xl font-semibold">Landlords</h2>
        <p className="text-muted-foreground leading-relaxed">
          You are responsible for the accuracy of property details, photos, pricing, and
          availability. Approving a request indicates willingness to proceed to payment and tenancy
          arrangements.
        </p>
        <h2 className="text-xl font-semibold">Tenants</h2>
        <p className="text-muted-foreground leading-relaxed">
          Rental requests should reflect genuine interest. Payments completed via Stripe are subject
          to Stripe&apos;s terms and the agreement between you and the landlord.
        </p>
        <h2 className="text-xl font-semibold">Platform role</h2>
        <p className="text-muted-foreground leading-relaxed">
          RentNest provides software tools to connect parties. We are not a party to tenancy
          contracts unless explicitly stated. Misuse, fraud, or banned accounts may be restricted
          by administrators.
        </p>
      </article>
    </div>
  );
}
