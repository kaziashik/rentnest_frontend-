"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, SearchIcon } from "lucide-react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    title: "Homes that feel like yours",
    subtitle: "Browse verified rentals across Malaysia and move in with confidence.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d936bb?auto=format&fit=crop&w=1600&q=80",
    title: "List once. Reach real tenants.",
    subtitle: "Landlords manage requests, approvals, and payouts from one dashboard.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80",
    title: "Request. Approve. Pay securely.",
    subtitle: "Stripe Checkout keeps rent payments transparent for both sides.",
  },
];

export function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[index];

  return (
    <section className="relative h-[65vh] min-h-[420px] max-h-[720px] w-full overflow-hidden">
      {slides.map((item, i) => (
        <Image
          key={item.image}
          src={item.image}
          alt={item.title}
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />

      <div className="container-page relative z-10 flex h-full flex-col justify-center px-4 sm:px-6 lg:px-8">
        <p className="animate-fade-up mb-3 text-sm font-semibold tracking-[0.2em] text-accent uppercase">
          RentNest
        </p>
        <h1
          key={slide.title}
          className="animate-fade-up font-display max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          {slide.title}
        </h1>
        <p
          key={slide.subtitle}
          className="animate-fade-up mt-4 max-w-xl text-base text-white/85 sm:text-lg"
          style={{ animationDelay: "120ms" }}
        >
          {slide.subtitle}
        </p>
        <div
          className="animate-fade-up mt-8 flex flex-wrap gap-3"
          style={{ animationDelay: "200ms" }}
        >
          <Link href="/properties">
            <Button size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
              <SearchIcon data-icon="inline-start" />
              Explore Properties
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white"
            >
              Get Started
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </Link>
        </div>

        <div className="mt-10 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 bg-accent" : "w-3 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
