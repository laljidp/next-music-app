import { CaretDownFilled, CaretUpFilled } from "@ant-design/icons";
import { useEffect, useId, useRef, useState } from "react";
import TWInput from "../Input";
import { useStyleRegistry } from "styled-jsx";
import Spinner from "../Spinner";

interface SelectMultipleProps {
  options: { name: string; value: string }[];
  selected: string[];
  onSelect: (selected: string[]) => void;
  name?: string;
  placeholder?: string;
  label?: string;
  isReadOnly?: boolean;
  loading?: boolean;
  showSearch?: boolean;
}

export default function SelectMultiple(props: SelectMultipleProps) {
  const {
    onSelect,
    options,
    selected,
    isReadOnly = false,
    showSearch = false,
    label,
    placeholder,
    loading = false,
  } = props;
  const [showOption, setShowOption] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [isNew, setIsNew] = useState(true);
  const id = useId();
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: any) => {
    if (sectionRef?.current && !sectionRef?.current?.contains(e.target)) {
      setShowOption(false);
    }
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { checked: isChecked, value } = event.currentTarget;
    const newOptions = selectedOption.slice();
    if (isChecked) {
      newOptions.push(value);
    } else {
      const index = selectedOption.findIndex((opt) => opt === value);
      newOptions.splice(index, 1);
    }
    onSelect(newOptions);
  };

  const getTitle = (id: string) => {
    return options.find((o) => o.value === id)?.name;
  };

  useEffect(() => {
    setSelectedOption(selected);
  }, [selected]);

  useEffect(() => {}, [options]);

  useEffect(() => {
    document?.addEventListener("mousedown", handleClickOutside);
    return () => {
      document?.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div key={id}>
      <label
        aria-hidden={!label}
        htmlFor={"label-multiple"}
        className="text-medium text-sm aria-hide:"
      >
        {label}
      </label>
      <div
        ref={sectionRef}
        aria-readonly={isReadOnly}
        aria-disabled={loading}
        onClick={() => setShowOption(true)}
        className={`border-1 relative rounded-lg border-solid px-1 py-1.5
         ring-1 ring-slate-300 hover:ring-violet-400 mt-1
         aria-[readonly=true]:border-none aria-[readonly=true]:pointer-events-none
          ${loading && "pointer-events-none opacity-30]"}
         `}
      >
        <div
          className="flex items-center justify-start gap-2 
          flex-wrap cursor-pointer relative"
        >
          {!!selectedOption.length ? (
            <>
              {selectedOption.map((opt, index) => (
                <div
                  key={(opt + index).toString()}
                  className="px-3 py-1 ring-1 bg-violet-400 text-white rounded-lg"
                >
                  <span className="rounded-xl text-sm font-medium">
                    {getTitle(opt)}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <div className="flex justify-between items-center w-[98%]">
              <span className="text-slate-500 pl-2 text-sm p-1">
                {(!isReadOnly && placeholder) || "N/A"}
              </span>
            </div>
          )}
          <CaretDownFilled
            aria-hidden={isReadOnly || loading}
            aria-rotate={showOption}
            className={`[&>svg]:fill-violet-500 absolute right-3
             aria-hide aria-[rotate=true]:rotate-180`}
          />
          <div aria-hidden={!loading} className="absolute right-3 aria-hide">
            <Spinner color="violet" />
          </div>
        </div>
        <div
          aria-hidden={!showOption}
          className={`absolute left-0 top-11 z-10 w-full rounded-lg
         bg-white p-2 px-5 py-4 shadow-lg ring-1 ring-violet-400 aria-hide
           overflow-auto anim-scale-down anim-scale-down-reverse max-h-[250px]
         `}
        >
          <div className="aria-hide" aria-hidden={!!options.length}>
            <span className="text-slate-400 select-none text-sm">
              No options available
            </span>
          </div>
          <div className="mb-1 aria-hide" aria-hidden={!showSearch}>
            <TWInput placeholder="Search options" />
          </div>
          {options.map(({ name, value }, i) => (
            <div
              key={value}
              className="flex items-center border-b-1 last:border-b-0 p-2
             hover:bg-violet-200 rounded-lg shadow-xl shadow-violet-50"
            >
              <input
                type="checkbox"
                id={id + i}
                name={name}
                checked={selected.includes(value)}
                onChange={handleChange}
                value={value}
                className="mr-4 h-5 w-5 cursor-pointer"
              />
              <label
                className="cursor-pointer w-full select-none"
                htmlFor={id + i}
              >
                {name}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
