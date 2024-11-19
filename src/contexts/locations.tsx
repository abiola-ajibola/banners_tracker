import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { MapLocation } from "../types";

export const locationsContext = createContext<{
  locations: MapLocation[];
  setLocations: Dispatch<
    SetStateAction<MapLocation[]>
  >;
}>({ locations: [], setLocations: () => {} });

export function useLocationsContext() {
  const { locations, setLocations } = useContext(locationsContext);
  return { locations, setLocations };
}
