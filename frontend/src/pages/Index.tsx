import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";
import { HeroSection } from "../components/HeroSection";
import { BenefitsSection } from "../components/BenefitsSection";
import { FeaturesSection } from "../components/FeaturesSection";
import { UserJourneySection } from "../components/UserJourneySection";
import { SocialProofSection } from "../components/SocialProofSection";
import { TechnologySection } from "../components/TechnologySection";
import { CTASection } from "../components/CTASection";
import { Footer } from "../components/Footer";
import { Leaf } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-[#2D5A27]" />
              <span className="text-xl font-bold text-[#2D5A27]">
                Umoja Farms
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-[#2D5A27] transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-[#2D5A27] transition-colors"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-[#2D5A27] transition-colors"
              >
                Stories
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-[#2D5A27] transition-colors"
              >
                Contact
              </a>
            </div>
            <div className="flex items-center space-x-4">
              {/* Sign In */}
              <Button
                variant="outline"
                className="border-[#2D5A27] text-[#2D5A27] hover:bg-[#2D5A27] hover:text-white"
                asChild
              >
                <Link to="/login">Sign In</Link>
              </Button>

              {/* Get Started */}
              <Button
                className="bg-[#FF8C42] hover:bg-[#FF8C42]/90 text-white"
                asChild
              >
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <HeroSection />
        <BenefitsSection />
        <FeaturesSection />
        <UserJourneySection />
        <SocialProofSection />
        <TechnologySection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
