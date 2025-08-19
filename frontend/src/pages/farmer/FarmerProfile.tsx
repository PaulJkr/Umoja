import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../context/authStore";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import toast from "react-hot-toast";
import api from "../../api/axios";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage";
import {
  User,
  Phone,
  MapPin,
  Camera,
  Lock,
  Eye,
  EyeOff,
  Save,
  X,
  Check,
  Upload,
  Crop,
  Shield,
  AlertCircle,
} from "lucide-react";

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
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [cropping, setCropping] = useState(false);
  const [hasExistingPassword, setHasExistingPassword] = useState<
    boolean | null
  >(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1, ease: "easeInOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  const cropperVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  useEffect(() => {
    if (user) {
      setValue("name", user.name || "");
      setValue("phone", user.phone || "");
      setValue("location", user.location || "");
    }
  }, [user, setValue]);

  useEffect(() => {
    const checkPasswordStatus = async () => {
      if (!user?._id) return;

      try {
        const response = await api.get(`/users/password-status/${user._id}`);
        setHasExistingPassword(response.data.hasPassword);
      } catch (err: any) {
        console.error("Error checking password status:", err);
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
      const croppedResult = await getCroppedImg(cropImage, croppedAreaPixels);

      let blobToUse: Blob;

      if (croppedResult instanceof Blob) {
        blobToUse = croppedResult;
      } else if (
        croppedResult &&
        typeof croppedResult === "object" &&
        "file" in croppedResult
      ) {
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
      const response = await api.put(`/users/change-password/${user._id}`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

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

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-600 font-medium">Loading profile...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userWithAvatar = user as any;
  const hasAvatar = userWithAvatar?.avatar;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          // @ts-ignore
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header Section */}
          {/* @ts-ignore */}
          <motion.div variants={cardVariants} className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 bg-emerald-500 rounded-xl">
                <User className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Profile Settings
              </h1>
            </div>
            <p className="text-gray-600 max-w-lg mx-auto">
              Manage your account information and security settings
            </p>
          </motion.div>

          {/* Profile Information Card */}
          {/* @ts-ignore */}
          <motion.div variants={cardVariants}>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6 p-6 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                        <AvatarImage
                          src={
                            preview ||
                            (hasAvatar
                              ? `http://localhost:5000${hasAvatar}`
                              : "")
                          }
                          alt="Profile"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-xl font-semibold">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>

                      {preview && (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-700 border-emerald-200"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Ready to save
                        </Badge>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <Label
                          htmlFor="avatar"
                          className="text-sm font-medium text-gray-700"
                        >
                          Profile Picture
                        </Label>
                        <div className="flex items-center space-x-3 mt-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="relative overflow-hidden hover:bg-gray-50 border-2 border-dashed border-gray-300 hover:border-emerald-300 transition-all duration-200"
                            onClick={() =>
                              document.getElementById("avatar")?.click()
                            }
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Image
                          </Button>

                          {preview && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                URL.revokeObjectURL(preview);
                                setPreview(null);
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          )}
                        </div>

                        <Input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          {...register("avatar")}
                          onChange={onAvatarChange}
                          className="hidden"
                        />

                        <p className="text-xs text-gray-500 mt-1">
                          Upload a square image for best results (JPG, PNG)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Image Cropper Modal */}
                  <AnimatePresence>
                    {cropping && cropImage && (
                      <motion.div
                        variants={cropperVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                      >
                        <Card className="w-full max-w-2xl bg-white">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <Crop className="w-5 h-5 text-emerald-600" />
                              <span>Crop Your Avatar</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="relative w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden">
                              <Cropper
                                image={cropImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
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

                            <div className="flex justify-between items-center">
                              <div className="space-y-2">
                                <Label className="text-sm">Zoom</Label>
                                <input
                                  type="range"
                                  min={1}
                                  max={3}
                                  step={0.1}
                                  value={zoom}
                                  onChange={(e) =>
                                    setZoom(Number(e.target.value))
                                  }
                                  className="w-32 accent-emerald-500"
                                />
                              </div>

                              <div className="flex space-x-3">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={cancelCrop}
                                  className="hover:bg-gray-50"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Cancel
                                </Button>
                                <Button
                                  type="button"
                                  onClick={cropAndPreview}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  Apply Crop
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form Fields */}
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700 flex items-center space-x-2"
                      >
                        <User className="w-4 h-4" />
                        <span>Full Name</span>
                        <span className="text-red-500">*</span>
                      </Label>
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
                        className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                      />
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500 flex items-center space-x-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.name.message}</span>
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-medium text-gray-700 flex items-center space-x-2"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Phone Number</span>
                        <span className="text-red-500">*</span>
                      </Label>
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
                        className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                      />
                      {errors.phone && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500 flex items-center space-x-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.phone.message}</span>
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="location"
                        className="text-sm font-medium text-gray-700 flex items-center space-x-2"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>Location</span>
                        <span className="text-red-500">*</span>
                      </Label>
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
                        className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                      />
                      {errors.location && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500 flex items-center space-x-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.location.message}</span>
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || cropping}
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-emerald-200"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Updating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Password Section */}
          <motion.div variants={cardVariants}>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Lock className="w-5 h-5 text-red-600" />
                    </div>
                    <span>
                      {hasExistingPassword === false
                        ? "Set Your Password"
                        : "Change Password"}
                    </span>
                  </CardTitle>

                  {hasExistingPassword === null && (
                    <Badge variant="secondary" className="animate-pulse">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                      Loading...
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {hasExistingPassword === false && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl"
                  >
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">
                          Security Notice
                        </h4>
                        <p className="text-sm text-blue-700 mt-1">
                          You don't have a password set yet. Please create one
                          below to secure your account.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <form
                  onSubmit={handlePasswordSubmit(onChangePassword)}
                  className="space-y-6"
                >
                  {hasExistingPassword !== false && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="currentPassword"
                        className="text-sm font-medium text-gray-700"
                      >
                        Current Password <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Enter your current password"
                          {...registerPwd("currentPassword", {
                            required:
                              hasExistingPassword === true
                                ? "Current password is required"
                                : false,
                          })}
                          className="h-12 pr-12 border-gray-200 focus:border-red-500 focus:ring-red-500 transition-colors"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                      {pwdErrors.currentPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500 flex items-center space-x-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          <span>{pwdErrors.currentPassword.message}</span>
                        </motion.p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label
                      htmlFor="newPassword"
                      className="text-sm font-medium text-gray-700"
                    >
                      {hasExistingPassword === false
                        ? "New Password"
                        : "New Password"}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
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
                        className="h-12 pr-12 border-gray-200 focus:border-red-500 focus:ring-red-500 transition-colors"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                    {pwdErrors.newPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500 flex items-center space-x-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        <span>{pwdErrors.newPassword.message}</span>
                      </motion.p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={pwdSubmitting}
                    className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-red-200"
                  >
                    {pwdSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>
                          {hasExistingPassword === false
                            ? "Setting Password..."
                            : "Changing Password..."}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4" />
                        <span>
                          {hasExistingPassword === false
                            ? "Set Password"
                            : "Change Password"}
                        </span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
