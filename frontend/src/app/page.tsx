import HeroSection from "@/features/landing/components/HeroSection";
import ProblemSection from "@/features/landing/components/ProblemSection";
import StatsSection from "@/features/landing/components/StatsSection";
import AboutSection from "@/features/landing/components/AboutSection";
import HowItWorksSection from "@/features/landing/components/HowItWorksSection";
import FeaturesSection from "@/features/landing/components/FeaturesSection";
import InteractiveSimulationPreview from "@/features/landing/components/InteractiveSimulationPreview";
// import AIAdvisorDemoSection from "@/features/landing/components/AIAdvisorDemoSection";
import TestimonialsSection from "@/features/landing/components/TestimonialsSection";
import FaqSection from "@/features/landing/components/FaqSection";
import CtaSection from "@/features/landing/components/CtaSection";

/**
 * Homepage - assembles all landing page sections.
 *
 * Recommended narrative:
 * Hero → Problem → Evidence → Solution → Flow → Features → Demo → Trust → CTA
 */
export default function HomePage() {
  return (
    <main
      style={{
        fontFamily:
          "var(--font-plus-jakarta), 'Plus Jakarta Sans', 'Inter', sans-serif",
      }}
    >
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Problem + Supporting Evidence */}
      <ProblemSection />
      <StatsSection />

      {/* 2b. About Section */}
      <AboutSection />

      {/* 3. How It Works */}
      <div id="how-it-works">
        <HowItWorksSection />
      </div>

      {/* 4. Features + Product Experience */}
      <div id="features">
        <FeaturesSection />
        <InteractiveSimulationPreview />
        {/* <AIAdvisorDemoSection /> */}
      </div>

      {/* 7. Social Proof / User Stories */}
      <TestimonialsSection />

      {/* 8. FAQ */}
      <FaqSection />

      {/* 9. Final CTA */}
      <CtaSection />
    </main>
  );
}