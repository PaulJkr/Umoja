import React from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, PhoneCall, Loader } from "lucide-react";
import api from "../../api/axios";
import { toast } from "react-toastify";

interface Seller {
  _id: string;
  name: string;
  phone: string;
}

const formatPhone = (phone: string) => {
  // Convert to international format for WhatsApp (assumes Kenyan numbers)
  if (phone.startsWith("0")) return `254${phone.slice(1)}`;
  if (phone.startsWith("+")) return phone.replace("+", "");
  return phone;
};

const MessagesPage = () => {
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

  if (isLoading) {
    return (
      <div className="p-6 text-gray-600">
        Loading sellers <Loader className="inline animate-spin" />
      </div>
    );
  }

  if (isError) {
    toast.error("Failed to load sellers.");
    return <div className="p-6 text-red-500">Error fetching sellers.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Chat with Sellers</h2>

      {sellers?.length === 0 ? (
        <p className="text-gray-500">No sellers available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(sellers ?? []).map((seller) => (
            <div
              key={seller._id}
              className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">{seller.name}</h3>
              <p className="text-sm text-gray-600">📞 {seller.phone}</p>

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
