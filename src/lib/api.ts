import axios from "axios";
import { IUser, MapLocation } from "../types";

const api = axios.create({
  baseURL: "/",
});

export async function auth(payload: { email: string; reset?: boolean }) {
  const { data, status } = await api.post<IUser>("/auth", payload);
  return { data, status };
}

export async function getMe() {
  const { data, status } = await api.get<IUser>("/me");
  return { data, status };
}

export async function saveLocation(location: MapLocation & { email: string }) {
  const { data, status } = await api.put<MapLocation & { email: string }>(
    "/banner-location",
    location
  );
  return { data, status };
}

export async function getLocations() {
  const { data, status } = await api.get<(MapLocation & { email: string })[]>(
    "/banner-locations"
  );
  return { data, status };
}
