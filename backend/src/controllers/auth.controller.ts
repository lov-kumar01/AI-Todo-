import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { User } from "../models/User";
import { hashPassword, comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashed = await hashPassword(password);

    const user = await User.create({
      email,
      password: hashed
    });

    // Create JWT token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email
    });

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email
      },
      token
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email
    });

    res.json({
      user: {
        id: user._id,
        email: user.email
      },
      token
    });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Don’t reveal user existence for security
    if (!user) {
      return res.json({ message: "If the email exists, reset instructions sent" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    res.json({
      message: "Reset token generated. (In real app, sent via email)",
      resetToken: token
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashed = await hashPassword(newPassword);

    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
};
