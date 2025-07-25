import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../api/axios";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import { Button } from "../../../components/ui/button";

const AdminSettings = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      const res = await api.get("/admin/settings");
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (updated: any) => {
      await api.put("/admin/settings", updated);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["platform-settings"] }),
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const updated = {
      platformName: form.get("platformName"),
      commissionRate: parseFloat(form.get("commissionRate") as string),
      currency: form.get("currency"),
      registrationsOpen: form.get("registrationsOpen") === "on",
    };
    mutation.mutate(updated);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Platform Settings</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">
          <div>
            <Label>Platform Name</Label>
            <Input name="platformName" defaultValue={data?.platformName || ""} />
          </div>
          <div>
            <Label>Commission Rate (%)</Label>
            <Input
              name="commissionRate"
              type="number"
              step="0.1"
              defaultValue={data?.commissionRate || 0}
            />
          </div>
          <div>
            <Label>Currency</Label>
            <Input name="currency" defaultValue={data?.currency || ""} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              name="registrationsOpen"
              defaultChecked={data?.registrationsOpen || false}
            />
            <Label>Allow New Registrations</Label>
          </div>

          <Button type="submit" disabled={mutation.isPending}>
            Save Settings
          </Button>
        </form>
      )}
    </div>
  );
};

export default AdminSettings;
