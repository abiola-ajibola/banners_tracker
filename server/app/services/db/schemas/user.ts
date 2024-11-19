import { Schema, model } from "mongoose";

export interface IUser {
  email: string;
  role: "admin" | "client";
  verified?: boolean;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "client",
    },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
