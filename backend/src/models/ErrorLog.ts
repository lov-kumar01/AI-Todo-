import { Schema, model, Document } from "mongoose";

export interface IErrorLog extends Document {
  message: string;
  stack?: string;
  path?: string;
  method?: string;
  userId?: string;
}

const errorLogSchema = new Schema<IErrorLog>(
  {
    message: {
      type: String,
      required: true
    },
    stack: {
      type: String
    },
    path: {
      type: String
    },
    method: {
      type: String
    },
    userId: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export const ErrorLog = model<IErrorLog>("ErrorLog", errorLogSchema);
