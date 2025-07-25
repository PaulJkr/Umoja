import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../api/axios";
import { Button } from "../../../components/ui/button";

const AdminApprovals = () => {
  const [tab, setTab] = useState<"users" | "products">("users");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["pending-approvals", tab],
    queryFn: async () => {
      const res = await api.get(`/admin/pending-approvals?type=${tab}`);
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const endpoint =
        tab === "users"
          ? `/admin/approve-user/${id}`
          : `/admin/approve-product/${id}`;
      await api.patch(endpoint);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-approvals", tab] });
    },
  });

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Pending Approvals</h2>

      {/* Tab Switcher */}
      <div className="flex space-x-4">
        <Button
          variant={tab === "users" ? "default" : "outline"}
          onClick={() => setTab("users")}
        >
          Users
        </Button>
        <Button
          variant={tab === "products" ? "default" : "outline"}
          onClick={() => setTab("products")}
        >
          Products
        </Button>
      </div>

      {/* Data Table */}
      {isLoading ? (
        <p>Loading...</p>
      ) : data?.length === 0 ? (
        <p className="text-gray-500">No pending {tab} approvals.</p>
      ) : (
        <div className="grid gap-4">
          {data.map((item: any) => (
            <div
              key={item._id}
              className="flex justify-between items-center p-4 border rounded-md"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.email || item.category}
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => mutation.mutate(item._id)}
                disabled={mutation.isPending}
              >
                Approve
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminApprovals;
