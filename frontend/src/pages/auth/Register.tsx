import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore, User } from "../../context/authStore";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["farmer", "buyer", "admin", "supplier"], {
    required_error: "Please select a role",
  }),
});

type RegisterInput = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const res = await axios.post<{ user: User; token: string }>(
        "/api/auth/register",
        data
      );
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      navigate(`/${res.data.user.role}/dashboard`);
    } catch (err: any) {
      alert(
        "Registration failed: " + err.response?.data?.msg || "Unknown error"
      );
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h1 className="text-2xl font-semibold text-center">Create Account</h1>

        <div>
          <input
            {...register("name")}
            placeholder="Full Name"
            className="input w-full"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("phone")}
            placeholder="Phone Number"
            className="input w-full"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="input w-full"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <select {...register("role")} className="input w-full">
            <option value="">Select Your Role</option>
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer</option>
            <option value="supplier">Supplier</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>

        <button className="btn w-full bg-green-600 text-white hover:bg-green-700">
          Create Account
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 hover:text-green-700 font-medium underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
