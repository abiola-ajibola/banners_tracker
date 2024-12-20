import { NextFunction, Request, Response } from "express";
import { number, object, string } from "yup";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

const locationValidationSchema = object({
  email: string().email("Invalid email").required(),
  coords: object({
    lat: number().required("lat not present in coords"),
    lng: number().required("lng not present in coords"),
  }),
  image_url: string(),
});

const allLocationsQuerySchema = object({
  page: number().nullable(),
  perPage: number().nullable(),
  email: string().email("Invalid email address").nullable(),
  address: string().nullable(),
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

export const validateAllLocationsQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query = req.query;
  console.log({ query });
  try {
    await allLocationsQuerySchema.validate({
      page: query.page,
      perPage: query.perPage,
      email: query.userEmail,
      address: query.address,
    });
    next();
  } catch (err) {
    console.log({ err });
    res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).name });
  }
};
