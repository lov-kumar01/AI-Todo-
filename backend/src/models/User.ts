import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  activityHistory: string[];
  resetToken?: string;
  resetTokenExpiry?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    // For new AI features
    activityHistory: {
      type: [String],
      default: []
    },

    // For forgot/reset password feature
    resetToken: {
      type: String,
      default: null
    },

    resetTokenExpiry: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
