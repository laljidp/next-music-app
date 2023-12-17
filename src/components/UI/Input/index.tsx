import React from "react";

export interface TWInputType extends React.HTMLProps<HTMLInputElement> {
  onChange?: (event: React.FormEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ReactElement;
}

export default function TWInput({
  onChange = () => {},
  name,
  label,
  className,
  icon,
  ...respProps
}: TWInputType) {
  const elemID = `tw-input-${name}`;
  const iconClass = !!icon ? "pl-8" : "";
  return (
    <div className={`flex flex-col gap-2 relative`}>
      {label && (
        <label className="text-sm font-medium" htmlFor={elemID}>
          {label}
        </label>
      )}
      <input
        id={elemID}
        {...respProps}
        className={`tw-input ${className} ${iconClass}`}
      />
      {icon && <i className="absolute left-2 top-1">{icon}</i>}
    </div>
  );
}
