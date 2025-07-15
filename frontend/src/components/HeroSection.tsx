
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowRight, Users, TrendingUp, Shield } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2D5A27] via-[#2D5A27] to-[#1a3d1a] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-[#FF8C42] rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-white rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-[#FF8C42] rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <Badge className="bg-[#FF8C42]/20 text-[#FF8C42] border-[#FF8C42]/30 mb-6 text-sm font-medium">
              🇰🇪 Revolutionizing Kenyan Agriculture
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Connect <span className="text-[#FF8C42]">Directly</span> with
              <br />
              Kenya's Farmers
            </h1>

            <p className="text-xl text-green-100 mb-8 leading-relaxed max-w-2xl">
              The first digital marketplace connecting smallholder farmers,
              verified suppliers, and urban buyers. Eliminate middlemen, ensure
              quality, and boost agricultural prosperity across Kenya.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8">
              <div className="flex items-center space-x-2 text-green-100">
                <Users className="h-5 w-5 text-[#FF8C42]" />
                <span className="text-sm font-medium">15,000+ Farmers</span>
              </div>
              <div className="flex items-center space-x-2 text-green-100">
                <TrendingUp className="h-5 w-5 text-[#FF8C42]" />
                <span className="text-sm font-medium">KSH 50M+ Traded</span>
              </div>
              <div className="flex items-center space-x-2 text-green-100">
                <Shield className="h-5 w-5 text-[#FF8C42]" />
                <span className="text-sm font-medium">KEPHIS Verified</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-[#FF8C42] hover:bg-[#FF8C42]/90 text-white text-lg px-8 py-6 rounded-xl font-semibold group"
              >
                Start Selling Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-[#2D5A27] text-lg px-8 py-6 rounded-xl font-semibold"
              >
                Browse Products
              </Button>
            </div>

            {/* Mobile First Badge */}
            <div className="mt-8 flex justify-center lg:justify-start">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                📱 Mobile-First Platform
              </Badge>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://saccoreview.co.ke/wp-content/uploads/2025/02/top-agriculture-and-agribusiness-companies-in-Kenya.jpg"
                alt="Kenyan farmers with fresh produce"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#2D5A27] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">👨‍🌾</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Fresh Vegetables
                      </p>
                      <p className="text-sm text-gray-600">
                        Direct from Kiambu County
                      </p>
                    </div>
                    <div className="ml-auto">
                      <p className="text-lg font-bold text-[#2D5A27]">
                        KSH 450
                      </p>
                      <p className="text-xs text-gray-500">per kg</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-[#FF8C42] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce">
              ✓ Verified Quality
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white text-[#2D5A27] px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              💳 M-Pesa Ready
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
