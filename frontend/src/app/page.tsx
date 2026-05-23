import HeroSection        from "@/features/landing/components/HeroSection";
import ProblemSection     from "@/features/landing/components/ProblemSection";
import StatsSection       from "@/features/landing/components/StatsSection";
import HowItWorksSection  from "@/features/landing/components/HowItWorksSection";
import FeaturesSection    from "@/features/landing/components/FeaturesSection";
import ComparisonSection  from "@/features/landing/components/ComparisonSection";
import TestimonialsSection from "@/features/landing/components/TestimonialsSection";
import AboutSection       from "@/features/landing/components/AboutSection";
import FaqSection         from "@/features/landing/components/FaqSection";
import TrustSection       from "@/features/landing/components/TrustSection";
import CtaSection         from "@/features/landing/components/CtaSection";
import InteractiveSimulationPreview from "@/features/landing/components/InteractiveSimulationPreview";

/**
 * Homepage — assembles all landing page sections.
 * Each section lives in src/components/landing/*.tsx
 * Animations are defined in src/app/globals.css
 * Design tokens are in src/components/landing/tokens.ts
 */
export default function HomePage() {
  return (
    <main style={{ fontFamily: "var(--font-plus-jakarta), 'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      <HeroSection />
      <ProblemSection />
      <StatsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <InteractiveSimulationPreview/>
      <ComparisonSection />
      <TestimonialsSection />
      <AboutSection />
      <FaqSection />
      <TrustSection />
      <CtaSection />
    </main>
  );
}