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
        className="ring-1 hover:cursor-pointer ring-slate-300 px-4
       text-slate-500 rounded-lg hover:ring-violet-400 mt-1       
       aria-[readonly=true]:pointer-events-none read-only:ring-0 
       "
      >
        <div className="text-slate-800 flex justify-between items-center">
          <span
            className={`py-2 w-full ${!localDate && "text-slate-500"}`}
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
              className="hover:[&>svg]:fill-violet-700 hover:[&>svg]:scale-125 aria-[hidden=true]:hidden"
            />
            <CalendarOutlined className="[&>svg]:fill-violet-600" />
          </div>
        </div>
      </div>
      {showPicker && (
        <div
          className="absolute border-2 left-[-35px] top-[10] bg-transparent backdrop-blur-sm z-20
           animation-scale-up-tl overflow-hidden ring-1 ring-violet-400 rounded-2xl p-2"
        >
          <div className="flex justify-center items-center h-full w-full relative">
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
