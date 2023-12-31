import React from "react";
import Spinner from "../Spinner";

export type BtnVariants = "primary" | "secondary" | "outline";

export type ButtonSize = "sm" | "md" | "lg";

interface TWButtonI extends React.HTMLProps<HTMLButtonElement> {
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
  variant?: BtnVariants;
  loading?: boolean;
  className?: string;
  type?: "button" | "submit";
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
  type = "button",
  className = "",
  ...rest
}): React.ReactElement => {
  return (
    <button
      className={`btn ${variants[variant]} ${
        loading ? "justify-evenly" : "justify-center"
      } flex items-center gap-2 ${className}`}
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
