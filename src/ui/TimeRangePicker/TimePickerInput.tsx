import clsx from "clsx";
import { useEffect, useRef } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";

type ShowCalendar = () => void;

type TimePickerInputProps = {
  inputValue?: string;
  setInputValue: (val: any) => void;
  showCalendar: ShowCalendar;
  error?: string | undefined;
  focus?: boolean;
};

export function TimePickerInput({
  inputValue = "",
  setInputValue = () => {},
  showCalendar = () => {},
  error = "",
  focus
}: TimePickerInputProps) {
  const inputRef = useRef<HTMLInputElement>() as any;

  useEffect(() => {
    if (inputRef?.current && focus) {
      inputRef.current.focus();
    }
  }, [focus, inputRef]);

  return (
    <div>
      <div className="flex border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 sm:text-sm">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={clsx(
            "flex-grow rounded-sm px-1 py-0.5 focus:border-none",
            {
              "border-red-300": error
            }
          )}
          ref={inputRef}
        />
        <button
          type="button"
          onClick={showCalendar}
          className="bg-gray-50 px-3 py-2 hover:bg-gray-100"
        >
          <FaRegCalendarAlt color="#303030" />
        </button>
      </div>
      {error && (
        <div className="relative z-0 mt-1 flex items-center rounded-sm px-2.5 pb-1 pt-1 text-xs font-medium text-red-500">
          <div className="mr-1 mt-0.5">
            <FiAlertTriangle />
          </div>
          <div>{error}</div>
        </div>
      )}
    </div>
  );
}
