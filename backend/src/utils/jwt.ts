import jwt, { SignOptions } from "jsonwebtoken";
import { ENV } from "../config/env";

export interface JwtPayload {
  userId: string;
  email: string;
}

export const signToken = (payload: JwtPayload) => {
  const options: SignOptions = {
    expiresIn: ENV.JWT_EXPIRES_IN as any // ← FIXED
  };

  return jwt.sign(payload, ENV.JWT_SECRET as string, options);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, ENV.JWT_SECRET as string) as JwtPayload;
};
