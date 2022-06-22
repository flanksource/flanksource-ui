import clsx from "clsx";
import { memo, useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { TimeRangeList } from "./TimeRangeList";
import { storage, createValueForInput, convertRangeValue } from "./helpers";
import { RecentlyRanges } from "./RecentlyRanges";
import { displayTimeFormat, RangeOption } from "./rangeOptions";
import { TimePickerCalendar } from "./TimePickerCalendar";
import { TimePickerInput } from "./TimePickerInput";

type TimeRangePickerBodyProps = {
  isOpen: any;
  closePicker: any;
  currentRange: any;
  changeRangeValue: any;
  pickerRef: any;
};

const TimeRangePickerBodyFC = ({
  isOpen,
  closePicker = () => {},
  currentRange,
  changeRangeValue = () => {},
  pickerRef
}: TimeRangePickerBodyProps) => {
  const [recentRanges, setRecentRanges] = useState(
    storage.getItem("timePickerRanges") || []
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarValue, setCalendarValue] = useState<[Date, Date]>([
    new Date(),
    new Date()
  ]);
  const [inputValueFrom, setInputValueFrom] = useState(currentRange.from);
  const [inputValueTo, setInputValueTo] = useState(currentRange.to);
  const [errorInputFrom, setErrorInputFrom] = useState<string>("");
  const [errorInputTo, setErrorInputTo] = useState<string>("");

  const changeRecentRangesList = useCallback(
    (range: RangeOption) => {
      if (
        !recentRanges.find(
          (el: RangeOption) =>
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

  const onChangeCalendarRange = useCallback((value: [Date, Date]) => {
    const from = dayjs(value[0]).format(displayTimeFormat);
    const to = dayjs(value[1]).format(displayTimeFormat);

    setCalendarValue(value);
    setInputValueFrom(from);
    setInputValueTo(to);
  }, []);

  const applyTimeRange = useCallback(
    (range: RangeOption) => {
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
    (range: RangeOption) => {
      if (!errorInputFrom && !errorInputTo) {
        applyTimeRange(range);
      }
    },
    [applyTimeRange, errorInputFrom, errorInputTo]
  );

  const validateInputRange = useCallback((range: RangeOption) => {
    const from = convertRangeValue(range.from, "jsDate");
    const to = convertRangeValue(range.to, "jsDate");
    if (!dayjs(from).isValid()) {
      setErrorInputFrom("Invaid date!");
    } else {
      setErrorInputFrom("");
    }
    if (!dayjs(to).isValid()) {
      setErrorInputTo("Invaid date!");
    } else {
      setErrorInputTo("");
    }
    if (dayjs(from).isValid() && dayjs(to).isValid()) {
      if (from > to) {
        setErrorInputFrom('"From" can\'t be after "To"');
      } else {
        setErrorInputFrom("");
      }
    }
  }, []);

  useEffect(() => {
    if (
      dayjs(currentRange.from).isValid() &&
      dayjs(currentRange.to).isValid()
    ) {
      setCalendarValue([
        convertRangeValue(currentRange.from, "jsDate") as Date,
        convertRangeValue(currentRange.to, "jsDate") as Date
      ]);
    } else {
      setCalendarValue([
        convertRangeValue(new Date().toISOString(), "jsDate") as Date,
        convertRangeValue(new Date().toISOString(), "jsDate") as Date
      ]);
    }
    setInputValueFrom(currentRange.from);
    setInputValueTo(currentRange.to);
  }, [currentRange]);

  useEffect(() => {
    validateInputRange({
      from: inputValueFrom as string,
      to: inputValueTo as string
    });
  }, [inputValueFrom, inputValueTo]);

  const pickerLeft = pickerRef?.current?.getBoundingClientRect()?.left || 0;

  return (
    <div
      className={clsx(
        "absolute right-0 mt-2 flex justify-center cursor-auto w-full max-h-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 shadow-lg shadow-gray-200",
        { "invisible opacity-0": !isOpen, "right-0": pickerLeft > 600 }
      )}
    >
      <div
        className={clsx(
          "absolute shadow-lg shadow-gray-200",
          {
            calendarRight: pickerLeft < 300
          },
          showCalendar && isOpen ? "" : "invisible opacity-0"
        )}
      >
        <TimePickerCalendar
          calendarValue={calendarValue}
          onChangeCalendarRange={onChangeCalendarRange as any}
          setShowCalendar={setShowCalendar}
        />
      </div>
      <div className="border-r border-gray-300 w-4/6 overflow-hidden">
        <div className="p-3">
          <div className="font-medium">Absolute time range</div>
          <div>
            <div className="mb-5">
              <div className="my-3">
                <div className="text-sm mb-1">From</div>
                <TimePickerInput
                  inputValue={inputValueFrom}
                  setInputValue={setInputValueFrom}
                  setShowCalendar={setShowCalendar}
                  error={errorInputFrom}
                />
              </div>
              <div className="my-3">
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
                confirmValidRange({
                  from: inputValueFrom as string,
                  to: inputValueTo as string
                })
              }
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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

export const TimeRangePickerBody = memo(TimeRangePickerBodyFC);
