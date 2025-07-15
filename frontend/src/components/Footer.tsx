import {
  Leaf,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";

export const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Leaf className="h-8 w-8 text-[#FF8C42]" />
              <span className="text-2xl font-bold">Umoja Farms</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Kenya's premier digital marketplace connecting smallholder
              farmers, verified suppliers, and urban buyers. Transforming
              agriculture through technology and building prosperity for all
              stakeholders in the agricultural value chain.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-[#2D5A27] rounded-lg flex items-center justify-center hover:bg-[#FF8C42] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#2D5A27] rounded-lg flex items-center justify-center hover:bg-[#FF8C42] transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#2D5A27] rounded-lg flex items-center justify-center hover:bg-[#FF8C42] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-gray-300 hover:text-[#FF8C42] transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-gray-300 hover:text-[#FF8C42] transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-gray-300 hover:text-[#FF8C42] transition-colors"
                >
                  Success Stories
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#FF8C42] transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#FF8C42] transition-colors"
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#FF8C42] transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#FF8C42] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">Nairobi, Kenya</p>
                  <p className="text-gray-300">Innovation Hub, Westlands</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#FF8C42] flex-shrink-0" />
                <a
                  href="tel:+254700123456"
                  className="text-gray-300 hover:text-[#FF8C42] transition-colors"
                >
                  +254 700 123 456
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#FF8C42] flex-shrink-0" />
                <a
                  href="mailto:hello@Umoja Farms.co.ke"
                  className="text-gray-300 hover:text-[#FF8C42] transition-colors"
                >
                  hello@Umoja Farms.co.ke
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="bg-[#2D5A27] rounded-2xl p-6 md:p-8 text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-green-100 max-w-3xl mx-auto leading-relaxed">
              To revolutionize Kenya's agricultural marketplace by connecting
              farmers directly with consumers, ensuring fair prices, quality
              products, and sustainable growth for all participants in the
              agricultural value chain. Together, we're building a more
              prosperous and food-secure Kenya.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 Umoja Farms. All rights reserved. Proudly serving Kenya's
              agricultural community.
            </div>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-[#FF8C42] transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#FF8C42] transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#FF8C42] transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
