import { HeroSection } from "./_components/home/HeroSection";
import { FeaturesSection } from "./_components/home/FeaturesSection";
import { CategoriesSection } from "./_components/home/CategoriesSection";
import { FeaturedPropertiesSection } from "./_components/home/FeaturedPropertiesSection";
import { StatsSection } from "./_components/home/StatsSection";
import { HowItWorksSection } from "./_components/home/HowItWorksSection";
import { TestimonialsSection } from "./_components/home/TestimonialsSection";
import { BlogPreviewSection } from "./_components/home/BlogPreviewSection";
import { FaqSection } from "./_components/home/FaqSection";
import { CtaSection } from "./_components/home/CtaSection";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <FeaturedPropertiesSection />
      <Suspense
        fallback={
          <div className="section-pad">
            <div className="container-page h-32 animate-pulse rounded-3xl bg-muted" />
          </div>
        }
      >
        <StatsSection />
      </Suspense>
      <HowItWorksSection />
      <TestimonialsSection />
      <BlogPreviewSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
