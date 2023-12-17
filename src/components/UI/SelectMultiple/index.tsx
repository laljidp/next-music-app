import { CaretDownFilled, CaretUpFilled } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";

interface SelectMultipleProps {
  options: { name: string; value: string }[];
  selected: string[];
  onSelect: (selected: string[]) => void;
  name?: string;
  placeholder?: string;
}

export default function SelectMultiple(props: SelectMultipleProps) {
  const [showOption, setShowOption] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string[]>([]);

  const sectionRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: any) => {
    console.log("Calling..");
    if (sectionRef?.current && !sectionRef?.current?.contains(e.target)) {
      setShowOption(false);
    }
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const isChecked = event.currentTarget.checked;
    const name = event.currentTarget.name;
    const newOptions = selectedOption.slice();
    if (isChecked) {
      newOptions.push(name);
    } else {
      const index = selectedOption.findIndex((opt) => opt === name);
      newOptions.splice(index, 1);
    }
    setSelectedOption(newOptions);
  };

  useEffect(() => {
    document?.addEventListener("mousedown", handleClickOutside);

    return () => {
      document?.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      onClick={() => setShowOption(true)}
      className="border-1 relative rounded-lg border-solid px-1 py-1 ring-1 ring-slate-300 hover:ring-violet-400"
    >
      <div className="flex items-center justify-start gap-2 flex-wrap cursor-pointer">
        {selectedOption.length > 0 ? (
          <>
            {selectedOption.map((opt, index) => (
              <div
                key={opt + index}
                className="px-3 py-1 ring-1 bg-violet-400 text-white rounded-lg"
              >
                <span className="rounded-xl text-sm font-medium">{opt}</span>
              </div>
            ))}
          </>
        ) : (
          <div className="flex justify-between items-center w-[98%]">
            <span className="text-slate-500 pl-2 text-sm p-1">
              {props.placeholder || "Select"}
            </span>
            <CaretDownFilled className="fill-violet-400" />
          </div>
        )}

        <i></i>
      </div>

      <div
        className={`absolute left-0 top-11 z-10 w-full rounded-lg
         bg-white p-2 px-5 py-4 shadow-lg ring-1 ring-violet-400
         ${
           !showOption && "hidden"
         } anim-scale-down anim-scale-down-reverse max-h-[220px] overflow-auto
         `}
      >
        {props.options.map(({ name, value }) => (
          <div
            key={value}
            className="flex items-center border-b-1 last:border-b-0 p-2"
          >
            <input
              type="checkbox"
              id={name}
              name={name}
              onChange={handleChange}
              className="mr-4 h-5 w-5 cursor-pointer"
            />
            <label className="cursor-pointer" htmlFor={name}>
              {name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
