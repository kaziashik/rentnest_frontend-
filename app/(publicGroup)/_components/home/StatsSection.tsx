import { getHouseRentalProperties } from "../../_actions/getHouseRentalNews";

export async function StatsSection() {
  const result = await getHouseRentalProperties({
    query: { page: "1", limit: "1" },
  });

  const totalListings = result?.success ? (result.data?.meta?.total ?? 0) : 0;

  const stats = [
    { label: "Active listings", value: totalListings > 0 ? `${totalListings}+` : "50+" },
    { label: "Cities covered", value: "12+" },
    { label: "Secure payments", value: "Stripe" },
    { label: "Avg. response", value: "< 24h" },
  ];

  return (
    <section className="section-pad">
      <div className="container-page">
        <div className="grid grid-cols-2 gap-6 rounded-3xl border bg-primary px-6 py-10 text-primary-foreground sm:grid-cols-4 sm:px-10">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl font-semibold sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-primary-foreground/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
