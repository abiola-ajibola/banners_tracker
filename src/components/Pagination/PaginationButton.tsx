import React, { ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "../Button/variants";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const PaginationButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        // className={cn(buttonVariants({ variant, size, className }))}
        className={className}
        ref={ref}
        {...props}
      />
    );
  }
);
PaginationButton.displayName = "PaginationButton";

export { PaginationButton };
