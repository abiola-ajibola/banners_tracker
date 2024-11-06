import { HTMLAttributes } from "react";
import classnames from "./Button.module.css";

export function Button(
  props: HTMLAttributes<HTMLButtonElement> & {
    type?: "submit" | "reset" | "button";
  }
) {
  const { className, title, type, onClick, children } = props;
  return (
    <button
      className={classnames.button + (" " + className || "")}
      title={title}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
