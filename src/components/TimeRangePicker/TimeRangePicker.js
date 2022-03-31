import { useState } from "react";
import { TimeRangePickerBody } from "./TimeRangePickerBody";
import "./index.css";
import { MiniClockIcon } from "../../icons/mini-clock";

export const TimeRangePicker = () => {
  let [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className="time-range-picker-widget flex items-center justify-center px-2 py-1 bg-gray-50 cursor-pointer rounded-sm border border-gray-300"
        onClick={() => setIsPickerOpen(!isPickerOpen)}>
        <div>
          <MiniClockIcon />
        </div>
        <div className="ml-2">
          Time range: <span>2 hours</span>
        </div>
      </div>
      <TimeRangePickerBody isOpen={isPickerOpen} closePicker={() => setIsPickerOpen(false)}/>
    </div>
  );
};
