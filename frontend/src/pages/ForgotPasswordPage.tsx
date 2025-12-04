import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ForgotPasswordInput,
  forgotPasswordSchema
} from "../schemas/authSchemas";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordRequest } from "../api/authApi";
import { Link } from "react-router-dom";

export const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const mutation = useMutation({
    mutationFn: forgotPasswordRequest
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white p-6 rounded shadow space-y-5">
        <h1 className="text-2xl font-semibold text-center">Forgot Password</h1>

        <form
          onSubmit={handleSubmit((v) => mutation.mutate(v))}
          className="space-y-3"
        >
          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full border p-2 rounded mt-1"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Success message */}
          {mutation.data && (
            <p className="text-green-600 text-xs mt-1">
              {mutation.data.message}
            </p>
          )}

          <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Send Reset Link
          </button>
        </form>

        <Link to="/login" className="text-sm text-blue-600 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
};
