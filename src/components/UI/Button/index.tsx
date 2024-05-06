import React from "react";
import Spinner from "../Spinner";
import { cn } from "@/utils/helper.util";

export type BtnVariants = "primary" | "secondary" | "outline" | "error-outline";

export type ButtonSize = "sm" | "md" | "lg";

interface TWButtonI extends React.HTMLProps<HTMLButtonElement> {
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
  variant?: BtnVariants;
  loading?: boolean;
  className?: string;
  type?: "button" | "submit";
  small?: boolean;
}

const variants: Record<BtnVariants, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
  "error-outline": "btn-error-outline",
};

export const TWButton: React.FC<TWButtonI> = ({
  children,
  onClick = () => {},
  variant = "primary",
  loading = false,
  type = "button",
  className = "",
  small,
  ...rest
}): React.ReactElement => {
  const smallClasses = small ? "px-3 py-1" : "";

  return (
    <button
      className={cn(
        "btn",
        variants[variant],
        "justify-center",
        "flex items-center gap-2",
        className,
        smallClasses,
      )}
      disabled={loading}
      type={type}
      onClick={onClick}
      {...rest}
    >
      {loading && <Spinner height={15} width={15} />}
      {children}
    </button>
  );
};
