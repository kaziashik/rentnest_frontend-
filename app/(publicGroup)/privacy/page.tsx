export default function PrivacyPage() {
  return (
    <div className="container-page px-4 py-16 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl space-y-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: March 2026</p>
        <p className="text-muted-foreground leading-relaxed">
          RentNest collects account information (name, email, phone, role) and listing data needed
          to operate the rental marketplace. Payment processing is handled by Stripe; we do not
          store full card numbers on our servers.
        </p>
        <h2 className="text-xl font-semibold">What we use your data for</h2>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          <li>Authentication and role-based access to dashboards</li>
          <li>Matching tenants with landlords and managing rental requests</li>
          <li>Processing rent payments and confirming payment status</li>
          <li>Improving platform reliability and preventing abuse</li>
        </ul>
        <h2 className="text-xl font-semibold">Your choices</h2>
        <p className="text-muted-foreground leading-relaxed">
          You can update your profile information from your dashboard. To request account deletion
          or data export, contact support@rentnest.com.
        </p>
      </article>
    </div>
  );
}
