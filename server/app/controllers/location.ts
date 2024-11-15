import { Request, Response } from "express";
import { locationService } from "../services/db/models";
import { TMapLocation } from "../services/db/schemas";
import { StatusCodes } from "http-status-codes";

export async function updateLocation(req: Request, res: Response) {
  const body: TMapLocation & { _id?: string } = req.body;
  console.log({ b: { ...body, image_url: "" } });
  if (!body) {
    console.log("request has no body");
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "request has no body" });
    return;
  }
  if (body._id) {
    const data = await locationService.updateOneById(body._id, body);
    console.log({ data });
    res.status(StatusCodes.OK).json(body);
    return;
  }
  const data = await locationService.insertOne(body);
  res.status(StatusCodes.CREATED).json(data);
}
