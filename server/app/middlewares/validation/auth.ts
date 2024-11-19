import { NextFunction, Request, Response } from "express";
import { object, string } from "yup";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

const signupSchema = object({
  email: string().email("Invalid email").required(),
});

export const validateAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await signupSchema.validate(req.body);
    next();
  } catch (err) {
    console.log({ err });
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: ReasonPhrases.BAD_REQUEST });
  }
};
