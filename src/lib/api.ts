import axios from "axios";
import {
  AllLocationsQuery,
  GetUsersQuery,
  IGeoCode,
  IUser,
  MapLocation,
  Position,
} from "../types";

const api = axios.create({
  baseURL: "/",
});

export async function auth(payload: { email: string; reset?: boolean }) {
  const { data, status } = await api.post<{ email?: string }>("/auth", payload);
  return { data, status };
}

export async function getMe() {
  const { data, status } = await api.get<IUser>("/me");
  return { data, status };
}

export async function getUsers(
  query: GetUsersQuery = {
    page: 1,
    perPage: 10,
  }
) {
  const { data, status } = await api.get<{
    data: IUser[];
    currentPage: number;
    perPage: number;
    total: number;
  }>("/users", {
    params: query,
  });
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

export async function getAllLocations(query: AllLocationsQuery) {
  const { data, status } = await api.get<{
    data: (MapLocation & { email: string })[];
    currentPage: number;
    perPage: number;
    total: number;
  }>("/all-locations", { params: query });
  return { data, status };
}

export async function verifyOTP({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) {
  const { data, status } = await api.post<IUser | undefined>(
    "/auth/login/verify",
    {
      email,
      otp,
    }
  );
  return { data, status };
}

export async function reverseGeo(point: Position) {
  const { data, status } = await api.get<IGeoCode>(
    `/geolocation?lat=${point.lat}&lng=${point.lng}`
  );
  return { data, status };
}
