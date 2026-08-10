"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, SearchIcon } from "lucide-react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    line: "Homes that feel like yours",
    subtitle:
      "Browse verified rentals across Malaysia and move in with confidence.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    line: "List once. Reach real tenants.",
    subtitle:
      "Landlords manage requests, approvals, and payouts from one dashboard.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    line: "Request. Approve. Pay securely.",
    subtitle:
      "Stripe Checkout keeps rent payments transparent for both sides.",
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
    <section className="relative h-[70vh] min-h-[460px] max-h-[760px] w-full overflow-hidden">
      {slides.map((item, i) => (
        <Image
          key={item.image}
          src={item.image}
          alt={item.line}
          fill
          priority={i === 0}
          sizes="100vw"
          unoptimized
          className={`object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/25" />

      <div className="container-page relative z-10 flex h-full flex-col justify-center px-4 sm:px-6 lg:px-8">
        <h1 className="animate-fade-up font-display text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
          RentNest
        </h1>

        <p
          key={slide.line}
          className="animate-fade-up mt-4 max-w-2xl text-xl font-medium text-white/95 sm:text-2xl lg:text-3xl"
        >
          {slide.line}
        </p>

        <p
          key={slide.subtitle}
          className="animate-fade-up mt-3 max-w-xl text-base text-white/80 sm:text-lg"
          style={{ animationDelay: "100ms" }}
        >
          {slide.subtitle}
        </p>

        <div
          className="animate-fade-up mt-8 flex flex-wrap gap-3"
          style={{ animationDelay: "180ms" }}
        >
          <Link href="/properties">
            <Button
              size="lg"
              className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
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
