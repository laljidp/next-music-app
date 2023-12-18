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
        className={`ring-2 ring-violet-400 px-1 py-2 w-[40px] h-[20px]
        aria-[disabled=true]:opacity-40 aria-[disabled=true]:cursor-not-allowed 
        aria-[disabled=true]:pointer-events-none
       flex items-center rounded-full hover:cursor-pointer ${
         checked ? "justify-end bg-violet-400" : "justify-start"
       }`}
      >
        <span
          className={`h-3 w-3 rounded-full ${
            checked ? "ring-2 ring-white bg-white" : "ring-2 ring-violet-500"
          }`}
        />
      </label>
      <span className="ml-2 text-sm align-middle font-=sm">{label}</span>
    </div>
  );
}
