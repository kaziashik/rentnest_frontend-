import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import { ContactForm } from "../_components/ContactForm";

export default function ContactPage() {
  return (
    <div className="container-page space-y-12 px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-4 text-center">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">Contact</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Get in touch
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Questions about a listing, your account, or payments? Send a message — we typically
          respond within 1–2 business days.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="space-y-2 rounded-2xl border bg-card p-6 text-center">
          <MailIcon className="mx-auto size-8 text-primary" />
          <h3 className="font-semibold">Email</h3>
          <a href="mailto:support@rentnest.com" className="text-sm text-muted-foreground hover:text-primary">
            support@rentnest.com
          </a>
        </div>
        <div className="space-y-2 rounded-2xl border bg-card p-6 text-center">
          <PhoneIcon className="mx-auto size-8 text-primary" />
          <h3 className="font-semibold">Phone</h3>
          <a href="tel:+60168364407" className="text-sm text-muted-foreground hover:text-primary">
            +60 16-836 4407
          </a>
        </div>
        <div className="space-y-2 rounded-2xl border bg-card p-6 text-center">
          <MapPinIcon className="mx-auto size-8 text-primary" />
          <h3 className="font-semibold">Location</h3>
          <p className="text-sm text-muted-foreground">Penang, Malaysia</p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <ContactForm />
      </div>
    </div>
  );
}
