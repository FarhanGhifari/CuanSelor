import HeroSection        from "@/components/landing/HeroSection";
import ProblemSection     from "@/components/landing/ProblemSection";
import StatsSection       from "@/components/landing/StatsSection";
import HowItWorksSection  from "@/components/landing/HowItWorksSection";
import FeaturesSection    from "@/components/landing/FeaturesSection";
import ComparisonSection  from "@/components/landing/ComparisonSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import AboutSection       from "@/components/landing/AboutSection";
import FaqSection         from "@/components/landing/FaqSection";
import TrustSection       from "@/components/landing/TrustSection";
import CtaSection         from "@/components/landing/CtaSection";

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
      <ComparisonSection />
      <TestimonialsSection />
      <AboutSection />
      <FaqSection />
      <TrustSection />
      <CtaSection />
    </main>
  );
}