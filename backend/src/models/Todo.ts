import { Schema, model, Types, Document } from "mongoose";

export interface ITodo extends Document {
  title: string;
  description?: string;
  estimatedMinutes?: number;
  userId: Types.ObjectId;
  createdAt: Date;
  completed: boolean;
}

const TodoSchema = new Schema<ITodo>(
  {
    title: { type: String, required: true },
    description: { type: String },
    estimatedMinutes: { type: Number, default: 25 },
    userId: {
      type: Schema.Types.ObjectId, // ✔ FIXED
      ref: "User",
      required: true
    },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Todo = model<ITodo>("Todo", TodoSchema);
