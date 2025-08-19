import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  MessageSquare,
  PhoneCall,
  Loader,
  Filter,
  MapPin,
  User,
  Search,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import { toast } from "react-toastify";

interface Seller {
  _id: string;
  name: string;
  phone: string;
  role: "farmer" | "supplier";
  location?: string;
}

const formatPhone = (phone: string) => {
  if (phone.startsWith("0")) return `254${phone.slice(1)}`;
  if (phone.startsWith("+")) return phone.replace("+", "");
  return phone;
};

const MessagesPage = () => {
  const [roleFilter, setRoleFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");

  const {
    data: sellers,
    isLoading,
    isError,
  } = useQuery<Seller[]>({
    queryKey: ["sellers"],
    queryFn: async () => {
      const res = await api.get("/users/sellers");
      return res.data;
    },
  });

  const filtered = (sellers ?? []).filter((s) => {
    return (
      (roleFilter === "all" || s.role === roleFilter) &&
      (locationFilter === "" ||
        s.location?.toLowerCase().includes(locationFilter.toLowerCase()))
    );
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const getRoleIcon = (role: string) => {
    return role === "farmer" ? "🌾" : "🏪";
  };

  const getRoleBadgeColor = (role: string) => {
    return role === "farmer"
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-blue-50 text-blue-700 border-blue-200";
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-b border-gray-200/60 px-6 py-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Connect with Sellers
              </h1>
              <p className="text-gray-600 text-lg">
                Chat directly with farmers and suppliers in your network
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700 font-medium">
                {filtered.length} {filtered.length === 1 ? "seller" : "sellers"}{" "}
                available
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Filter Sellers
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 sm:flex-none">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              >
                <option value="all">All Roles</option>
                <option value="farmer">Farmers</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location (e.g. Nairobi)"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20"
            >
              <div className="text-center">
                <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Loading sellers...</p>
              </div>
            </motion.div>
          ) : isError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-red-600 text-6xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Unable to load sellers
                </h3>
                <p className="text-red-600">
                  Please check your connection and try again.
                </p>
              </div>
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No sellers found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filtered.map((seller) => (
                <motion.div
                  key={seller._id}
                  variants={cardVariants}
                  whileHover={{
                    y: -4,
                    transition: { duration: 0.2 },
                  }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200/60 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[280px]"
                >
                  {/* Card Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {seller.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                            {seller.name}
                          </h3>
                          <div
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border mt-1 ${getRoleBadgeColor(
                              seller.role
                            )}`}
                          >
                            <span className="mr-1">
                              {getRoleIcon(seller.role)}
                            </span>
                            {seller.role}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <PhoneCall className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">{seller.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span>
                          {seller.location ?? "Location not specified"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-6 pb-6">
                    <div className="flex gap-2">
                      <motion.a
                        href={`https://wa.me/${formatPhone(seller.phone)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-xl text-sm font-medium flex items-center justify-center transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        <MessageSquare className="w-4 h-4 mr-1.5" />
                        WhatsApp
                      </motion.a>
                      <motion.a
                        href={`tel:${seller.phone}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl text-sm font-medium flex items-center justify-center transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <PhoneCall className="w-4 h-4 mr-1.5" />
                        Call
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MessagesPage;
