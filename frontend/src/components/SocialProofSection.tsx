import { Card, CardContent } from "../components/ui/card";
import { Star, Quote } from "lucide-react";

export const SocialProofSection = () => {
  const testimonials = [
    {
      name: "Mary Wanjiku",
      role: "Smallholder Farmer, Kiambu County",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      content:
        "Umoja Farms changed my life! I now sell directly to customers in Nairobi and earn 40% more than selling to middlemen. The M-Pesa payments are instant and secure.",
      earnings: "Increased earnings by 40%",
      rating: 5,
    },
    {
      name: "James Kipchoge",
      role: "Urban Buyer, Nairobi",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content:
        "Fresh vegetables delivered straight from the farm to my door. The quality is amazing and prices are better than supermarkets. I love supporting local farmers.",
      earnings: "Saves 25% on groceries",
      rating: 5,
    },
    {
      name: "Grace Akinyi",
      role: "Seed Supplier, Kisumu",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content:
        "Through Umoja Farms, I've connected with farmers across western Kenya. My KEPHIS-certified seeds reach more farmers than ever before. Sales have tripled!",
      earnings: "300% increase in reach",
      rating: 5,
    },
  ];

  const stats = [
    { value: "15,000+", label: "Happy Farmers" },
    { value: "2,500+", label: "Urban Buyers" },
    { value: "500+", label: "Verified Suppliers" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Success Stories from
            <span className="text-[#2D5A27]"> Our Community</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Real people, real results. See how Umoja Farms is transforming lives
            across Kenya's agricultural sector.
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-500 border-0 bg-gray-50 relative overflow-hidden"
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-20">
                  <Quote className="h-12 w-12 text-[#2D5A27]" />
                </div>

                {/* Rating */}
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-[#FF8C42] fill-current"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>

                {/* Earnings Badge */}
                <div className="bg-[#2D5A27] text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                  {testimonial.earnings}
                </div>

                {/* Profile */}
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#FF8C42]"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="bg-gradient-to-r from-[#2D5A27] to-[#1a3d1a] rounded-3xl p-8 md:p-12 text-white">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Growing Kenya's Agricultural Economy
            </h3>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Every transaction on Umoja Farms contributes to building a
              stronger, more connected agricultural ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#FF8C42] mb-2">
                  {stat.value}
                </div>
                <div className="text-green-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Additional Success Metrics */}
          <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 rounded-xl p-6">
              <h4 className="font-semibold mb-2">Total Value Traded</h4>
              <p className="text-2xl font-bold text-[#FF8C42]">
                KSH 50+ Million
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h4 className="font-semibold mb-2">
                Average Farmer Income Increase
              </h4>
              <p className="text-2xl font-bold text-[#FF8C42]">35%</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h4 className="font-semibold mb-2">Counties Covered</h4>
              <p className="text-2xl font-bold text-[#FF8C42]">47/47</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
