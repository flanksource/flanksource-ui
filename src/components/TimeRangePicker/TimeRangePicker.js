import PropTypes from "prop-types";
import dayjs from "dayjs";
import { useState } from "react";
import { FiClock } from "react-icons/fi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import clsx from "clsx";
import { TimeRangePickerBody } from "./TimeRangePickerBody";
import "./index.css";
import { defaultValue } from "./rangeOptions";

export const TimeRangePicker = ({ onChange }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [rangeDisplayValue, setRangeDisplayValue] = useState({
    ...defaultValue
  });
  // const [rangeValue, setRangeValue] = useState({});

  const changeRangeValue = (range) => {
    const from = dayjs(range.from).toDate();
    const to = dayjs(range.to).toDate();
    onChange(from, to);
  };

  return (
    <div className="relative text-sm time-picker-main">
      <button
        type="button"
        className="time-range-picker-widget flex items-center justify-center px-2 py-1 bg-gray-50 cursor-pointer rounded-sm border border-gray-300"
        onClick={() => setIsPickerOpen((prevState) => !prevState)}
      >
        <div>
          <FiClock />
        </div>
        <div className="ml-2 font-medium">
          Time range: <span>{rangeDisplayValue.display}</span>
        </div>
        <div
          className={clsx("timepicker-arrow-indicator ml-2", {
            active: isPickerOpen
          })}
        >
          <MdOutlineKeyboardArrowDown />
        </div>
      </button>
      <TimeRangePickerBody
        isOpen={isPickerOpen}
        closePicker={() => setIsPickerOpen(false)}
        rangeDisplayValue={rangeDisplayValue}
        setRangeDisplayValue={setRangeDisplayValue}
        setRangeValue={changeRangeValue}
      />
    </div>
  );
};

TimeRangePicker.propTypes = {
  onChange: PropTypes.func
};

TimeRangePicker.defaultProps = {
  onChange: (from, to) => {
    console.log(from, to);
  }
};
