import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore, User } from "../../context/authStore";
import {
  Eye,
  EyeOff,
  UserIcon,
  Phone,
  Lock,
  Users,
  ArrowLeft,
  Loader2,
  MapPin, // Added MapPin
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number required"),
  location: z.string().min(2, "Location is required"), // New field
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["farmer", "buyer", "supplier"], "Please select a role"),
});

type RegisterInput = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", data);

      // Check if registration was successful
      if (res.status === 201 || res.status === 200) {
        // Handle different response scenarios
        if (res.data.token && res.data.user) {
          // User is immediately active
          setUser(res.data.user);
          localStorage.setItem("token", res.data.token);
          toast.success("Registration successful! Welcome!");
          navigate(`/${res.data.user.role}/dashboard`);
        } else {
          // User needs approval (no token provided)
          const approvalMessage =
            res.data.message ||
            "Registration successful! Your account is pending approval from the admin.";

          // Show success toast for pending approval
          toast.success(approvalMessage);

          // Show loading spinner and redirect after delay
          setRedirecting(true);
          setTimeout(() => {
            navigate("/login", {
              state: {
                message:
                  "Your account is pending approval. You'll be notified once approved.",
                type: "info",
              },
            });
          }, 2000);
        }
      } else {
        // Unexpected success status
        toast.error("Registration failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Registration error:", err);

      // Handle different types of errors
      if (err.response?.status === 400) {
        toast.error(err.response.data?.msg || "Invalid registration data");
      } else if (err.response?.status === 409) {
        toast.error("User already exists with this phone number");
      } else if (err.response?.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(
          err.response?.data?.msg ||
            err.message ||
            "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
      // Don't reset redirecting here as we want to keep showing spinner during redirect
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      style={{
        backgroundImage: `url('/bg-register.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 backdrop-blur-sm bg-opacity-90">
        {/* Icon avatar */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 text-green-600 p-3 rounded-full">
            <UserIcon className="w-6 h-6" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">
          Create Account
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Sign up to get started
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <input
                {...register("name")}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <UserIcon className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <input
                {...register("phone")}
                placeholder="07XXXXXXXX"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Phone className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="relative">
              <input
                {...register("location")}
                placeholder="Your City, Country"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <MapPin className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">
                {errors.location.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="********"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Lock className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Role
            </label>
            <div className="relative">
              <select
                {...register("role")}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Select Your Role --</option>
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
              </select>
              <Users className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full py-2 rounded-md font-semibold text-white bg-green-600 hover:bg-green-700 transition-all ${
              loading || redirecting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading || redirecting}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Account...
              </div>
            ) : redirecting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirecting to login...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm">
          <p className="text-gray-500 mb-1">Already have an account?</p>
          <Link
            to="/login"
            className="text-green-600 font-semibold inline-flex items-center gap-1 hover:underline hover:text-green-700 transition"
          >
            <ArrowLeft size={16} /> Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Register;
