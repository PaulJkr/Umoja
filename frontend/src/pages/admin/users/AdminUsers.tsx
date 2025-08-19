import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Added useQueryClient
import {
  Search,
  Filter,
  Users,
  UserCheck,
  Shield,
  Calendar,
  Trash2,
  MoreHorizontal,
  Download,
  UserPlus,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api/axios";
import { Skeleton } from "../../../components/ui/skeleton";
import { Button } from "../../../components/ui/button";
import {
  // Added Dialog components
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";

interface User {
  _id: string;
  name: string;
  phone: string;
  role: string;
  createdAt: string;
  location?: string; // Added location
  blocked?: boolean; // Added blocked
  approved?: boolean; // Added approved
}

const fetchUsers = async ({ queryKey }: any): Promise<User[]> => {
  const [_key, { search, role }] = queryKey;
  const roleQuery = role && role !== "all" ? `&role=${role}` : "";
  const res = await api.get(`/admin/users?search=${search || ""}${roleQuery}`);
  return res.data;
};

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
  >
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  </motion.div>
);

const UserRow = ({
  user,
  onDelete,
  onViewDetails, // Added onViewDetails
}: {
  user: User;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void; // Added onViewDetails
}) => {
  const [showActions, setShowActions] = useState(false);

  const getRoleBadge = (role: string) => {
    const configs = {
      farmer: {
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
      },
      buyer: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
      },
      admin: {
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
      },
      supplier: {
        // Added supplier role
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        border: "border-yellow-200",
      },
    };
    const config = configs[role as keyof typeof configs] || configs.farmer;

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-slate-900">{user.name}</p>
            <p className="text-sm text-slate-500">{user.phone}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar size={14} />
          <span className="text-sm">
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {user.role !== "admin" ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowActions(!showActions)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <MoreHorizontal size={16} className="text-slate-600" />
              </Button>

              <AnimatePresence>
                {showActions && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-10"
                  >
                    <button
                      onClick={() => {
                        onViewDetails(user._id); // Added onClick
                        setShowActions(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      <Eye size={14} />
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        onDelete(user._id);
                        setShowActions(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={14} />
                      Delete User
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg">
              <Shield size={14} className="text-slate-500" />
              <span className="text-xs text-slate-600 font-medium">
                Protected
              </span>
            </div>
          )}
        </div>
      </td>
    </motion.tr>
  );
};

const AdminUsers = () => {
  const queryClient = useQueryClient(); // Initialized queryClient
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [roleCounts, setRoleCounts] = useState<Record<string, number>>({});
  const [selectedUserForDetails, setSelectedUserForDetails] =
    useState<User | null>(null); // New state
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // New state

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
      queryClient.invalidateQueries({ queryKey: ["admin-users"] }); // Invalidate to refetch user list
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  const handleViewDetails = async (id: string) => {
    // New function
    try {
      const res = await api.get(`/admin/users/${id}`);
      setSelectedUserForDetails(res.data);
      setIsDetailsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
      alert("Failed to fetch user details.");
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

  const stats = [
    {
      label: "Farmers",
      value: roleCounts.farmer || 0,
      icon: Users,
      color: "bg-gradient-to-br from-green-500 to-green-600",
    },
    {
      label: "Buyers",
      value: roleCounts.buyer || 0,
      icon: UserCheck,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      label: "Admins",
      value: roleCounts.admin || 0,
      icon: Shield,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
  ];

  const handleExport = async () => {
    try {
      const response = await api.get("/admin/users/export", {
        responseType: "blob", // Important: responseType must be 'blob' for file downloads
      });

      // Create a blob from the response data
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users.pdf"); // Set the download filename
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link); // Clean up the DOM
      window.URL.revokeObjectURL(url); // Free up memory
    } catch (error) {
      console.error("Error exporting users:", error);
      alert("Failed to export users. Please try again.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600 mt-1">
            Manage and monitor all platform users
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download size={16} />
            Export
          </Button>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            <UserPlus size={16} />
            Add User
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white min-w-[150px]"
            >
              <option value="all">All Roles</option>
              <option value="farmer">Farmer</option>
              <option value="buyer">Buyer</option>
              <option value="admin">Admin</option>
              {/* Added supplier option */}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
      >
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            ))}
          </div>
        ) : !users?.length ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 text-center"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No users found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search criteria or filters.
            </p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {users.map((user) => (
                    <UserRow
                      key={user._id}
                      user={user}
                      onDelete={handleDelete}
                      onViewDetails={handleViewDetails} // Passed onViewDetails
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* User Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View the comprehensive details of the selected user.
            </DialogDescription>
          </DialogHeader>
          {selectedUserForDetails ? (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-slate-600 font-medium col-span-1">
                  Name:
                </span>
                <span className="col-span-3">
                  {selectedUserForDetails.name}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-slate-600 font-medium col-span-1">
                  Phone:
                </span>
                <span className="col-span-3">
                  {selectedUserForDetails.phone}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-slate-600 font-medium col-span-1">
                  Role:
                </span>
                <span className="col-span-3">
                  {selectedUserForDetails.role}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-slate-600 font-medium col-span-1">
                  Location:
                </span>
                <span className="col-span-3">
                  {selectedUserForDetails.location || "N/A"}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-slate-600 font-medium col-span-1">
                  Created At:
                </span>
                <span className="col-span-3">
                  {new Date(
                    selectedUserForDetails.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-slate-600 font-medium col-span-1">
                  Status:
                </span>
                <span className="col-span-3">
                  {selectedUserForDetails.approved
                    ? "Approved"
                    : "Pending Approval"}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-slate-600 font-medium col-span-1">
                  Blocked:
                </span>
                <span className="col-span-3">
                  {selectedUserForDetails.blocked ? "Yes" : "No"}
                </span>
              </div>
            </div>
          ) : (
            <p>Loading user details...</p>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminUsers;
