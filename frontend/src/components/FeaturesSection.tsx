import { Card, CardContent } from "../components/ui/card";
import {
  Smartphone,
  Shield,
  Bell,
  BarChart3,
  MapPin,
  CreditCard,
} from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description:
        "Optimized for smartphones with offline capabilities and low-bandwidth support. Perfect for rural connectivity.",
      image:
        "https://i0.wp.com/www.ecomena.org/wp-content/uploads/2021/05/agricultural-apps.jpg",
    },
    {
      icon: CreditCard,
      title: "Secure M-Pesa Integration",
      description:
        "Seamless payments through Kenya's trusted M-Pesa platform. Safe, familiar, and instant transactions.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMPGxi5WoE0uLWHpT-C-km3qDaueN7WpTVlQ&s",
    },
    {
      icon: Shield,
      title: "KEPHIS Verification",
      description:
        "All suppliers verified by Kenya Plant Health Inspectorate Service. Quality and authenticity guaranteed.",
      image:
        "https://cdn.standardmedia.co.ke/images/saturday/thumb_fight_against_fake_s5d3307a6a4785.jpg",
    },
    {
      icon: Bell,
      title: "Real-Time Notifications",
      description:
        "SMS alerts for orders, payments, and deliveries. Stay connected even with basic phones.",
      image:
        "https://www.pushengage.com/wp-content/uploads/2023/05/How-to-Sort-Push-Notifications.png",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Track sales, monitor market trends, and optimize your agricultural business with detailed insights.",
      image:
        "https://www.slideteam.net/wp/wp-content/uploads/2024/02/Dashboard-for-Digital-Agriculture-Business-Management.jpg",
    },
    {
      icon: MapPin,
      title: "Location-Based Matching",
      description:
        "Connect with farmers and buyers in your area. Reduce transportation costs and support local agriculture.",
      image:
        "https://cdn.prod.website-files.com/5f277eb85e5f02d500828d71/6081e09e3dfd579cb22e6561_address-matching-without-geocoder.png",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for
            <span className="text-[#2D5A27]"> Modern Agriculture</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Built specifically for Kenya's agricultural ecosystem with features
            that work in real-world farming conditions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-500 border-0 overflow-hidden bg-white"
            >
              <CardContent className="p-0">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-[#FF8C42] rounded-xl flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile App Preview */}
        <div className="mt-20 bg-gradient-to-r from-[#2D5A27] to-[#1a3d1a] rounded-3xl p-8 md:p-12 text-white">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Experience Umoja Farms on Your Mobile
              </h3>
              <p className="text-xl text-green-100 mb-8 leading-relaxed">
                Our mobile-optimized platform works perfectly on any smartphone.
                Access all features, manage your business, and stay connected
                with the agricultural community.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#FF8C42] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Works on any smartphone or feature phone</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#FF8C42] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Offline capabilities for rural areas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#FF8C42] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>SMS notifications for all users</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm mx-auto">
                <div className="bg-gray-900 rounded-2xl p-4 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Umoja Farms</span>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-[#2D5A27] p-3 rounded-lg">
                      <div className="text-xs text-green-200">
                        Today's Sales
                      </div>
                      <div className="text-lg font-bold">KSH 12,450</div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="bg-[#FF8C42] p-2 rounded flex-1">
                        <div className="text-xs">Orders</div>
                        <div className="font-bold">23</div>
                      </div>
                      <div className="bg-gray-700 p-2 rounded flex-1">
                        <div className="text-xs">Products</div>
                        <div className="font-bold">156</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
