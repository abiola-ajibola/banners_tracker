import { PropsWithChildren, useState } from "react";
import { locationsContext } from "./locations";
import { MapLocation } from "../types";

export function LocationsProvider({ children }: PropsWithChildren) {
  const [locations, setLocations] = useState<MapLocation[]>([]);

  return (
    <locationsContext.Provider value={{ locations: locations, setLocations }}>
      {children}
    </locationsContext.Provider>
  );
}
