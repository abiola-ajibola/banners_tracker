import {MapLocation, TMapLocation, TModel, } from "../schemas";
import { Service } from "./service";

class LocationService extends Service<TMapLocation> {
  constructor(_Model: TModel<TMapLocation>) {
    super(_Model);
  }

  async findByEmail(email: string) {
    return await this._model.findOne({ email });
  }
}

export const locationService = new LocationService(MapLocation);
