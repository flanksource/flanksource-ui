import { FaRegCalendarAlt } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import clsx from "clsx";
import { memo, useEffect, useRef } from "react";

type ShowCalendar = () => void;

type TimePickerInputProps = {
  inputValue: string;
  setInputValue: (val: any) => void;
  showCalendar: ShowCalendar;
  error?: string | undefined;
  focus?: boolean;
};

export const TimePickerInputFC = ({
  inputValue = "",
  setInputValue = () => {},
  showCalendar = () => {},
  error = "",
  focus
}: TimePickerInputProps) => {
  const inputRef = useRef<HTMLInputElement>() as any;

  useEffect(() => {
    if (inputRef?.current && focus) {
      inputRef.current.focus();
    }
  }, [focus, inputRef]);

  return (
    <div>
      <div className="flex sm:text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={clsx(
            "px-1 py-0.5 rounded-sm flex-grow focus:border-none",
            {
              "border-red-300": error
            }
          )}
          ref={inputRef}
        />
        <button
          type="button"
          onClick={showCalendar}
          className="py-2 px-3 bg-gray-50 hover:bg-gray-100"
        >
          <FaRegCalendarAlt color="#303030" />
        </button>
      </div>
      {error && (
        <div className="relative flex items-center mt-1 text-red-500 text-xs font-medium rounded-sm pt-1 pb-1 px-2.5 z-0">
          <div className="mt-0.5 mr-1">
            <FiAlertTriangle />
          </div>
          <div>{error}</div>
        </div>
      )}
    </div>
  );
};

export const TimePickerInput = memo(TimePickerInputFC);
