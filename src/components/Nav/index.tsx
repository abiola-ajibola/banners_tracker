import { Link, Outlet, useLocation } from "react-router-dom";
import { buttonVariants } from "../Button/variants";
import { NavLinkProps, NavProps } from "../../types";
import { useUserDataContext } from "../../contexts/userData";

function NavLink({ text, href }: NavLinkProps) {
  const location = useLocation();
  return (
    <Link
      className={buttonVariants({
        variant: location.pathname === href ? "secondary" : "default",
      })}
      to={href}
    >
      {text}
    </Link>
  );
}

export function Nav({ links, adminLinks }: NavProps) {
  const location = useLocation();
  const { data: userData } = useUserDataContext();
  const isAdmin = userData.role === "admin";
  return (
    <>
      <nav className="mb-4">
        <div className="flex justify-between mb-4">
          {links.map(({ href, text }) => (
            <NavLink href={href} text={text} />
          ))}
        </div>
        {isAdmin && (
          <div className="flex justify-around">
            {adminLinks.map(({ href, text }) => (
              <NavLink href={href} text={text} />
            ))}
          </div>
        )}
      </nav>
      <Outlet />
      <footer className="flex justify-around mt-auto">
        {location.pathname !== "auth/email" && (
          <Link to="auth/email" className={buttonVariants() + " mt-12"}>
            Change email
          </Link>
        )}
        {isAdmin && (
          <Link to="admin" className={buttonVariants() + " mt-12"}>
            Admin
          </Link>
        )}
      </footer>
    </>
  );
}
