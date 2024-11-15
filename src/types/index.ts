
export type Position = { lat: number; lng: number };
export type MapLocation = { _id?: string; coords: Position; image_url?: string };
export interface IUser {
    _id: string;
    email: string;
    role: "admin" | "client";
    verified?: boolean;
  }
