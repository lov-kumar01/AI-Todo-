import { z } from "zod";

/* ---------------------------
   REGISTER SCHEMA
---------------------------- */
export const registerSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
});

export type RegisterInput = z.infer<typeof registerSchema>;

/* ---------------------------
   LOGIN SCHEMA
---------------------------- */
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required")
});

export type LoginInput = z.infer<typeof loginSchema>;

/* ---------------------------
   FORGOT PASSWORD
---------------------------- */
export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/* ---------------------------
   RESET PASSWORD
---------------------------- */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters")
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/* ---------------------------
   AUTH RESPONSE SCHEMA
---------------------------- */
export const authResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email()
  }),
  token: z.string()
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
