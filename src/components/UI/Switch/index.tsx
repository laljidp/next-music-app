import React, { useEffect, useState } from "react";

interface TWSwitchProps {
  checked: boolean;
  name?: string;
  label?: string;
  isDisabled?: boolean;
  onChange: (isChecked: boolean) => void;
}

export default function TWSwitch(props: TWSwitchProps) {
  const { checked, name, label, onChange, isDisabled } = props;

  const toggleSwitch = () => {
    onChange(!checked);
  };

  const id = `switch-${name}`;
  return (
    <div className="flex items-center">
      <label
        aria-disabled={isDisabled}
        htmlFor={id}
        onClick={toggleSwitch}
        className={`flex h-[20px] w-[40px] items-center rounded-full px-1
        py-2 ring-2 
        ring-violet-400
       hover:cursor-pointer aria-[disabled=true]:pointer-events-none aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-40 ${
         checked ? "justify-end bg-violet-400" : "justify-start"
       }`}
      >
        <span
          className={`h-3 w-3 rounded-full transition-all ${
            checked
              ? "bg-white ring-2 ring-white"
              : "bg-violet-400 ring-2 ring-violet-400"
          }`}
        />
      </label>
      <span className="font-=sm ml-2 align-middle text-sm">{label}</span>
    </div>
  );
}
