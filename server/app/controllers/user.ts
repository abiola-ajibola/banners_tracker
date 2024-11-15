import { Request, Response } from "express";
import { userService } from "../services/db/models";
import { JwtPayload, verify } from "jsonwebtoken";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export async function getUser(req: Request, res: Response) {
  try {
    if (!process.env.JWT_SECRET) throw "JWT_SECRET env variable not set";
    console.dir({ cookies: req.cookies }, { depth: 3 });
    if (!req.cookies.authorization) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: ReasonPhrases.UNAUTHORIZED });
      return;
    }
    const data = verify(
      req.cookies.authorization,
      process.env.JWT_SECRET
    ) as JwtPayload;
    const user = await userService.getOne({ email: data.email });
    console.log({ user });
    if (!user) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: ReasonPhrases.NOT_FOUND });
      return;
    }
    res.status(StatusCodes.OK).json(user);
  } catch (err) {
    console.log({ err });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
}
