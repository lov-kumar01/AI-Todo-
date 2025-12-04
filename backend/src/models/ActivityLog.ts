import mongoose, { Schema, model, Document } from "mongoose";

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
  todoId?: mongoose.Types.ObjectId;
  event: string;
  meta?: any;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivityLog>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // ✅ FIXED
      ref: "User",
      required: true,
    },

    todoId: {
      type: mongoose.Schema.Types.ObjectId, // ✅ FIXED
      ref: "Todo",
    },

    event: { type: String, required: true },

    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default model<IActivityLog>("ActivityLog", ActivitySchema);
