import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  // Basic auth
  email: string;
  password: string;

  // Profile information
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  profilePicture?: string;

  // Preferences
  theme?: "light" | "dark";
  language?: string;
  notificationsEnabled?: boolean;

  // Account status
  isActive?: boolean;
  isVerified?: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;

  // Password reset
  resetToken?: string;
  resetTokenExpiry?: Date;

  // Activity
  activityHistory: string[];
  lastLogin?: Date;

  // Timestamps (auto-managed by MongoDB)
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    // Basic auth
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    // Profile information
    firstName: {
      type: String,
      default: ""
    },

    lastName: {
      type: String,
      default: ""
    },

    phone: {
      type: String,
      default: null
    },

    bio: {
      type: String,
      default: ""
    },

    profilePicture: {
      type: String,
      default: null
    },

    // Preferences
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "dark"
    },

    language: {
      type: String,
      default: "en"
    },

    notificationsEnabled: {
      type: Boolean,
      default: true
    },

    // Account status
    isActive: {
      type: Boolean,
      default: true
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    verificationToken: {
      type: String,
      default: null
    },

    verificationTokenExpiry: {
      type: Date,
      default: null
    },

    // Password reset
    resetToken: {
      type: String,
      default: null
    },

    resetTokenExpiry: {
      type: Date,
      default: null
    },

    // Activity tracking
    activityHistory: {
      type: [String],
      default: []
    },

    lastLogin: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);