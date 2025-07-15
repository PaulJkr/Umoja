import { Card, CardContent } from "../components/ui/card";
import { UserPlus, Search, ShoppingCart, Truck } from "lucide-react";

export const UserJourneySection = () => {
  const steps = [
    {
      icon: UserPlus,
      number: "01",
      title: "Register & Verify",
      description:
        "Create your account in minutes. Farmers verify with KEPHIS, buyers with ID, suppliers with business registration.",
      details: [
        "Phone number verification",
        "Document upload",
        "Profile completion",
        "Account approval",
      ],
    },
    {
      icon: Search,
      number: "02",
      title: "List or Browse",
      description:
        "Farmers list fresh produce, suppliers showcase inputs, buyers browse quality products with detailed information.",
      details: [
        "Product photos & descriptions",
        "Pricing & availability",
        "Quality certifications",
        "Location details",
      ],
    },
    {
      icon: ShoppingCart,
      number: "03",
      title: "Order Securely",
      description:
        "Place orders with confidence. Secure M-Pesa payments, instant confirmations, and direct farmer communication.",
      details: [
        "M-Pesa integration",
        "Order confirmation",
        "Payment protection",
        "Direct messaging",
      ],
    },
    {
      icon: Truck,
      number: "04",
      title: "Track & Receive",
      description:
        "Monitor your orders in real-time. Get SMS updates, coordinate delivery, and rate your experience.",
      details: [
        "Real-time tracking",
        "SMS notifications",
        "Delivery coordination",
        "Quality feedback",
      ],
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How <span className="text-[#2D5A27]">Umoja Farms</span> Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From registration to delivery, we've made agricultural commerce
            simple, secure, and transparent for everyone involved.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#2D5A27] via-[#FF8C42] to-[#2D5A27] -translate-x-1/2 -translate-y-1/2"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-white overflow-hidden h-full">
                  <CardContent className="p-6 text-center relative">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="w-12 h-12 bg-[#FF8C42] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                        {step.number}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="mt-8 mb-6">
                      <div className="w-16 h-16 bg-[#2D5A27] rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <step.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Details */}
                    <ul className="space-y-2 text-sm">
                      {step.details.map((detail, detailIndex) => (
                        <li
                          key={detailIndex}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-2 h-2 bg-[#FF8C42] rounded-full flex-shrink-0"></div>
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Agricultural Business?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of farmers, buyers, and suppliers who are already
              growing their businesses with Umoja Farms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#2D5A27] hover:bg-[#2D5A27]/90 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
                Start as a Farmer
              </button>
              <button className="bg-[#FF8C42] hover:bg-[#FF8C42]/90 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
                Start as a Buyer
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
