import { Button } from "../components/ui/button";
import { ArrowRight, Download, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#2D5A27] via-[#2D5A27] to-[#1a3d1a] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-[#FF8C42] rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 bg-white rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-40 right-10 w-20 h-20 bg-[#FF8C42] rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Transform Your{" "}
            <span className="text-[#FF8C42]">Agricultural Business?</span>
          </h2>
          <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed">
            Join thousands of farmers, buyers, and suppliers who are already
            growing their businesses with Kenya's premier agri-commerce
            platform.
          </p>
        </div>

        {/* Main CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Button
            size="lg"
            className="bg-[#FF8C42] hover:bg-[#FF8C42]/90 text-white text-xl px-12 py-8 rounded-2xl font-bold group shadow-xl"
            asChild
          >
            <Link to="/auth/register">
              Start Selling Today
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-[#2D5A27] text-xl px-12 py-8 rounded-2xl font-bold"
            asChild
          >
            <Link to="/auth/register">Browse Products</Link>
          </Button>
        </div>

        {/* User Type Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl mb-4">👨‍🌾</div>
            <h3 className="text-xl font-bold mb-3">For Farmers</h3>
            <p className="text-green-100 mb-4">
              Sell direct to customers and earn more from your harvest
            </p>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#2D5A27]"
              asChild
            >
              <Link to="/register">Register as Farmer</Link>
            </Button>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl mb-4">🏙️</div>
            <h3 className="text-xl font-bold mb-3">For Buyers</h3>
            <p className="text-green-100 mb-4">
              Get fresh produce directly from verified farmers
            </p>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#2D5A27]"
              asChild
            >
              <Link to="/register">Start Buying</Link>
            </Button>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-xl font-bold mb-3">For Suppliers</h3>
            <p className="text-green-100 mb-4">
              Connect your agricultural inputs with farmers nationwide
            </p>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#2D5A27]"
              asChild
            >
              <Link to="/register">Become Supplier</Link>
            </Button>
          </div>
        </div>

        {/* Contact Options */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Need Help Getting Started?
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF8C42] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold mb-2">
                Call Our Support Team
              </h4>
              <p className="text-green-100 mb-4">
                Speak with our agricultural experts in Kiswahili or English
              </p>
              <a
                href="tel:+254700123456"
                className="text-[#FF8C42] font-semibold hover:underline"
              >
                +254 700 123 456
              </a>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF8C42] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold mb-2">
                Download User Guide
              </h4>
              <p className="text-green-100 mb-4">
                Step-by-step guide in Kiswahili and English
              </p>
              <button className="text-[#FF8C42] font-semibold hover:underline">
                Download PDF Guide
              </button>
            </div>
          </div>
        </div>

        {/* Final Assurance */}
        <div className="text-center mt-12">
          <div className="flex flex-wrap justify-center gap-6 text-green-100">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#FF8C42] rounded-full"></span>
              <span>Free to join</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#FF8C42] rounded-full"></span>
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#FF8C42] rounded-full"></span>
              <span>24/7 support</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#FF8C42] rounded-full"></span>
              <span>KEPHIS verified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
