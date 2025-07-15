
import { Card, CardContent } from "../components/ui/card";
import { TrendingUp, Shield, Globe, Users, CheckCircle, Smartphone } from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "For Farmers",
      headline: "Sell Direct, Earn More",
      description: "Bypass middlemen and connect directly with buyers. Set your own prices and keep more profit from your hard work.",
      features: ["Higher profit margins", "Direct customer relationships", "Real-time market prices", "Mobile-friendly dashboard"],
      color: "bg-[#2D5A27]"
    },
    {
      icon: Shield,
      title: "For Buyers",
      headline: "Fresh, Direct, Verified",
      description: "Get the freshest produce directly from certified farmers. Quality guaranteed with full traceability from farm to table.",
      features: ["KEPHIS-certified quality", "Farm-to-table freshness", "Competitive prices", "Secure M-Pesa payments"],
      color: "bg-[#FF8C42]"
    },
    {
      icon: Globe,
      title: "For Suppliers",
      headline: "Reach Every Farm",
      description: "Connect your agricultural inputs with farmers nationwide. Build lasting partnerships and grow Kenya's agricultural sector.",
      features: ["Nationwide farmer network", "Verified product listings", "Digital payment solutions", "Performance analytics"],
      color: "bg-[#2D5A27]"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Empowering Every Player in 
            <span className="text-[#2D5A27]"> Kenya's Agriculture</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our platform creates value for farmers, buyers, and suppliers by eliminating inefficiencies 
            and building trust through technology.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white overflow-hidden">
              <CardContent className="p-0">
                <div className={`${benefit.color} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                    <benefit.icon className="h-12 w-12 mb-4" />
                    <span className="text-sm font-medium opacity-90">{benefit.title}</span>
                    <h3 className="text-2xl font-bold mt-1">{benefit.headline}</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {benefit.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {benefit.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-[#2D5A27] flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#2D5A27] mb-2">15,000+</div>
              <div className="text-gray-600 font-medium">Active Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#FF8C42] mb-2">50M+</div>
              <div className="text-gray-600 font-medium">KSH Traded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#2D5A27] mb-2">2,500+</div>
              <div className="text-gray-600 font-medium">Urban Buyers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#FF8C42] mb-2">98%</div>
              <div className="text-gray-600 font-medium">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
