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
} from "lucide-react";
import { useState } from "react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["farmer", "buyer", "supplier"], {
    required_error: "Please select a role",
  }),
});

type RegisterInput = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
      const res = await api.post<{ user: User; token: string }>(
        "/auth/register",
        data
      );
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      navigate(`/${res.data.user.role}/dashboard`);
    } catch (err: any) {
      alert(
        "Registration failed: " + err.response?.data?.msg || "Unknown error"
      );
    } finally {
      setLoading(false);
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
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
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
