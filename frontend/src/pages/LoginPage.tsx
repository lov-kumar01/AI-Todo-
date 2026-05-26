import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput, loginSchema } from "../schemas/authSchemas";
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      navigate("/todos");
    },
  });

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1974&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Animated Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="absolute h-[500px] w-[500px] rounded-full bg-cyan-500/30 blur-[140px]"
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-20 w-full max-w-md"
      >
        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl shadow-2xl">

          <h1 className="mb-8 text-center text-4xl font-bold text-white">
            Welcome Back ✨
          </h1>

          <form
            onSubmit={handleSubmit((v) => mutation.mutate(v))}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label className="text-sm text-gray-300">
                Email
              </label>

              <input
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-gray-400 focus:border-cyan-400"
              />

              {errors.email && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-300">
                Password
              </label>

              <input
                type="password"
                {...register("password")}
                placeholder="Enter your password"
                className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-gray-400 focus:border-cyan-400"
              />

              {errors.password && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Error */}
            {mutation.error && (
              <p className="text-center text-sm text-red-400">
                {(mutation.error as any)?.response?.data?.message ||
                  "Login failed"}
              </p>
            )}

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-white transition-all hover:bg-cyan-400"
            >
              {mutation.isPending
                ? "Logging in..."
                : "Login"}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-300">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-cyan-300"
            >
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};