import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterInput, registerSchema } from "../schemas/authSchemas";
import { useMutation } from "@tanstack/react-query";
import { registerRequest } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, UserPlus } from "lucide-react";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema)
  });

  const mutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      navigate("/todos");
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-900 relative overflow-hidden px-6">

      {/* Neon glowing circles */}
      <div className="absolute top-12 left-16 w-52 h-52 rounded-full bg-purple-600/30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-16 right-16 w-60 h-60 rounded-full bg-fuchsia-500/30 blur-3xl animate-pulse"></div>

      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl relative z-10">

        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-pink-300 to-purple-300 text-transparent bg-clip-text mb-6 drop-shadow-[0_0_10px_rgba(255,0,200,0.3)]">
          ✨ Create Your Account
        </h1>

        <p className="text-center text-gray-300 mb-6 text-m">
          Join the most beautiful and smart to-do experience 💫
        </p>

        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="text-gray-300 text-m">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full p-3 mt-1 bg-black/20 border border-white/20 rounded-xl text-white focus:ring focus:ring-purple-400 outline-none"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-300 text-m">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full p-3 mt-1 bg-black/20 border border-white/20 rounded-xl text-white focus:ring focus:ring-purple-400 outline-none"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Error Box */}
          {mutation.error && (
            <p className="text-red-400 text-xs text-center">
              {(mutation.error as any)?.response?.data?.message ||
                "Registration failed"}
            </p>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-400 text-black font-semibold hover:scale-105 transition flex items-center justify-center gap-2 shadow-lg"
          >
            <UserPlus size={20} />
            {mutation.isPending ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="text-center text-m text-gray-300 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-300 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
