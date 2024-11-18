import {MapLocation, TMapLocation, TModel, } from "../schemas";
import { Service } from "./service";

class LocationService extends Service<TMapLocation> {
  constructor(_Model: TModel<TMapLocation>) {
    super(_Model);
  }

  findByEmail(email: string) {
    return this._model.find({ email }).select("-email");
  }
}

export const locationService = new LocationService(MapLocation);
