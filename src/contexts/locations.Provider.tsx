import { PropsWithChildren, useEffect, useState } from "react";
import { locationsContext } from "./locations";
import { MapLocation } from "../types";
import { getLocations } from "../lib/api";

export function LocationsProvider({ children }: PropsWithChildren) {
  const [locations, setLocations] = useState<MapLocation[]>([]);
  useEffect(() => {
    const runEffects = async () => {
      const { data, status } = await getLocations();
      if (status === 200) {
        setLocations(data);
      }
    };
    runEffects();
  }, []);

  return (
    <locationsContext.Provider value={{ locations: locations, setLocations }}>
      {children}
    </locationsContext.Provider>
  );
}
