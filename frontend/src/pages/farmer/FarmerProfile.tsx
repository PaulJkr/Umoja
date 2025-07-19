import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../context/authStore";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import toast from "react-hot-toast";
import api from "../../api/axios";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage";

type ProfileForm = {
  name: string;
  phone: string;
  location: string;
  avatar?: FileList;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
};

export const FarmerProfilePage: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<ProfileForm>();

  const {
    register: registerPwd,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { isSubmitting: pwdSubmitting, errors: pwdErrors },
  } = useForm<PasswordForm>();

  const [preview, setPreview] = useState<string | null>(null);
  // ✅ Fix: Properly type the croppedAreaPixels state
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [cropping, setCropping] = useState(false);
  const [hasExistingPassword, setHasExistingPassword] = useState<boolean | null>(null);
  // ✅ Add state for crop and zoom
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (user) {
      setValue("name", user.name || "");
      setValue("phone", user.phone || "");
      setValue("location", user.location || "");
    }
  }, [user, setValue]);

  // ✅ Check if user has existing password using dedicated endpoint
  useEffect(() => {
    const checkPasswordStatus = async () => {
      if (!user?._id) return;

      try {
        const response = await api.get(`/users/password-status/${user._id}`);
        setHasExistingPassword(response.data.hasPassword);
      } catch (err: any) {
        console.error("Error checking password status:", err);
        // Default to assuming user has password to be safe
        setHasExistingPassword(true);
      }
    };

    if (user?._id && hasExistingPassword === null) {
      checkPasswordStatus();
    }
  }, [user?._id, hasExistingPassword]);

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropImage(reader.result as string);
        setCropping(true);
        // Reset crop states
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const cropAndPreview = async () => {
    if (!cropImage || !croppedAreaPixels) {
      toast.error("Please select an area to crop");
      return;
    }

    try {
      // ✅ Fix: Handle the return type properly
      const croppedResult = await getCroppedImg(cropImage, croppedAreaPixels);

      // ✅ Check if the result is a Blob or has a different structure
      let blobToUse: Blob;

      if (croppedResult instanceof Blob) {
        blobToUse = croppedResult;
      } else if (
        croppedResult &&
        typeof croppedResult === "object" &&
        "file" in croppedResult
      ) {
        // Handle case where getCroppedImg returns { file: File, url: string }
        blobToUse = (croppedResult as any).file;
      } else {
        throw new Error("Invalid crop result");
      }

      const objectUrl = URL.createObjectURL(blobToUse);
      setPreview(objectUrl);
      setCropping(false);
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Failed to crop image. Please try again.");
    }
  };

  const cancelCrop = () => {
    setCropping(false);
    setCropImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const onSubmit = async (data: ProfileForm) => {
    if (!user?._id) {
      toast.error("User not found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("location", data.location);

    if (preview) {
      try {
        const blob = await fetch(preview).then((r) => r.blob());
        formData.append("avatar", blob, "avatar.jpg");
      } catch (error) {
        console.error("Error processing preview image:", error);
        toast.error("Error processing image. Please try again.");
        return;
      }
    } else if (data.avatar?.[0]) {
      formData.append("avatar", data.avatar[0]);
    }

    try {
      const res = await api.put(`/users/profile/${user._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.updatedUser) {
        setUser({ ...user, ...res.data.updatedUser });
        toast.success("Profile updated successfully!");
        // Clean up preview URL
        if (preview) {
          URL.revokeObjectURL(preview);
          setPreview(null);
        }
      }
    } catch (err: any) {
      console.error("Profile update error:", err);
      toast.error(err.response?.data?.message || "Profile update failed");
    }
  };

  const onChangePassword = async (data: PasswordForm) => {
    if (!user?._id) {
      toast.error("User not found. Please log in again.");
      return;
    }

    try {
      // ✅ Send both fields, backend will handle the logic
      const response = await api.put(`/users/change-password/${user._id}`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      // ✅ Handle different types of password operations
      if (response.data.isInitialPassword) {
        toast.success(
          "Password set successfully! You can now use this password to log in."
        );
        setHasExistingPassword(true);
      } else {
        toast.success("Password updated successfully!");
      }

      resetPasswordForm();
    } catch (err: any) {
      console.error("Password change error:", err);

      const errorMessage =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Failed to change password";

      // ✅ Handle specific error cases
      if (errorMessage.includes("Current password is required")) {
        setHasExistingPassword(true);
        toast.error("Please enter your current password to change it.");
      } else if (errorMessage.includes("Incorrect current password")) {
        toast.error("Your current password is incorrect. Please try again.");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  // ✅ Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if (!user) {
    return (
      <div className="p-6 max-w-2xl mx-auto w-full">
        <div className="text-center">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const userWithAvatar = user as any;
  const hasAvatar = userWithAvatar?.avatar;

  return (
    <div className="p-6 max-w-2xl mx-auto w-full">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

      {/* PROFILE FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Current Avatar Display */}
        {hasAvatar && !preview && (
          <div>
            <Label>Current Avatar</Label>
            <img
              src={`http://localhost:5000${hasAvatar}`}
              alt="Current Avatar"
              className="w-20 h-20 rounded-full object-cover border mt-2"
              onError={(e) => {
                console.error("Failed to load avatar:", hasAvatar);
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Preview Cropped Avatar */}
        {preview && (
          <div>
            <Label>Preview New Avatar</Label>
            <div className="flex items-center gap-4 mt-2">
              <img
                src={preview}
                className="w-20 h-20 rounded-full object-cover border"
                alt="Preview"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  URL.revokeObjectURL(preview);
                  setPreview(null);
                }}
              >
                Remove Preview
              </Button>
            </div>
          </div>
        )}

        {/* Avatar Upload */}
        <div>
          <Label htmlFor="avatar">Change Avatar</Label>
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            {...register("avatar")}
            onChange={onAvatarChange}
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload an image to crop and set as your avatar
          </p>
        </div>

        {/* ✅ Fix: Image Cropper with proper props */}
        {cropping && cropImage && (
          <div className="space-y-4">
            <Label>Crop Your Avatar</Label>
            <div className="relative w-full h-[300px] bg-gray-200 rounded">
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={1} // Square aspect ratio for avatar
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(
                  croppedArea: Area,
                  croppedAreaPixels: Area
                ) => {
                  setCroppedAreaPixels(croppedAreaPixels);
                }}
                cropShape="round"
                showGrid={false}
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" onClick={cropAndPreview}>
                Confirm Crop
              </Button>
              <Button type="button" variant="outline" onClick={cancelCrop}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Form Fields */}
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
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
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
            <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
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
            <p className="text-sm text-red-500 mt-1">
              {errors.location.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || cropping}
          className="w-full"
        >
          {isSubmitting ? "Updating..." : "Save Changes"}
        </Button>
      </form>

      {/* PASSWORD CHANGE SECTION */}
      <div className="mt-10 pt-6 border-t">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">
            {hasExistingPassword === false
              ? "Set Your Password"
              : "Change Password"}
          </h3>
          {hasExistingPassword === null && (
            <span className="text-sm text-gray-500">Loading...</span>
          )}
        </div>

        {hasExistingPassword === false && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Notice:</strong> You don't have a password set yet. Please
              create one below to secure your account.
            </p>
          </div>
        )}

        <form
          onSubmit={handlePasswordSubmit(onChangePassword)}
          className="space-y-4"
        >
          {/* ✅ Only show current password field if user has existing password */}
          {hasExistingPassword !== false && (
            <div>
              <Label htmlFor="currentPassword">Current Password *</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter your current password"
                {...registerPwd("currentPassword", {
                  required:
                    hasExistingPassword === true
                      ? "Current password is required"
                      : false,
                })}
              />
              {pwdErrors.currentPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {pwdErrors.currentPassword.message}
                </p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="newPassword">
              {hasExistingPassword === false
                ? "New Password *"
                : "New Password *"}
            </Label>
            <Input
              id="newPassword"
              type="password"
              placeholder={
                hasExistingPassword === false
                  ? "Create a password (at least 6 characters)"
                  : "Enter your new password"
              }
              {...registerPwd("newPassword", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {pwdErrors.newPassword && (
              <p className="text-sm text-red-500 mt-1">
                {pwdErrors.newPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={pwdSubmitting} className="w-full">
            {pwdSubmitting
              ? hasExistingPassword === false
                ? "Setting Password..."
                : "Changing Password..."
              : hasExistingPassword === false
              ? "Set Password"
              : "Change Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};
