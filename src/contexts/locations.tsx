import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { Position } from "../pages/Home";

export const locationsContext = createContext<{
  locations: { id: string; coords: Position; image_url?: string }[];
  setLocations: Dispatch<
    SetStateAction<{ id: string; coords: Position; image_url?: string }[]>
  >;
}>({ locations: [], setLocations: () => {} });

export function useLocationsContext() {
  const { locations, setLocations } = useContext(locationsContext);
  return { locations, setLocations };
}
