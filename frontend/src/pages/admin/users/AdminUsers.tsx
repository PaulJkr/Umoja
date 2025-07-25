import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";
import { Skeleton } from "../../../components/ui/skeleton";

interface User {
  _id: string;
  name: string;
  phone: string;
  role: string;
  createdAt: string;
}

const fetchUsers = async ({ queryKey }: any): Promise<User[]> => {
  const [_key, { search, role }] = queryKey;
  const roleQuery = role && role !== "all" ? `&role=${role}` : "";
  const res = await api.get(`/admin/users?search=${search || ""}${roleQuery}`);
  return res.data;
};

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [roleCounts, setRoleCounts] = useState<Record<string, number>>({});

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-users", { search: searchTerm, role: selectedRole }],
    queryFn: fetchUsers,
  });

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/users/${id}`);
      refetch();
      fetchRoleCounts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  const fetchRoleCounts = async () => {
    try {
      const res = await api.get("/admin/users/role-counts");
      setRoleCounts(res.data);
    } catch (err) {
      console.error("Failed to fetch role counts:", err);
    }
  };

  useEffect(() => {
    fetchRoleCounts();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-semibold">Manage Users</h2>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded-md w-64"
          />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border px-2 py-2 rounded-md text-sm"
          >
            <option value="all">All Roles</option>
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        <span className="mr-4">Farmers: {roleCounts.farmer || 0}</span>
        <span className="mr-4">Buyers: {roleCounts.buyer || 0}</span>
        <span className="mr-4">Admins: {roleCounts.admin || 0}</span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      ) : !users?.length ? (
        <p className="text-gray-500 text-center mt-4">No users found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="table-auto w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Role</th>
                <th className="p-3">Created</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t hover:bg-gray-50 transition-all"
                >
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.phone}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {user.role !== "admin" ? (
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
