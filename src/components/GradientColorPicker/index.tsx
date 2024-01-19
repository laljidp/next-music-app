import { useEffect, useState } from "react";
import TWInput from "../UI/Input";

interface GradientColorPickerProps {
  colors?: string[];
  label?: string;
  name?: string;
  className?: string;
  isReadOnly?: boolean;
  onColorChanges?: (colors: string[]) => void;
}

export default function GradientColorPicker(props: GradientColorPickerProps) {
  const {
    colors = [],
    label,
    isReadOnly = false,
    className = "",
    onColorChanges = () => {},
  } = props;
  const [localColors, setLocalColors] = useState<{
    from: string;
    via: string;
    to: string;
  }>({
    from: "#dedede",
    to: "#ffffff",
    via: "#dedede",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    const newColors = { ...localColors, [name]: value };
    setLocalColors(newColors);
    const newColorsArr = Object.values(newColors);
    onColorChanges(newColorsArr);
  };

  useEffect(() => {
    console.log({ colors });
    if (!!colors.length) {
      const [from, via, to] = colors;
      setLocalColors({ from, via, to });
    }
  }, [colors]);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <div
        className="flex flex-col ring-slate-300 hover:ring-violet-400
       ring-1 p-5 rounded-lg justify-center gap-5"
      >
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
        <div className="flex justify-center items-center gap-5">
          <TWInput
            name={"from"}
            readOnly={isReadOnly}
            id="from"
            disabled={isReadOnly}
            onChange={handleChange}
            type="color"
            value={localColors.from}
            style={{
              background: localColors.from || "",
            }}
            className={`rounded-md shadow-md disabled:cursor-not-allowed`}
          />
          <TWInput
            name={"via"}
            id="via"
            disabled={isReadOnly}
            onChange={handleChange}
            type="color"
            style={{
              background: localColors.via || "",
            }}
            className={`rounded-md shadow-md disabled:cursor-not-allowed`}
          />
          <TWInput
            name={"to"}
            id="to"
            disabled={isReadOnly}
            onChange={handleChange}
            type="color"
            style={{
              background: localColors.to || "",
            }}
            className={`rounded-md shadow-md disabled:cursor-not-allowed`}
          />
        </div>
      </div>
    </div>
  );
}
