import { Schema, model } from "mongoose";

export type TPosition = { lat: number; lng: number };
export type TMapLocation = {
  coords: TPosition;
  image_url?: string;
  email: string;
};

const locationSchema = new Schema<TMapLocation>(
  {
    email: {
      type: String,
      required: true,
    },
    coords: {
      lat: Number,
      lng: Number,
    },
    image_url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const MapLocation = model<TMapLocation>("MapLocation", locationSchema);
