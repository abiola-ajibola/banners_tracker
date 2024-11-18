import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { OTPService, userService } from "../services/db/models";
import { sendOTP, sendVerificationMail } from "../services/email";
import { AUTH_COOKIE_NAME } from "../constants";
import { generateOTP } from "../lib";

const JWT_SECRET = process.env.JWT_SECRET;
console.log({ p: process.env.NODE_ENV });

export async function verifyEmail(req: Request, res: Response) {
  const token = req.params.token;
  if (!JWT_SECRET) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    return;
  }
  if (!token) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: ReasonPhrases.UNAUTHORIZED });
  }

  try {
    const data = verify(token, JWT_SECRET || "") as JwtPayload;
    const user = await userService.findByEmail(data.email);
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).redirect("/not_found");
      return;
    }
    console.log({ user, id: user.id });
    userService
      .updateOneById(user._id, { verified: true })
      .then((res) => console.log({ res }))
      .catch((e) => {
        console.log({ e });
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
      });
    const auth_token = sign({ _id: user._id, email: user.email }, JWT_SECRET);
    res
      .cookie(AUTH_COOKIE_NAME, auth_token, {
        httpOnly: process.env.NODE_ENV == "production",
        secure: process.env.NODE_ENV == "production",
      })
      .redirect("/");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log({ err });
    if (err.name == "TokenExpiredError") {
      res.redirect("/auth/token_expired");
    }
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: err?.message.replace("jwt", "token") });
    return;
  }
}

export async function verifyOTP(req: Request, res: Response) {
  if (!JWT_SECRET) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    return;
  }
  const { otp, email } = req.body;
  const data = await OTPService.getOne({ email });
  if (!data) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: ReasonPhrases.NOT_FOUND });
    return;
  }
  if (otp !== data.value) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect OTP" });
    return;
  }
  if (otp === data.value) {
    const result = await OTPService.deleteOne(data._id);
    const user = await userService.getOne({ email });
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
      return;
    }
    const auth_token = sign({ _id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log({ auth_token, data, result });
    res
      .cookie(AUTH_COOKIE_NAME, auth_token, {
        httpOnly: process.env.NODE_ENV == "production",
        secure: process.env.NODE_ENV == "production",
      })
      .status(StatusCodes.OK)
      .json(user);
  }
}

export async function authenticate(req: Request, res: Response): Promise<void> {
  try {
    if (!JWT_SECRET) {
      throw "JWT_SECRET environment variable is not defined";
    }
    const user = await userService.getOne({ email: req.body.email });
    console.log({ user });
    if (!user) {
      const data = await userService.insertOne(req.body);
      const token = sign(data.toObject(), JWT_SECRET, { expiresIn: "7d" });
      await sendVerificationMail(data.email, token);
      res.status(StatusCodes.CREATED).json(data);
      return;
    }

    if (user.verified) {
      try {
        console.log("verified");

        const otp = generateOTP();
        console.log({ otp });
        const otpDoc = await OTPService.getOne({ email: user.email });
        if (otpDoc) {
          const result = await OTPService.updateOneById(otpDoc._id, {
            value: otp,
          });
          if (result) {
            sendOTP(user.email, otp);
            res.status(StatusCodes.OK).json({ email: user.email });
            return
          }
        }
        const result = await OTPService.insertOne({
          email: user.email,
          value: otp,
        });
        sendOTP(user.email, result.value);
        res.status(StatusCodes.OK).json({ email: user.email });
        return;
      } catch (e) {
        console.log({ e });
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
        return;
      }
    }

    if (req.body.reset) {
      const data = await userService.updateOneById(user.id, req.body);
      if (data) {
        const token = sign(data.toObject(), JWT_SECRET, { expiresIn: "1h" });
        await sendVerificationMail(data.email, token);
        console.log({ up: data });
        res.status(StatusCodes.NO_CONTENT);
        return;
      } else throw "Update failed";
    }
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    console.log({ error });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
}
