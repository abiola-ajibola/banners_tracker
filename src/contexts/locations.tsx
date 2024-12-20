import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { MapLocation } from "../types";

export const locationsContext = createContext<{
  locations: MapLocation[];
  setLocations: Dispatch<SetStateAction<MapLocation[]>>;
}>({ locations: [], setLocations: () => {} });

// Does not make any calls to the API, this prevents unnecessary API
// calls when on the locations page in admin mode
const dummyContext = createContext<{
  locations: MapLocation[];
  setLocations: Dispatch<SetStateAction<MapLocation[]>>;
}>({ locations: [], setLocations: () => {} });

export function useLocationsContext(isAdmin: boolean = false) {
  const { locations, setLocations } = useContext(
    isAdmin ? dummyContext : locationsContext
  );
  return { locations, setLocations };
}
