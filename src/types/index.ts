export type Position = { lat: number; lng: number };
export type MapLocation = {
  _id?: string;
  coords: Position;
  image_url?: string;
  address?: string;
};
export interface IUser {
  _id: string;
  email: string;
  role: "admin" | "client";
  verified?: boolean;
}
export interface IGeoCode {
  plus_code: {
    compound_code: string;
    global_code: string;
  };
  results: {
    address_components: {
      long_name: "46";
      short_name: "46";
      types:
        | "street_number"
        | "route"
        | "neighborhood"
        | "political"
        | "locality"
        | "administrative_area_level_3"
        | "administrative_area_level_2"
        | "administrative_area_level_1"
        | "country"
        | "postal_code"[];
    }[];
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
      location_type: string;
      viewport: {
        northeast: {
          lat: number;
          lng: number;
        };
        southwest: {
          lat: number;
          lng: number;
        };
      };
    };
    place_id: string;
    types: ["street_address"];
  }[];
}

export type NavLinkProps = { text: string; href: string };

export type NavProps = {
  links: NavLinkProps[];
  adminLinks: NavLinkProps[];
};

export type GetUsersQuery = {
  page: number;
  perPage: number;
  email?: string;
};
