import { Card, CardContent } from "../components/ui/card";
import { Shield, Zap, Globe, Lock } from "lucide-react";

export const TechnologySection = () => {
  const techFeatures = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Optimized for speed with minimal data usage. Perfect for Kenya's mobile-first environment.",
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description:
        "Encrypted transactions and secure data protection. Your information is always safe.",
    },
    {
      icon: Globe,
      title: "Nationwide Coverage",
      description:
        "Reliable platform that works across all 47 counties, from urban centers to rural areas.",
    },
    {
      icon: Lock,
      title: "Privacy Protected",
      description:
        "Your personal and business data is protected with industry-standard encryption.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Built for <span className="text-[#2D5A27]">Kenya's Future</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Modern technology designed specifically for Kenya's agricultural
            ecosystem. Reliable, secure, and accessible to everyone.
          </p>
        </div>

        {/* Tech Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {techFeatures.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 border-0 bg-white text-center"
            >
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-[#2D5A27] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Technology Stack Highlight */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Technology That Works in the Real World
              </h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-[#FF8C42] rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Mobile-Optimized
                    </h4>
                    <p className="text-gray-600">
                      Works perfectly on any smartphone, even with slow internet
                      connections.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-[#FF8C42] rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Offline Capabilities
                    </h4>
                    <p className="text-gray-600">
                      Continue working even when connectivity is poor in rural
                      areas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-[#FF8C42] rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      SMS Integration
                    </h4>
                    <p className="text-gray-600">
                      Important updates sent via SMS to ensure you never miss
                      anything.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-[#FF8C42] rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Scalable Infrastructure
                    </h4>
                    <p className="text-gray-600">
                      Growing with Kenya's agricultural sector for years to
                      come.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="bg-gradient-to-br from-[#2D5A27] to-[#1a3d1a] p-8 md:p-12 flex items-center justify-center">
              <div className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-[#2D5A27]">
                      Umoja Farms Dashboard
                    </span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-[#2D5A27] text-white p-3 rounded-lg">
                      <div className="text-xs opacity-80">
                        This Week's Sales
                      </div>
                      <div className="text-xl font-bold">KSH 45,720</div>
                      <div className="text-xs opacity-80">
                        ↗ +12% from last week
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-100 p-2 rounded">
                        <div className="text-xs text-gray-600">Orders</div>
                        <div className="font-bold text-gray-900">34</div>
                      </div>
                      <div className="bg-gray-100 p-2 rounded">
                        <div className="text-xs text-gray-600">Products</div>
                        <div className="font-bold text-gray-900">127</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">M-Pesa Connected</span>
                      <span className="text-green-600 font-medium">
                        ✓ Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-2 -right-2 bg-[#FF8C42] text-white px-3 py-1 rounded-full text-xs font-medium">
                  Real-time
                </div>
                <div className="absolute -bottom-2 -left-2 bg-white text-[#2D5A27] px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                  Secure
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
