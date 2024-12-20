import { NavLinkProps } from "../types";

export const links: NavLinkProps[] = [
  { href: "/", text: "Home" },
  { href: "/locations", text: "Saved Locations" },
  { href: "/location", text: "Add Location" },
];

export const adminLinks: NavLinkProps[] = [
  { href: "/admin/all-users", text: "All Users" },
  { href: "/admin/all-locations", text: "All Locations" },
];
