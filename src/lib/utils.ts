import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Position } from "../pages/Home";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function locatePosition(cb: (position: Position) => void) {
  navigator.geolocation.getCurrentPosition((position) => {
    cb({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  });
}
