import PropTypes from "prop-types";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { TimeRangeList } from "./TimeRangeList";
import "./index.css";
import { storage, createValueForInput, convertRangeValue } from "./helpers";
import { RecentlyRanges } from "./RecentlyRanges";
import { displayTimeFormat } from "./rangeOptions";
import { TimePickerCalendar } from "./TimePickerCalendar";
import { TimePickerInput } from "./TimePickerInput";

export const TimeRangePickerBody = ({
  isOpen,
  closePicker,
  currentRange,
  changeRangeValue,
  pickerRef
}) => {
  const [recentRanges, setRecentRanges] = useState(
    storage.getItem("timePickerRanges") || []
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarValue, setCalendarValue] = useState(null);
  const [inputValueFrom, setInputValueFrom] = useState(
    createValueForInput(currentRange.from)
  );
  const [inputValueTo, setInputValueTo] = useState(
    createValueForInput(currentRange.to)
  );
  const [errorInputFrom, setErrorInputFrom] = useState(null);
  const [errorInputTo, setErrorInputTo] = useState(null);

  const changeRecentRangesList = useCallback(
    (range) => {
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
    },
    [recentRanges]
  );

  const onChangeCalendarRange = useCallback((value) => {
    const from = dayjs(value[0]).format(displayTimeFormat);
    const to = dayjs(value[1]).format(displayTimeFormat);

    setCalendarValue(value);
    setInputValueFrom(from);
    setInputValueTo(to);
  }, []);

  const applyTimeRange = useCallback(
    (range) => {
      changeRangeValue(range);
      if (dayjs(range.from).isValid() && dayjs(range.to).isValid()) {
        changeRecentRangesList({
          from: dayjs(range.from).toISOString(),
          to: dayjs(range.to).toISOString()
        });
      }
      setShowCalendar(false);
      closePicker();
    },
    [changeRangeValue, changeRecentRangesList, closePicker]
  );

  const confirmValidRange = useCallback(
    (range) => {
      if (!errorInputFrom && !errorInputTo) {
        applyTimeRange(range);
      }
    },
    [applyTimeRange, errorInputFrom, errorInputTo]
  );

  const validateInputRange = useCallback((range) => {
    const from = convertRangeValue(range.from, "jsDate");
    const to = convertRangeValue(range.to, "jsDate");
    if (!dayjs(from).isValid()) {
      setErrorInputFrom("Invaid date!");
    } else {
      setErrorInputFrom(null);
    }
    if (!dayjs(to).isValid()) {
      setErrorInputTo("Invaid date!");
    } else {
      setErrorInputTo(null);
    }
    if (dayjs(from).isValid() && dayjs(to).isValid()) {
      if (from > to) {
        setErrorInputFrom('"From" can\'t be after "To"');
      } else {
        setErrorInputFrom(null);
      }
    }
  }, []);

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
    setInputValueFrom(createValueForInput(currentRange.from));
    setInputValueTo(createValueForInput(currentRange.to));
  }, [currentRange]);

  useEffect(() => {
    validateInputRange({ from: inputValueFrom, to: inputValueTo });
  }, [inputValueFrom, inputValueTo]);

  const pickerLeft = pickerRef?.current?.getBoundingClientRect()?.left || 0;

  return (
    <div
      className={clsx(
        "time-range-picker-body flex justify-center cursor-auto w-max bg-gray-50 absolute rounded-sm border border-gray-300 z-50 shadow-lg shadow-gray-200",
        { "invisible opacity-0": !isOpen, "right-0": pickerLeft > 600 }
      )}
    >
      <div
        className={clsx(
          "calendar-wrapper absolute shadow-lg shadow-gray-200",
          {
            calendarRight: pickerLeft < 300
          },
          showCalendar && isOpen ? "" : "invisible opacity-0"
        )}
      >
        <TimePickerCalendar
          calendarValue={calendarValue}
          onChangeCalendarRange={onChangeCalendarRange}
          setShowCalendar={setShowCalendar}
        />
      </div>
      <div className="border-r border-gray-300 w-4/6 overflow-hidden">
        <div className="p-3">
          <div className="font-medium">Absolute time range</div>
          <div>
            <div className="range-inputs-container mb-5">
              <div className="range-input my-3">
                <div className="text-sm mb-1">From</div>
                <TimePickerInput
                  inputValue={inputValueFrom}
                  setInputValue={setInputValueFrom}
                  setShowCalendar={setShowCalendar}
                  error={errorInputFrom}
                />
              </div>
              <div className="range-input my-3">
                <div className="text-sm mb-1">To</div>
                <TimePickerInput
                  inputValue={inputValueTo}
                  setInputValue={setInputValueTo}
                  setShowCalendar={setShowCalendar}
                  error={errorInputTo}
                />
              </div>
            </div>
            <button
              onClick={() =>
                confirmValidRange({ from: inputValueFrom, to: inputValueTo })
              }
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
