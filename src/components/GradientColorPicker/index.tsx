import { useState } from "react";
import TWInput from "../UI/Input";
import useDebounce from "@/utils/useDebouce";

interface GradientColorPickerProps {
  colors?: string[];
  label?: string;
  name?: string;
  className?: string;
  onColorChanges?: (colors: string[]) => void;
}

export default function GradientColorPicker(props: GradientColorPickerProps) {
  const {
    colors = ["rgba(98, 59, 235, 1)", "rgba(138, 53, 250, 1)", "#5e46fc"],
    label,
    className = "",
    onColorChanges = () => {},
  } = props;
  const [from, via, to] = colors;
  const [localColors, setLocalColors] = useState<{
    from: string;
    via: string;
    to: string;
  }>({ from: from, via, to });

  useDebounce(localColors, 1000, () => {
    onColorChanges(Object.values(localColors));
  });

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    const newColors = { ...localColors, [name]: value };
    setLocalColors(newColors);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="flex flex-col ring-slate-300 hover:ring-violet-400 ring-1 p-5 rounded-lg justify-center">
        <div
          className={`ring-1 ring-violet-200 px-4 py-2 rounded-lg h-28 w-[85%] self-center`}
          style={{
            backgroundColor: "rgb(101,44,140)",
            background: `linear-gradient(227deg, ${localColors.from} 18%,
               ${localColors.to} 52%, ${localColors.via} 70%,
                 ${localColors.to} 52%)`,
            opacity: 0.4,
          }}
        />
        <div className="flex justify-center items-center gap-5 mt-4">
          <TWInput
            name={"from"}
            onChange={handleChange}
            type="color"
            style={{
              background: localColors.from,
            }}
            className={`rounded-md`}
          />
          <TWInput
            name={"via"}
            onChange={handleChange}
            type="color"
            style={{
              background: localColors.via,
            }}
            className={`rounded-md`}
          />
          <TWInput
            name={"to"}
            onChange={handleChange}
            type="color"
            style={{
              background: localColors.to,
            }}
            className={`rounded-md`}
          />
        </div>
        <div className="flex justify-center items-center gap-5 mt-4">
          <span className="text-xs">{localColors.from}</span>
          <span className="text-xs">{localColors.via}</span>
          <span className="text-xs">{localColors.to}</span>
        </div>
      </div>
    </div>
  );
}
