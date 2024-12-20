import { Schema, model } from "mongoose";

export type TPosition = { lat: number; lng: number };
export type TMapLocation = {
  coords: TPosition;
  image_url?: string;
  email: string;
  address?: string
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
    address: String,
  },
  { timestamps: true }
);

locationSchema.index({address: "text"})

export const MapLocation = model<TMapLocation>("MapLocation", locationSchema);
