import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { db } from "./services/db/index";
import {
  validateAllLocationsQuery,
  validateAuth,
  validateLocation,
  validateOtp,
  validateQuery,
} from "./middlewares/validation";
import {
  authenticate,
  verifyEmail,
  verifyOTP,
  getLocations,
  updateLocation,
  getUser,
  geolocation,
  getAllLocations,
} from "./controllers";
import { isAuthorized, isAdmin } from "./middlewares/authorization";
import { getAllUsers } from "./controllers/user";

const app = express();

const { JWT_SECRET, DATABASE_URL, DB_NAME, NODE_ENV } = process.env;
const PORT = process.env.PORT || 4000;

if (!JWT_SECRET || !DATABASE_URL || !DB_NAME) {
  throw "Environment varables absent:\nCheck JWT_SECRET, DATABASE_URL, and DB_NAME";
}

db.connect(DATABASE_URL);

const root = path.resolve(
  NODE_ENV === "development" ? "../dist" : "./dist"
);
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
app.put("/banner-location", isAuthorized, validateLocation, updateLocation);
app.get("/banner-locations", isAuthorized, getLocations);
app.get(
  "/all-locations",
  validateAllLocationsQuery,
  isAuthorized,
  isAdmin,
  getAllLocations
);
app.get("/users", validateQuery, isAuthorized, isAdmin, getAllUsers);
app.get("/geolocation", isAuthorized, geolocation);
app.get("/auth/verify/:token", verifyEmail);
app.post("/auth/login/verify", validateOtp, verifyOTP);

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
