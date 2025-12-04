import { Schema, model, Document } from "mongoose";

export interface IActivityLog extends Document {
  userId: string;
  todoId?: string;
  event: string;
  meta?: any;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivityLog>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  todoId: { type: Schema.Types.ObjectId, ref: "Todo" },
  event: { type: String, required: true }, // e.g., "create","focus_complete","delete"
  meta: { type: Schema.Types.Mixed },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default model<IActivityLog>("ActivityLog", ActivitySchema);
