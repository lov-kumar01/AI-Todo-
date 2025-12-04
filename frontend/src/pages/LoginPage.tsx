import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput, loginSchema } from "../schemas/authSchemas";
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  });

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      navigate("/todos");
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full frost-card p-8">
        
        <h1 className="text-center text-4xl premium-heading mb-6">
          ✨ Welcome to Today’s Todo List ✨
        </h1>

        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="text-m text-gray-300">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full glow-input p-3 rounded-xl mt-1"
            />
            {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-m text-gray-300">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full glow-input p-3 rounded-xl mt-1"
            />
            {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
          </div>

          {/* Error */}
          {mutation.error && (
            <p className="text-red-400 text-center text-m">
              {(mutation.error as any)?.response?.data?.message || "Login failed"}
            </p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full btn-glow mt-2"
          >
            {mutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-5 text-gray-300 text-m">
          Don’t have an account?{" "}
          <Link to="/register" className="text-pink-300 underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};
