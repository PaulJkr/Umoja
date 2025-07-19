import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../context/authStore";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import toast from "react-hot-toast";
import api from "../../api/axios";

type ProfileForm = {
  name: string;
  phone: string;
  location: string;
  avatar?: FileList;
};

export const FarmerProfilePage: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<ProfileForm>();

  useEffect(() => {
    if (user) {
      setValue("name", user.name || "");
      setValue("phone", user.phone || "");
      setValue("location", user.location || "");
    }
  }, [user, setValue]);

  const onSubmit = async (data: ProfileForm) => {
    if (!user?._id) {
      toast.error("User not found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("location", data.location);

    if (data.avatar && data.avatar.length > 0) {
      formData.append("avatar", data.avatar[0]);
    }

    try {
      // ✅ Fix: Use your existing backend route
      const res = await api.put(`/users/profile/${user._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Update user with response data (your backend returns { updatedUser })
      if (res.data.updatedUser) {
        setUser({
          ...user,
          ...res.data.updatedUser,
        });
      }

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Profile update error:", error);

      // ✅ Better error handling
      if (error.response) {
        const status = error.response.status;
        const message =
          error.response.data?.message || "Failed to update profile";

        if (status === 404) {
          toast.error("User not found. Please try logging in again.");
        } else if (status === 403) {
          toast.error("You don't have permission to update this profile.");
        } else if (status === 413) {
          toast.error("File too large. Please choose a smaller image.");
        } else {
          toast.error(message);
        }
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  if (!user) {
    return (
      <div className="p-6 max-w-2xl mx-auto w-full">
        <div className="text-center">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // ✅ Safe avatar handling
  const userWithAvatar = user as any;
  const hasAvatar = userWithAvatar?.avatar;

  return (
    <div className="p-6 max-w-2xl mx-auto w-full">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* ✅ Avatar display */}
        {hasAvatar && (
          <div className="mb-4">
            <Label>Current Avatar</Label>
            <img
              src={`http://localhost:5000${userWithAvatar.avatar}`}
              alt="Current Avatar"
              className="w-20 h-20 rounded-full object-cover border mt-2"
              onError={(e) => {
                console.log("Avatar failed to load:", userWithAvatar.avatar);
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        <div>
          <Label htmlFor="avatar">Change Avatar</Label>
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            {...register("avatar")}
          />
          <p className="text-sm text-gray-500 mt-1">
            Choose a new image to update your avatar
          </p>
        </div>

        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="e.g., 0712345678"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9+\-\s()]+$/,
                message: "Please enter a valid phone number",
              },
            })}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            placeholder="e.g., Nairobi, Kenya"
            {...register("location", {
              required: "Location is required",
              minLength: {
                value: 2,
                message: "Location must be at least 2 characters",
              },
            })}
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">
              {errors.location.message}
            </p>
          )}
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};
