import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, PhoneCall, Loader, Filter } from "lucide-react";
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

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Chat with Sellers</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="all">All Roles</option>
            <option value="farmer">Farmers</option>
            <option value="supplier">Suppliers</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Filter by location (e.g. Nairobi)"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="border px-3 py-1 rounded w-full sm:w-1/3"
        />
      </div>

      {isLoading ? (
        <div className="text-gray-600">
          Loading <Loader className="inline animate-spin" />
        </div>
      ) : isError ? (
        <div className="text-red-500">Error fetching sellers.</div>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No sellers match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((seller) => (
            <div
              key={seller._id}
              className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">{seller.name}</h3>
              <p className="text-sm text-gray-600">
                📞 {seller.phone} <br />
                🧭 {seller.location ?? "Unknown"} <br />
                🧑‍🌾 {seller.role}
              </p>

              <div className="mt-4 flex gap-2">
                <a
                  href={`https://wa.me/${formatPhone(seller.phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-1/2 text-center bg-green-100 hover:bg-green-200 text-green-800 py-2 rounded text-sm flex items-center justify-center"
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  WhatsApp
                </a>
                <a
                  href={`tel:${seller.phone}`}
                  className="w-1/2 text-center bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 rounded text-sm flex items-center justify-center"
                >
                  <PhoneCall className="w-4 h-4 mr-1" />
                  Call
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
