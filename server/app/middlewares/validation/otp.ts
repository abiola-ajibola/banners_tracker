import { NextFunction, Request, Response } from "express";
import { object, string } from "yup";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

const otpSchema = object({
  email: string().email("Invalid email").required(),
  otp: string().min(6, "Invalid OTP").max(6, "Invalid OTP"),
});

export const validateOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await otpSchema.validate(req.body, { strict: true });
    next();
  } catch (err) {
    console.log({ err });
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: ReasonPhrases.BAD_REQUEST });
  }
};
