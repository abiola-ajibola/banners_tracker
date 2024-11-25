import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { JwtPayload, verify } from "jsonwebtoken";
import { userService } from "../../services/db/models";

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const data = verify(
      req.cookies.authorization,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    console.log({ data });

    const user = await userService.findByEmail(data.email);
    if (user?.role === "admin") {
      next();
      return;
    }
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: ReasonPhrases.UNAUTHORIZED });
  } catch (e) {
    console.log(e);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
}
