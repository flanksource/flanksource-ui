import PropTypes from "prop-types";
import Calendar from "react-calendar";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { GrClose } from "react-icons/gr";
import { FaRegCalendarAlt, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import dayjs from "dayjs";
import { TimeRangeList } from "./TimeRangeList";
import "./index.css";
import { storage, createValueForInput, convertRangeValue } from "./helpers";
import { RecentlyRanges } from "./RecentlyRanges";
import { displayTimeFormat } from "./rangeOptions";

export const TimeRangePickerBody = ({
  isOpen,
  closePicker,
  currentRange,
  changeRangeValue
}) => {
  const [recentRanges, setRecentRanges] = useState(
    storage.getItem("timePickerRanges") || []
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarValue, setCalendarValue] = useState(null);
  const [inputValue, setInputValue] = useState({
    from: createValueForInput(currentRange.from),
    to: createValueForInput(currentRange.to)
  });

  const changeRecentRangesList = (range) => {
    if (
      !recentRanges.find(
        (el) =>
          dayjs(el.from).toISOString() === dayjs(range.from).toISOString() &&
          dayjs(el.to).toISOString() === dayjs(range.to).toISOString()
      )
    ) {
      let newRanges;
      if (recentRanges.length < 4) {
        newRanges = [range, ...recentRanges];
      } else {
        newRanges = [range, ...recentRanges.slice(0, 3)];
      }
      setRecentRanges([...newRanges]);
      storage.setItem("timePickerRanges", newRanges);
    }
  };

  const onChangeCalendarRange = (value) => {
    const from = dayjs(value[0]).format(displayTimeFormat);
    const to = dayjs(value[1]).format(displayTimeFormat);

    setCalendarValue(value);
    setInputValue((prevState) => ({ ...prevState, from, to }));
  };

  const applyTimeRange = (range) => {
    changeRangeValue(range);
    if (dayjs(range.from).isValid() && dayjs(range.to).isValid()) {
      changeRecentRangesList({
        from: dayjs(range.from).toISOString(),
        to: dayjs(range.to).toISOString()
      });
    }
    storage.setItem("currentRange", range);
    setShowCalendar(false);
    closePicker();
  };

  useEffect(() => {
    if (
      dayjs(currentRange.from).isValid() &&
      dayjs(currentRange.to).isValid()
    ) {
      setCalendarValue([
        convertRangeValue(currentRange.from, "jsDate"),
        convertRangeValue(currentRange.to, "jsDate")
      ]);
    } else {
      setCalendarValue(null);
    }
    setInputValue({
      from: createValueForInput(currentRange.from),
      to: createValueForInput(currentRange.to)
    });
  }, [currentRange]);

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
            onChange={onChangeCalendarRange}
          />
        </div>
      </div>
      <div className="border-r border-gray-300 w-4/6">
        <div className="p-3">
          <div className="font-medium">Absolute time range</div>
          <div>
            <div className="mb-5">
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
              onClick={() => applyTimeRange(inputValue)}
              type="button"
              className="block font-medium bg-blue-200 hover:bg-blue-300 rounded-sm px-2.5 py-1.5 transition duration-200 ease"
            >
              Apply time range
            </button>
          </div>
        </div>
        <RecentlyRanges
          recentRanges={recentRanges}
          applyTimeRange={applyTimeRange}
        />
      </div>
      <div className="w-2/6 overflow-y-auto">
        <TimeRangeList
          closePicker={closePicker}
          currentRange={currentRange}
          changeRangeValue={changeRangeValue}
          setShowCalendar={setShowCalendar}
        />
      </div>
    </div>
  );
};

TimeRangePickerBody.propTypes = {
  isOpen: PropTypes.bool,
  closePicker: PropTypes.func,
  currentRange: PropTypes.shape({}),
  changeRangeValue: PropTypes.func
};

TimeRangePickerBody.defaultProps = {
  isOpen: false,
  closePicker: () => {},
  currentRange: {},
  changeRangeValue: () => {}
};
