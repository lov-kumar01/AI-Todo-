import axiosClient from "./axiosClient";
import {
  authResponseSchema,
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput
} from "../schemas/authSchemas";
import { z } from "zod";

// REGISTER
export const registerRequest = async (data: RegisterInput) => {
  const res = await axiosClient.post("/auth/register", data);
  return authResponseSchema.parse(res.data);
};

// LOGIN
export const loginRequest = async (data: LoginInput) => {
  const res = await axiosClient.post("/auth/login", data);
  return authResponseSchema.parse(res.data);
};

// FORGOT PASSWORD
export const forgotPasswordRequest = async (data: ForgotPasswordInput) => {
  const schema = z.object({
    message: z.string(),
    resetToken: z.string().optional()
  });

  const res = await axiosClient.post("/auth/forgot-password", data);
  return schema.parse(res.data);
};

// RESET PASSWORD
export const resetPasswordRequest = async (data: ResetPasswordInput) => {
  const schema = z.object({
    message: z.string()
  });

  const res = await axiosClient.post("/auth/reset-password", data);
  return schema.parse(res.data);
};
