import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuthStore, User } from "../../context/authStore";

const Login = () => {
  const [form, setForm] = useState({ phone: "", password: "" });
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post<{ token: string; user: User }>(
        "/api/auth/login",
        form
      );
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      navigate(`/${res.data.user.role}/dashboard`);
    } catch (err: any) {
      alert("Login failed: " + err.response?.data?.msg || "Unknown error");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <form onSubmit={handleLogin} className="space-y-4">
        <h1 className="text-2xl font-semibold text-center">Login</h1>

        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="input w-full"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="input w-full"
          required
        />

        <button className="btn w-full bg-green-600 text-white hover:bg-green-700">
          Login
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-green-600 hover:text-green-700 font-medium underline"
          >
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
