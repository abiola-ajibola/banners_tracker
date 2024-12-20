import { Link } from "react-router-dom";
import { buttonVariants } from "../../components/Button/variants";
import { NavLinkProps } from "../../types";

export function AdminHome({ links }: { links: NavLinkProps[] }) {
  return (
    <div className="controls">
      {links.map(({ href, text }) => (
        <Link to={href} className={buttonVariants({ size: "xl" })}>
          <span>{text}</span>
        </Link>
      ))}
    </div>
  );
}
