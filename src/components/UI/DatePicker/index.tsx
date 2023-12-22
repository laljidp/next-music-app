import { useEffect, useRef, useState } from "react";
import useClickOutside from "@/utils/useClickOutside";
import { CalendarOutlined, CloseCircleOutlined } from "@ant-design/icons";
import InfiniteCalendar from "react-infinite-calendar";
import "react-infinite-calendar/styles.css"; //

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
       aria-[readonly=true]:pointer-events-none 
       "
      >
        <div className="text-slate-800 flex justify-between items-center">
          <span
            className={`py-2 w-full ${!localDate && "text-slate-500"}`}
            onClick={() => setShowPicker(true)}
          >
            {localDate ? localDate?.toDateString?.() : placeholder}
          </span>
          <div className="flex gap-2">
            <CloseCircleOutlined
              aria-hidden={isReadOnly}
              onClick={handleClearSelection}
              className="hover:[&>svg]:fill-violet-700 aria-[hidden=true]:hidden"
            />
            <CalendarOutlined className="[&>svg]:fill-violet-600" />
          </div>
        </div>
      </div>
      {showPicker && (
        <div
          className="fixed right-0 top-0 left-0 h-screen w-screen
         p-2 border-2 bg-transparent backdrop-blur-sm z-20 
         animation-scale-up-tl overflow-hidden"
        >
          <div className="flex justify-center items-center h-full w-full relative">
            <div className="" ref={sectionRef}>
              <InfiniteCalendar
                width={400}
                selected={localDate}
                height={500}
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
