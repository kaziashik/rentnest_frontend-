import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="mx-auto max-w-4xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
            <div className="space-y-4 text-center">
                <h1 className="text-3xl font-bold sm:text-4xl">Get in Touch</h1>
                <p className="mx-auto max-w-2xl text-muted-foreground">
                    Have a question about a listing, your account, or RentNest in general?
                    Reach out — we&apos;d love to help.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="space-y-2 rounded-xl border p-6 text-center">
                    <MailIcon className="mx-auto size-8 text-primary" />
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-sm text-muted-foreground">support@rentnest.com</p>
                </div>

                <div className="space-y-2 rounded-xl border p-6 text-center">
                    <PhoneIcon className="mx-auto size-8 text-primary" />
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-sm text-muted-foreground">+60 16-836 4407</p>
                </div>

                <div className="space-y-2 rounded-xl border p-6 text-center">
                    <MapPinIcon className="mx-auto size-8 text-primary" />
                    <h3 className="font-semibold">Location</h3>
                    <p className="text-sm text-muted-foreground">Penang, Malaysia</p>
                </div>
            </div>
        </div>
    );
}