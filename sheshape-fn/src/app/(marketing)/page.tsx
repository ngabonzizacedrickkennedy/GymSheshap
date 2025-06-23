import { BlogPreview } from "@/components/marketing/BlogSection";
import { CTASection } from "@/components/marketing/CTASection";
import { FeaturedPrograms } from "@/components/marketing/FeaturedPrograms";
import { FeatureHighlights } from "@/components/marketing/FeatureHighlights";
import { HeroSection } from "@/components/marketing/HeroSection";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { TrainersShowcase } from "@/components/marketing/TrainersShowcase";

// src/app/(marketing)/page.tsx
export default function HomePage() {
  return (
    <>
      {/* Remove the Header component from here */}
      <main>
        <HeroSection />
        <FeatureHighlights />
        <FeaturedPrograms />
        <TrainersShowcase />
        <TestimonialsSection />
        <BlogPreview />
        <CTASection />
      </main>
      {/* Footer should also come from the layout */}
    </>
  );
}