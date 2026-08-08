"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Is RentNest free to browse?",
    a: "Yes. Anyone can browse listings and property details. You only need an account to submit rental requests, pay, or leave reviews.",
  },
  {
    q: "How do payments work?",
    a: "After a landlord approves your request, you pay through Stripe Checkout. On success, your rental status moves to Active automatically.",
  },
  {
    q: "Can landlords list multiple properties?",
    a: "Yes. Landlords can create, edit, and toggle availability for every listing from the landlord dashboard.",
  },
  {
    q: "What roles does RentNest support?",
    a: "Tenant, Landlord, and Admin. Each role has a dedicated dashboard with the right tools and permissions.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section-pad bg-muted/40">
      <div className="container-page max-w-3xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold tracking-wide text-primary uppercase">FAQ</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            Common questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={faq.q} className="overflow-hidden rounded-2xl border bg-card">
                <button
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-medium">{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-muted-foreground transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
