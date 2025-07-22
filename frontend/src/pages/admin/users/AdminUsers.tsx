import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios"; // ✅ Use the correct axios instance
import { Badge } from "../../../components/ui/badge";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

type UserRole = "admin" | "farmer" | "buyer";

type User = {
  _id: string;
  name: string;
  role: UserRole;
  phone: string;
  location?: string;
};

const fetchUsers = async (): Promise<User[]> => {
  const res = await api.get("/admin/users"); // ✅ Actual backend endpoint
  return res.data;
};

const roleColors: Record<UserRole, string> = {
  admin: "bg-red-500",
  farmer: "bg-green-600",
  buyer: "bg-blue-500",
};

export default function AdminUsers() {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchUsers,
  });

  return (
    <div className="p-6">
      <motion.h2
        className="text-2xl font-bold mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        All Users
      </motion.h2>

      {isLoading && (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      )}

      {error && <p className="text-red-500 text-sm">Failed to fetch users.</p>}

      {!isLoading && Array.isArray(users) && users.length === 0 && (
        <p className="text-gray-500">No users found.</p>
      )}

      {!isLoading && Array.isArray(users) && users.length > 0 && (
        <motion.div
          className="overflow-x-auto rounded-md border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Location</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map((user, index) => (
                <motion.tr
                  key={user._id}
                  className="border-t hover:bg-gray-50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="p-3 font-medium">{user.name}</td>
                  <td className="p-3">
                    <Badge className={roleColors[user.role] || "bg-gray-400"}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-3">{user.phone}</td>
                  <td className="p-3">{user.location || "-"}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}
