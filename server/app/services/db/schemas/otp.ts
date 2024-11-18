import { model, Schema } from "mongoose";

export interface IOTP {
  value: string;
  email: string;
  expiresIn?: number;
}

const OTPSchema = new Schema<IOTP>({
  value: { type: String, required: true },
  email: { type: String, required: true },
  expiresIn: { type: Number, required: true },
});

export const OTP = model("Otp", OTPSchema);
