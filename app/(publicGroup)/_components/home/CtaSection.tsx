import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="section-pad">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary via-primary to-teal-800 px-8 py-14 text-center text-primary-foreground sm:px-16">
          <div className="animate-float absolute -top-10 -right-10 size-40 rounded-full bg-accent/20 blur-2xl" />
          <div className="animate-float absolute -bottom-12 -left-8 size-48 rounded-full bg-white/10 blur-2xl" style={{ animationDelay: "1.5s" }} />
          <div className="relative z-10">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to find — or list — your next rental?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
              Join RentNest today. Create a free account as a tenant or landlord and get started
              in minutes.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/register">
                <Button size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Create free account
                </Button>
              </Link>
              <Link href="/properties">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  Browse properties
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
