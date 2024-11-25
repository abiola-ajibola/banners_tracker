import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { JwtPayload, verify } from "jsonwebtoken";
import { userService } from "../../services/db/models";

export async function isAuthorized(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.cookies?.authorization) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: ReasonPhrases.UNAUTHORIZED });
    return;
  }

  const data = verify(
    req.cookies.authorization,
    process.env.JWT_SECRET as string
  ) as JwtPayload;
  // console.log({ data });
  const user = await userService.getOne({ email: data.email });
  console.log({ user });
  if (!user) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: ReasonPhrases.UNAUTHORIZED });
    return;
  }
  next();
}
