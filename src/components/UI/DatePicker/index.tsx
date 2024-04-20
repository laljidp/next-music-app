import { useEffect, useRef, useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import { CalendarOutlined, CloseCircleOutlined } from "@ant-design/icons";
import InfiniteCalendar from "react-infinite-calendar";
import "react-infinite-calendar/styles.css"; //
import { COLORS } from "@/constants";

interface TWDatePickerProps {
  placeholder?: string;
  date?: Date;
  label?: string;
  name?: string;
  isReadOnly?: boolean;
  onSelectDate?: (date: Date | null) => void;
}

const maxDate = new Date(); // today

export default function TWDatePicker(props: TWDatePickerProps) {
  const {
    date,
    placeholder = "Select date",
    onSelectDate = () => {},
    isReadOnly = false,
    label,
  } = props;
  const [localDate, setLocalDate] = useState(date);
  const sectionRef = useRef(null);
  const [showPicker, setShowPicker] = useState(false);

  useClickOutside(sectionRef, () => {
    setShowPicker(false);
  });

  const handleSelectDate = (_date: Date) => {
    setShowPicker(false);
    setLocalDate(_date);
    onSelectDate(_date);
  };

  const handleClearSelection = () => {
    setLocalDate(undefined);
    onSelectDate(null);
  };

  useEffect(() => {
    if (date) {
      setLocalDate(date);
    } else {
      setLocalDate(undefined);
    }
  }, [date]);

  return (
    <div className="date-picker relative">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div
        role="button"
        aria-readonly={isReadOnly}
        className="mt-1 rounded-lg px-4 text-slate-500
       ring-1 ring-slate-300 read-only:ring-0 hover:cursor-pointer       
       hover:ring-violet-400 aria-[readonly=true]:pointer-events-none 
       "
      >
        <div className="flex items-center justify-between text-slate-800">
          <span
            className={`w-full py-2 ${!localDate && "text-slate-500"}`}
            onClick={() => setShowPicker(true)}
          >
            {localDate
              ? localDate?.toDateString()
              : isReadOnly
                ? "N/A"
                : placeholder}
          </span>
          <div className="flex gap-2">
            <CloseCircleOutlined
              aria-hidden={isReadOnly}
              onClick={handleClearSelection}
              className="aria-[hidden=true]:hidden hover:[&>svg]:scale-125 hover:[&>svg]:fill-violet-700"
            />
            <CalendarOutlined className="[&>svg]:fill-violet-600" />
          </div>
        </div>
      </div>
      {showPicker && (
        <div
          className="animation-scale-up-tl absolute left-[-35px] top-[10] z-20 overflow-hidden rounded-2xl
           border-2 bg-transparent p-2 ring-1 ring-violet-400 backdrop-blur-sm"
        >
          <div className="relative flex h-full w-full items-center justify-center">
            <div className="" ref={sectionRef}>
              <InfiniteCalendar
                width={400}
                className=""
                selected={localDate}
                height={450}
                theme={{
                  headerColor: COLORS.primary,
                  weekdayColor: COLORS.primary,
                  selectionColor: COLORS.primary,
                }}
                disabledDays={[0, 6]}
                maxDate={maxDate}
                onSelect={handleSelectDate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// module.exports = {
//   accentColor: "#448AFF",
//   floatingNav: {
//     background: "rgba(56, 87, 138, 0.94)",
//     chevron: "#FFA726",
//     color: "#FFF",
//   },
//   headerColor: "#448AFF",
//   selectionColor: "#559FFF",
//   textColor: {
//     active: "#FFF",
//     default: "#333",
//   },
//   todayColor: "#FFA726",
//   weekdayColor: "#559FFF",
// };
