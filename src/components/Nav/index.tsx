import { Link, Outlet, useLocation } from "react-router-dom";
import { buttonVariants } from "../Button/variants";

export function Nav() {
  const location = useLocation();
  return (
    <>
      <nav className="flex justify-between mb-4">
        <Link
          className={buttonVariants({
            variant: location.pathname === "/" ? "secondary" : "default",
          })}
          to={"/"}
        >
          Home
        </Link>
        <Link
          className={buttonVariants({
            variant:
              location.pathname === "/locations" ? "secondary" : "default",
          })}
          to="/locations"
        >
          Saved Locations
        </Link>
        <Link
          className={buttonVariants({
            variant:
              location.pathname === "/location" ? "secondary" : "default",
          })}
          to="/location"
        >
          Add Location
        </Link>
      </nav>
      <Outlet />
      <footer>
        {location.pathname !== "/email" && (
          <Link to="/email" className={buttonVariants() + " mt-12"}>
            Change email
          </Link>
        )}
      </footer>
    </>
  );
}
