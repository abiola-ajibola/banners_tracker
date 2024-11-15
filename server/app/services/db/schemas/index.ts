import { Document, Model, Types } from "mongoose";
export type TModel<T> = Model<
  T,
  object,
  object,
  object,
  Document<unknown, object, T> &
    T & {
      _id: Types.ObjectId;
    } & {
      __v: number;
    },
  unknown
>;

export { User, IUser } from "./user";
export {TMapLocation, TPosition, MapLocation} from "./location"
