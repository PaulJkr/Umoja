import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuthStore, User } from "../../context/authStore";
import { Eye, EyeOff, Phone, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post<{ token: string; user: User }>(
        "/auth/login",
        form
      );
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      navigate(`/${res.data.user.role}/dashboard`);
    } catch (err: any) {
      alert("Login failed: " + err.response?.data?.msg || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      style={{
        backgroundImage: `url('/bg-login.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Login card */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 backdrop-blur-sm bg-opacity-90">
        {/* Icon avatar */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 text-green-600 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.646 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Sign in to your account
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Phone input */}
          <div>
            <label className="text-sm text-gray-600 font-medium block mb-1">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                placeholder="Enter your phone number"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Phone className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="text-sm text-gray-600 font-medium block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Lock className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-800"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full py-2 rounded-md font-semibold text-white bg-green-600 hover:bg-green-700 transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm">
          <p className="text-gray-500 mb-1">Don't have an account?</p>
          <Link
            to="/register"
            className="text-green-600 font-semibold inline-flex items-center gap-1 hover:underline hover:text-green-700 transition"
          >
            Create one here <ArrowRight size={16} />
          </Link>
        </div>
        <div className="text-center mt-6 text-sm">
          <p className="text-gray-500 mb-1">Back to Home</p>
          <Link
            to="/"
            className="text-green-600 font-semibold inline-flex items-center gap-1 hover:underline hover:text-green-700 transition"
          >
            Home Page <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
