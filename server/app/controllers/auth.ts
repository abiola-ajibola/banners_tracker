import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { userService } from "../services/db/models";
import { sendVerificationMail } from "../services/email";

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
    // console.log(auth_token);
    res
      .cookie("authorization", auth_token, {
        httpOnly: process.env.NODE_ENV == "production",
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
      console.log("verified")
      const auth_token = sign({ _id: user._id, email: user.email }, JWT_SECRET);
      console.log({ auth_token });
      res
        .cookie("authorization", auth_token, {
          httpOnly: process.env.NODE_ENV == "production",
        })
        .status(StatusCodes.OK)
        .json(user);
      return;
    }

    if (req.body.reset) {
      const data = await userService.updateOneById(user.id, req.body);
      if (data) {
        const token = sign(data.toObject(), JWT_SECRET, { expiresIn: "1h" });
        await sendVerificationMail(data.email, token);
        console.log({ up: data });
        res.status(StatusCodes.OK).json(data);
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
