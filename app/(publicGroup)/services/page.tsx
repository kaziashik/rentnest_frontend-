import Link from "next/link";
import {
  SearchIcon,
  FileTextIcon,
  CreditCardIcon,
  StarIcon,
  HomeIcon,
  ListChecksIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: SearchIcon,
    title: "Property Search",
    description:
      "Browse and filter listings by location, price, and category to find the right fit.",
  },
  {
    icon: FileTextIcon,
    title: "Rental Requests",
    description:
      "Submit a request directly to the landlord with your preferred move-in date and message.",
  },
  {
    icon: CreditCardIcon,
    title: "Secure Payments",
    description:
      "Pay rent securely online through Stripe Checkout once your request is approved.",
  },
  {
    icon: StarIcon,
    title: "Reviews & Ratings",
    description:
      "Leave a review after your rental to help future tenants make informed choices.",
  },
  {
    icon: HomeIcon,
    title: "Property Listing",
    description:
      "Landlords can list properties with photos, pricing, and amenities in minutes.",
  },
  {
    icon: ListChecksIcon,
    title: "Request Management",
    description:
      "Landlords can review, approve, or decline rental requests from one dashboard.",
  },
];

export default function ServicesPage() {
  return (
    <div className="container-page space-y-12 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">Services</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything you need to rent or list
        </h1>
        <p className="text-muted-foreground">
          One platform for discovery, requests, approvals, payments, and reviews.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.title}
              className="space-y-2 rounded-2xl border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Icon className="size-8 text-primary" />
              <h3 className="font-semibold">{service.title}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-3">
        <Link href="/properties">
          <Button className="rounded-full">Explore properties</Button>
        </Link>
        <Link href="/register">
          <Button variant="outline" className="rounded-full">
            Get started
          </Button>
        </Link>
      </div>
    </div>
  );
}
