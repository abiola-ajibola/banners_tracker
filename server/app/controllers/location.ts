import { Request, Response } from "express";
import { locationService } from "../services/db/models";
import { TMapLocation } from "../services/db/schemas";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { JwtPayload, verify } from "jsonwebtoken";
import { AUTH_COOKIE_NAME } from "../constants";

const JWT_SECRET = process.env.JWT_SECRET;

export async function updateLocation(req: Request, res: Response) {
  const body: TMapLocation & { _id?: string } = req.body;
  if (!body) {
    console.log("request has no body");
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "request has no body" });
    return;
  }
  if (body._id) {
    const data = await locationService.updateOneById(body._id, body);
    console.log({ data, body });
    res.status(StatusCodes.OK).json(body);
    return;
  }
  const data = await locationService.insertOne(body);
  res.status(StatusCodes.CREATED).json(data);
}

export async function getLocations(req: Request, res: Response) {
  console.log("GET");
  if (!JWT_SECRET) {
    console.log("JWT_SECRET environment variable not defined");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    return;
  }
  if (!req.cookies?.[AUTH_COOKIE_NAME]) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: ReasonPhrases.UNAUTHORIZED });
    return;
  }
  verify(
    req.cookies[AUTH_COOKIE_NAME],
    JWT_SECRET,
    { complete: true },
    async (error, decoded: JwtPayload | undefined) => {
      if (error) {
        console.log(error);
        if (error.name == "TokenExpiredError") {
          res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: ReasonPhrases.UNAUTHORIZED });
          return;
        }
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: ReasonPhrases.BAD_REQUEST });
      }
      if (decoded) {
        console.log({ decoded_: decoded });
        const locations = await locationService.findByEmail(
          decoded.payload.email
        );
        res.status(200).json(locations);
      }
    }
  );
}
