import { forwardRef, InputHTMLAttributes, useRef } from "react";

import { Button } from "../Button";
import SearchIcon from "../../assets/search.svg?react";

import { cn } from "../../lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

export function SearchInput({
  onSearch,
  inputProps,
}: {
  onSearch: (value: string) => void;
  inputProps?: InputProps;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
      <Input className="h-16" ref={inputRef} {...inputProps} />
      <Button className="!w-[unset]" onClick={() => onSearch(inputRef.current?.value || "")} type="button">
        <SearchIcon />
      </Button>
    </div>
  );
}
