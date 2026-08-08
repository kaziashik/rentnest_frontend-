import Link from "next/link";
import { Building2, Home, Hotel, Warehouse } from "lucide-react";

const categories = [
  {
    name: "Apartment",
    description: "City living with modern amenities",
    href: "/properties?category=Apartment",
    icon: Building2,
  },
  {
    name: "House",
    description: "Family homes with more space",
    href: "/properties?category=House",
    icon: Home,
  },
  {
    name: "Studio",
    description: "Compact spaces for solo renters",
    href: "/properties?category=Studio",
    icon: Hotel,
  },
  {
    name: "Room",
    description: "Affordable shared living options",
    href: "/properties?category=Room",
    icon: Warehouse,
  },
];

export function CategoriesSection() {
  return (
    <section className="section-pad bg-muted/40">
      <div className="container-page">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold tracking-wide text-primary uppercase">
              Categories
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              Browse by property type
            </h2>
          </div>
          <Link href="/properties" className="text-sm font-medium text-primary hover:underline">
            View all listings →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className="rounded-2xl border bg-card p-6 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <Icon className="mb-4 size-8 text-primary" />
                <h3 className="text-lg font-semibold">{cat.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
