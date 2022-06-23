import { FaRegCalendarAlt } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import clsx from "clsx";
import { memo } from "react";

type ShowCalendarCallback = (val: boolean) => boolean;

type TimePickerInputProps = {
  inputValue: string;
  setInputValue: (val: any) => void;
  setShowCalendar: (val: ShowCalendarCallback | boolean) => void;
  error: string;
};

export const TimePickerInputFC = ({
  inputValue = "",
  setInputValue = () => {},
  setShowCalendar = () => {},
  error = ""
}: TimePickerInputProps) => (
  <div>
    <div className="flex sm:text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onClick={() => setShowCalendar(false)}
        className={clsx("px-1 py-0.5 rounded-sm flex-grow focus:border-none", {
          "border-red-300": error
        })}
        readOnly
      />
      <button
        type="button"
        onClick={() => setShowCalendar((prevState: boolean) => !prevState)}
        className="py-2 px-3 bg-gray-50 hover:bg-gray-100"
      >
        <FaRegCalendarAlt color="#303030" />
      </button>
    </div>
    {error && (
      <div className="relative flex items-center mt-1.5 bg-pink-200 text-xs font-medium rounded-sm pt-1 pb-1.5 px-2.5">
        <div className="mt-0.5 mr-1">
          <FiAlertTriangle />
        </div>
        <div>{error}</div>
      </div>
    )}
  </div>
);

export const TimePickerInput = memo(TimePickerInputFC);
