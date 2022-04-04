/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from "react";
import { FiClock } from "react-icons/fi";
import { TimeRangePickerBody } from "./TimeRangePickerBody";
import "./index.css";
import { defaultValue } from "./rangeOptions";

export const TimeRangePicker = () => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [rangeDisplayValue, setRangeDisplayValue] = useState({
    ...defaultValue
  });
  const [rangeValue, setRangeValue] = useState({});

  return (
    <div className="relative text-sm">
      <div
        className="time-range-picker-widget flex items-center justify-center px-2 py-1 bg-gray-50 cursor-pointer rounded-sm border border-gray-300"
        onClick={() => setIsPickerOpen((prevState) => !prevState)}
      >
        <div>
          <FiClock />
        </div>
        <div className="ml-2 font-medium">
          Time range: <span>{rangeDisplayValue.display}</span>
        </div>
      </div>
      <TimeRangePickerBody
        isOpen={isPickerOpen}
        closePicker={() => setIsPickerOpen(false)}
        rangeDisplayValue={rangeDisplayValue}
        setRangeDisplayValue={setRangeDisplayValue}
        rangeValue={rangeValue}
        setRangeValue={setRangeValue}
      />
    </div>
  );
};
