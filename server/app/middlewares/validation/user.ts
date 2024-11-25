import { NextFunction, Request, Response } from "express";
import { number, object } from "yup";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

const querySchema = object({
  page: number().nullable(),
  perPage: number().nullable(),
});

export const validateQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query = req.query;
  try {
    await querySchema.validate({ page: query.page, perPage: query.perPage });
    next();
  } catch (err) {
    console.log({ err });
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: ReasonPhrases.BAD_REQUEST });
  }
};
