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
  const optionRef = useRef<HTMLDivElement>(null);
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
        className="text-medium aria-hide text-sm"
      >
        {label}
      </label>
      <div
        ref={sectionRef}
        aria-readonly={isReadOnly}
        aria-disabled={loading}
        onClick={() => setShowOption(true)}
        className={`border-1 relative mt-1 rounded-lg border-solid px-1
         py-1.5 ring-1 ring-slate-300 hover:ring-violet-400
         aria-[readonly=true]:pointer-events-none aria-[readonly=true]:border-none
          ${loading && "opacity-30] pointer-events-none"}
         `}
      >
        <div
          className="relative flex cursor-pointer flex-wrap 
          items-center justify-start gap-2"
        >
          {!!selectedOption?.length ? (
            <>
              {selectedOption.map((opt, index) => (
                <div
                  key={(opt + index).toString()}
                  className="rounded-lg bg-violet-400 px-3 py-1 text-white ring-1"
                >
                  <span className="rounded-xl text-sm font-medium">
                    {getTitle(opt)}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <div className="flex w-[98%] items-center justify-between">
              <span className="p-1 pl-2 text-sm text-slate-500">
                {(!isReadOnly && placeholder) || "N/A"}
              </span>
            </div>
          )}
          <CaretDownFilled
            aria-hidden={isReadOnly || loading}
            aria-checked={showOption}
            className={`aria-hide absolute right-3
             aria-[checked=true]:rotate-180 [&>svg]:fill-violet-500`}
          />
          <div aria-hidden={!loading} className="aria-hide absolute right-3">
            <Spinner color="violet" />
          </div>
        </div>
        <div
          aria-hidden={!showOption}
          className={`aria-hide anim-scale-down anim-scale-down-reverse absolute left-0 top-11
         z-10 max-h-[250px] w-full overflow-auto rounded-lg bg-white p-2 px-5
           py-4 shadow-lg ring-1 ring-violet-400
         `}
        >
          <div className="aria-hide" aria-hidden={!!options.length}>
            <span className="select-none text-sm text-slate-400">
              No options available
            </span>
          </div>
          <div className="aria-hide mb-1" aria-hidden={!showSearch}>
            <TWInput placeholder="Search options" />
          </div>
          {options.map(({ name, value }, i) => (
            <div
              ref={optionRef}
              key={value}
              className="border-b-1 flex items-center rounded-lg p-2
             shadow-xl shadow-violet-50 last:border-b-0 hover:bg-violet-200"
            >
              <input
                type="checkbox"
                id={id + i}
                name={name}
                checked={!!selected?.includes(value)}
                onChange={handleChange}
                value={value}
                className="mr-4 h-5 w-5 cursor-pointer"
              />
              <label
                className="w-full cursor-pointer select-none"
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
