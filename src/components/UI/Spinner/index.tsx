import React from "react";

export type SpinnerColorT = "default" | "violet" | "slate" | "emerald";

interface SpinnerI {
  size?: "sm" | "md" | "xl";
  height?: number;
  width?: number;
  color?: SpinnerColorT;
}

const colorClass: Record<SpinnerColorT, string> = {
  default: "fill-white",
  violet: "fill-violet-500",
  slate: "fill-slate-500",
  emerald: "fill-emerald-500",
};

const Spinner: React.FC<SpinnerI> = ({
  size = "sm",
  height = 24,
  width = 24,
  color = "default",
}) => {
  const spinnerColor = colorClass[color];
  return (
    <div className="flex items-center justify-center z-50">
      <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
          opacity=".25"
          className="fill-slate-400"
        />
        <path
          d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
          className={`animate-spin-x-fast origin-center ${spinnerColor}`}
        />
      </svg>
    </div>
  );
};

export default Spinner;
