import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import clsx from "clsx";
import { TimeRangePickerBody } from "./TimeRangePickerBody";
import "./index.css";
import { defaultRange } from "./rangeOptions";
import { convertRangeValue, createDisplayValue, storage } from "./helpers";

export const TimeRangePicker = ({ onChange }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [currentRange, setCurrentRange] = useState(
    storage.getItem("currentRange") || defaultRange
  );
  const [rangeDisplayValue, setRangeDisplayValue] = useState("");

  const changeRangeValue = (range) => {
    const { from, to } = range;
    setCurrentRange({ from, to });
    onChange(
      convertRangeValue(from, "jsDate"),
      convertRangeValue(to, "jsDate")
    );
  };

  useEffect(() => {
    const { from, to } = currentRange;
    onChange(
      convertRangeValue(from, "jsDate"),
      convertRangeValue(to, "jsDate")
    );
  }, []);

  useEffect(() => {
    setRangeDisplayValue(createDisplayValue(currentRange));
  }, [currentRange]);

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
          Time range: <span>{rangeDisplayValue}</span>
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
        currentRange={currentRange}
        changeRangeValue={changeRangeValue}
      />
    </div>
  );
};

TimeRangePicker.propTypes = {
  onChange: PropTypes.func
};

TimeRangePicker.defaultProps = {
  onChange: (from, to) => {
    console.log("FROM: ", from, "\n", "TO: ", to);
  }
};
