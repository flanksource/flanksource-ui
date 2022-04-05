import PropTypes from "prop-types";
import Calendar from "react-calendar";
import clsx from "clsx";
import { useState } from "react";
import { GrClose } from "react-icons/gr";
import { FaRegCalendarAlt, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import dayjs from "dayjs";
import { TimeRangeList } from "./TimeRangeList";
import "./index.css";
import { defaultValue } from "./rangeOptions";
import { createIntervalName, getIntervalData } from "./helpers";

export const TimeRangePickerBody = ({
  isOpen,
  closePicker,
  rangeDisplayValue,
  setRangeDisplayValue,
  setRangeValue
}) => {
  const displayTimeFormat = "YYYY-MM-DD HH:mm";
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarValue, setCalendarValue] = useState(null);
  const [inputValue, setInputValue] = useState({
    from: defaultValue.from,
    to: defaultValue.to
  });

  const onChangeRange = (value) => {
    const from = dayjs(value[0]).format(displayTimeFormat);
    const to = dayjs(value[1]).format(displayTimeFormat);

    setCalendarValue(value);
    setInputValue((prevState) => ({ ...prevState, from, to }));
  };

  const applyTimeRange = () => {
    if (inputValue.from.includes("now") || inputValue.to.includes("now")) {
      let from;
      let to;
      let display;

      if (inputValue.from === "now") {
        from = dayjs().format();
      } else {
        from = dayjs()
          .subtract(...getIntervalData(inputValue.from))
          .format();
      }

      if (inputValue.to === "now") {
        to = dayjs().format();
        display = createIntervalName(...getIntervalData(inputValue.from));
      } else {
        to = dayjs()
          .subtract(...getIntervalData(inputValue.to))
          .format();
        display = `${dayjs(from).format(displayTimeFormat)} - ${dayjs()
          .subtract(...getIntervalData(inputValue.to))
          .format(displayTimeFormat)}`;
      }

      setRangeDisplayValue({
        from: inputValue.from,
        to: inputValue.to,
        display
      });
      setRangeValue({
        from,
        to
      });
    } else {
      const from = dayjs(inputValue.from).format(displayTimeFormat);
      const to = dayjs(inputValue.to).format(displayTimeFormat);
      setRangeDisplayValue({
        from,
        to,
        display: `${from} to ${to}`
      });
      setRangeValue({
        from: dayjs(inputValue.from).format(),
        to: dayjs(inputValue.to).format()
      });
    }

    setShowCalendar(false);
    closePicker();
  };

  return (
    <div
      className={clsx(
        "time-range-picker-body flex justify-center cursor-auto w-max bg-gray-50 absolute rounded-sm border border-gray-300 z-50 shadow-lg shadow-gray-200",
        { active: isOpen }
      )}
    >
      <div
        className={clsx(
          "calendar-wrapper absolute p-2 bg-gray-50 rounded-sm border border-gray-300 shadow-lg shadow-gray-200",
          { active: showCalendar }
        )}
      >
        <div className="flex justify-between align-center mb-2">
          <div className="font-medium">Select a time range</div>
          <div>
            <button
              type="button"
              onClick={() => setShowCalendar(false)}
              className="bg-gray-200 hover:bg-gray-300 rounded-sm px-1.5 py-1.5 transition duration-200 ease"
            >
              <GrClose size="12px" />
            </button>
          </div>
        </div>
        <div>
          <Calendar
            locale="en"
            selectRange
            next2Label={null}
            prev2Label={null}
            nextLabel={<FaAngleRight size="18px" color="#272727" />}
            prevLabel={<FaAngleLeft size="18px" color="#272727" />}
            className="react-calendar-custom"
            tileClassName="react-calendar-custom__tile"
            value={calendarValue}
            onChange={onChangeRange}
          />
        </div>
      </div>
      <div className="p-3 border-r border-gray-300 w-4/6">
        <div className="font-medium">Absolute time range</div>
        <div>
          <div className="mb-6">
            <div className="my-3">
              <div className="text-sm mb-1">From</div>
              <div className="flex">
                <div>
                  <input
                    value={inputValue.from}
                    onChange={(e) =>
                      setInputValue((prevState) => ({
                        ...prevState,
                        from: e.target.value
                      }))
                    }
                    className="px-1 py-0.5 border border-gray-300 rounded-sm focus:border-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div className="flex bg-gray-200 hover:bg-gray-300 ml-0.5 rounded-sm">
                  <button
                    type="button"
                    onClick={() => setShowCalendar((prevState) => !prevState)}
                    className="px-1 mx-1"
                  >
                    <FaRegCalendarAlt color="#303030" />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm mb-1">To</div>
              <div className="flex">
                <div>
                  <input
                    value={inputValue.to}
                    onChange={(e) =>
                      setInputValue((prevState) => ({
                        ...prevState,
                        to: e.target.value
                      }))
                    }
                    className="px-1 py-0.5 border border-gray-300 rounded-sm focus:border-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div className="flex bg-gray-200 hover:bg-gray-300 ml-0.5 rounded-sm">
                  <button
                    type="button"
                    onClick={() => setShowCalendar((prevState) => !prevState)}
                    className="px-1 mx-1"
                  >
                    <FaRegCalendarAlt color="#303030" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={applyTimeRange}
            type="button"
            className="block font-medium bg-blue-200 hover:bg-blue-300 rounded-sm px-2.5 py-1.5 transition duration-200 ease"
          >
            Apply time range
          </button>
        </div>
        {/* <div className="font-medium mt-2 mb-1">
          Recently used absolute ranges
        </div> */}
      </div>
      <div className="w-2/6 overflow-y-auto">
        <TimeRangeList
          closePicker={closePicker}
          rangeDisplayValue={rangeDisplayValue}
          setRangeDisplayValue={setRangeDisplayValue}
          setRangeValue={setRangeValue}
          setInputValue={setInputValue}
          setCalendarValue={setCalendarValue}
          setShowCalendar={setShowCalendar}
        />
      </div>
    </div>
  );
};

TimeRangePickerBody.propTypes = {
  isOpen: PropTypes.bool,
  closePicker: PropTypes.func,
  rangeDisplayValue: PropTypes.shape({}),
  setRangeDisplayValue: PropTypes.func,
  setRangeValue: PropTypes.func
};

TimeRangePickerBody.defaultProps = {
  isOpen: false,
  closePicker: () => {},
  rangeDisplayValue: {},
  setRangeDisplayValue: () => {},
  setRangeValue: () => {}
};
