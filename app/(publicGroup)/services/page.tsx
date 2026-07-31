import { SearchIcon, FileTextIcon, CreditCardIcon, StarIcon, HomeIcon, ListChecksIcon } from "lucide-react";

const services = [
    {
        icon: SearchIcon,
        title: "Property Search",
        description: "Browse and filter listings by location, price, and amenities to find the right fit.",
    },
    {
        icon: FileTextIcon,
        title: "Rental Requests",
        description: "Submit a request directly to the landlord with your preferred move-in date.",
    },
    {
        icon: CreditCardIcon,
        title: "Secure Payments",
        description: "Pay rent securely online through Stripe once your request is approved.",
    },
    {
        icon: StarIcon,
        title: "Reviews & Ratings",
        description: "Leave a review after your rental to help future tenants make informed choices.",
    },
    {
        icon: HomeIcon,
        title: "Property Listing",
        description: "Landlords can list properties with photos, pricing, and amenities in minutes.",
    },
    {
        icon: ListChecksIcon,
        title: "Request Management",
        description: "Landlords can review, approve, or decline rental requests from one dashboard.",
    },
];

export default function ServicesPage() {
    return (
        <div className="mx-auto max-w-5xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
            <div className="space-y-4 text-center">
                <h1 className="text-3xl font-bold sm:text-4xl">Our Services</h1>
                <p className="mx-auto max-w-2xl text-muted-foreground">
                    Everything you need to rent or list a property, in one platform.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => {
                    const Icon = service.icon;
                    return (
                        <div key={service.title} className="space-y-2 rounded-xl border p-6">
                            <Icon className="size-8 text-primary" />
                            <h3 className="font-semibold">{service.title}</h3>
                            <p className="text-sm text-muted-foreground">
                                {service.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}