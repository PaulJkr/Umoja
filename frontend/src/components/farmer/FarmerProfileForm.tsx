import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/context/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AvatarUploader } from "./AvatarUploader";
import toast from "react-hot-toast";
import axios from "axios";

const FarmerProfileForm = () => {
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [location, setLocation] = useState(user?.location || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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

      const { data } = await axios.put(
        `/api/farmer/profile/${user?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(data.updatedUser);
      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto p-4">
      <h2 className="text-xl font-semibold">Edit Profile</h2>

      <AvatarUploader onCropped={setAvatarFile} existingImage={user?.avatar} />

      <div className="grid gap-4">
        <div>
          <label className="block text-sm mb-1">Full Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Phone</label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Location</label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};

export default FarmerProfileForm;
