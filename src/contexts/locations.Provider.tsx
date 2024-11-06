import { PropsWithChildren, useState } from "react";
import { Position } from "../pages/Home";
import { locationsContext } from "./locations";

export function LocationsProvider({ children }: PropsWithChildren) {
  const [locations, setLocations] = useState<{ [key: string]: Position }[]>([]);

  return (
    <locationsContext.Provider value={{ locations: locations, setLocations }}>
      {children}
    </locationsContext.Provider>
  );
}
