import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { Position } from "../pages/Home";

export const locationsContext = createContext<{
  locations: { [key: string]: Position }[];
  setLocations: Dispatch<SetStateAction<{ [key: string]: Position }[]>>;
}>({ locations: [], setLocations: () => {} });

export function useLocationsContext() {
  const { locations, setLocations } = useContext(locationsContext);
  return { locations, setLocations };
}
