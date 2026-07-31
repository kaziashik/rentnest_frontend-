import { HomeIcon, ShieldCheckIcon, UsersIcon, SparklesIcon } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="mx-auto max-w-4xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
            <div className="space-y-4 text-center">
                <h1 className="text-3xl font-bold sm:text-4xl">About RentNest</h1>
                <p className="mx-auto max-w-2xl text-muted-foreground">
                    RentNest connects tenants and landlords across Malaysia, making it simple
                    to find a place to call home — or to list a property with confidence.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2 rounded-xl border p-6">
                    <HomeIcon className="size-8 text-primary" />
                    <h3 className="font-semibold">Wide Selection</h3>
                    <p className="text-sm text-muted-foreground">
                        Browse rooms, apartments, houses, and studios across every major city.
                    </p>
                </div>

                <div className="space-y-2 rounded-xl border p-6">
                    <ShieldCheckIcon className="size-8 text-primary" />
                    <h3 className="font-semibold">Verified Listings</h3>
                    <p className="text-sm text-muted-foreground">
                        Every property is managed by a real landlord you can message directly.
                    </p>
                </div>

                <div className="space-y-2 rounded-xl border p-6">
                    <UsersIcon className="size-8 text-primary" />
                    <h3 className="font-semibold">For Everyone</h3>
                    <p className="text-sm text-muted-foreground">
                        Whether you&apos;re renting your first room or listing your tenth property,
                        RentNest is built for you.
                    </p>
                </div>

                <div className="space-y-2 rounded-xl border p-6">
                    <SparklesIcon className="size-8 text-primary" />
                    <h3 className="font-semibold">Simple & Secure</h3>
                    <p className="text-sm text-muted-foreground">
                        Request, approve, and pay rent securely — all in one place.
                    </p>
                </div>
            </div>

            <div className="space-y-3 text-center">
                <h2 className="text-xl font-semibold">Our Mission</h2>
                <p className="mx-auto max-w-2xl text-muted-foreground">
                    We believe finding a home shouldn&apos;t be complicated. RentNest was built
                    to remove the friction between tenants and landlords — no middlemen,
                    no confusion, just a straightforward way to rent.
                </p>
            </div>
        </div>
    );
}