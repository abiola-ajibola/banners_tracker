import { NextFunction, Request, Response } from "express";
import { number, object, string } from "yup";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

const locationValidationSchema = object({
  email: string().email("Invalid email").required(),
  coords: object({
    lat: number().required("lat not present in coords"),
    lng: number().required("lng not present in coords")
  }),
  image_url: string()
});

export const validateLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await locationValidationSchema.validate(req.body);
    next();
  } catch (err) {
    console.log({ err });
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: ReasonPhrases.BAD_REQUEST });
  }
};
