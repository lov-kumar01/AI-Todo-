import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResetPasswordInput,
  resetPasswordSchema
} from "../schemas/authSchemas";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordRequest } from "../api/authApi";
import { Link } from "react-router-dom";

export const ResetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema)
  });

  const mutation = useMutation({
    mutationFn: resetPasswordRequest
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white p-6 rounded shadow space-y-5">
        <h1 className="text-2xl font-semibold text-center">Reset Password</h1>

        <form
          onSubmit={handleSubmit((v) => mutation.mutate(v))}
          className="space-y-3"
        >
          <div>
            <label className="text-m font-medium">Reset Token</label>
            <input
              type="text"
              {...register("token")}
              className="w-full border p-2 rounded mt-1"
            />
            {errors.token && (
              <p className="text-red-500 text-xs">{errors.token.message}</p>
            )}
          </div>

          <div>
            <label className="text-m font-medium">New Password</label>
            <input
              type="password"
              {...register("newPassword")}
              className="w-full border p-2 rounded mt-1"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {mutation.data && (
            <p className="text-green-600 text-xs">
              {mutation.data.message}
            </p>
          )}

          <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
            Reset Password
          </button>
        </form>

        <Link className="text-blue-600 text-m hover:underline" to="/login">
          Back to Login
        </Link>
      </div>
    </div>
  );
};
