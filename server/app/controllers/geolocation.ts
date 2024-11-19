import { Request, Response } from "express";
import axios from "axios";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

const REVERSE_GEOCODING_URL = process.env.REVERSE_GEOCODING_URL;

export async function geolocation(req: Request, res: Response) {
  if (!REVERSE_GEOCODING_URL) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    return;
  }
  try {
    const { lat, lng } = req.query;
    const { data, status } = await axios.get(
      REVERSE_GEOCODING_URL.replace("{{LAT}}", lat as string).replace(
        "{{LNG}}",
        lng as string
      )
    );
    console.log({ data, status });
    res.status(StatusCodes.OK).json(data);
  } catch (error) {
    console.log({ error });
  }
}
