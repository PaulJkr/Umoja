import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/context/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AvatarUploader } from "./AvatarUploader";
import toast from "react-hot-toast";
import api from "@/api/axios";

const FarmerProfileForm = () => {
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [location, setLocation] = useState(user?.location || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      setLocation(user.location || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("location", location);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const { data } = await api.put(
        `/farmer/profile/${user?._id}`,
        formData
      );

      setUser(data.updatedUser);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await api.put(`/farmer/change-password/${user?._id}`, {
        currentPassword,
        newPassword,
      });

      toast.success("Password updated!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(
        err.response?.data?.msg || "Failed to update password"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto p-4">
      <h2 className="text-xl font-semibold">Edit Profile</h2>

      <AvatarUploader onCropped={setAvatarFile} existingImage={user?.avatar} />

      <div className="grid gap-4">
        <div>
          <label className="block text-sm mb-1">Full Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Phone</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Location</label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>

      {/* Password Section */}
      <div className="mt-10 border-t pt-6 space-y-4">
        <h3 className="text-lg font-semibold">Change Password</h3>

        <div>
          <label className="block text-sm mb-1">Current Password</label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">New Password</label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Confirm New Password</label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <Button type="button" onClick={handlePasswordChange}>
          Update Password
        </Button>
      </div>
    </form>
  );
};

export default FarmerProfileForm;
