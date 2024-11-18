import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { db } from "./services/db/index";
import {
  validateAuth,
  validateLocation,
  validateOtp,
} from "./middlewares/validation";
import { authenticate, verifyEmail, verifyOTP } from "./controllers/auth";
import { getUser } from "./controllers/user";
import { getLocations, updateLocation } from "./controllers/location";

const app = express();

const { JWT_SECRET, DATABASE_URL, DB_NAME } = process.env;
const PORT = process.env.PORT || 4000;

if (!JWT_SECRET || !DATABASE_URL || !DB_NAME) {
  throw "Environment varables absent:\nCheck JWT_SECRET, DATABASE_URL, and DB_NAME";
}

db.connect(DATABASE_URL);

const root = path.resolve("../dist");
console.log({ root });
const staticOptions = {
  dotfiles: "deny",
  headers: {
    "x-timestamp": Date.now(),
    "x-sent": true,
  },
};

app.use(express.static("../../dist", staticOptions));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

console.log({ cwd: process.cwd() });

app.get("/me", getUser);
app.post("/auth", validateAuth, authenticate);
app.get("/auth/verify/:token", verifyEmail);
app.post("/auth/login/verify", validateOtp, verifyOTP);
app.put("/banner-location", validateLocation, updateLocation);
app.get("/banner-locations", getLocations);

app.get("/*", (req, res) => {
  console.log(req.url);
  const url = req.url;
  res.sendFile(root + url, (err) => {
    if (err) console.log({ e: err });
    if ((err as Error & { status: number })?.status === 404) {
      return res.sendFile(root + "/index.html");
    }
  });
});

app.listen(+PORT, () => {
  console.log("Listening on port: %d.", +PORT);
});
