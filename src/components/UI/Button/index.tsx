import React from "react";
import Spinner from "../Spinner";

export type BtnVariants = "primary" | "secondary" | "outline";

export type ButtonSize = "sm" | "md" | "lg";

interface TWButtonI {
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
  variant?: BtnVariants;
  loading?: boolean;
  className?: string;
  // size?: ButtonSize;
}

const variants: Record<BtnVariants, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
};

export const TWButton: React.FC<TWButtonI> = ({
  children,
  onClick = () => {},
  variant = "primary",
  loading = false,
  className = "",
}): React.ReactElement => {
  return (
    <button
      className={`btn ${variants[variant]} flex items-center gap-2 ${className}`}
      disabled={loading}
      onClick={onClick}
    >
      {loading && <Spinner height={15} width={15} />}
      {children}
    </button>
  );
};
