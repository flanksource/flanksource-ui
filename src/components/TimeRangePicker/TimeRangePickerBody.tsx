import clsx from "clsx";
import { memo, useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { TimeRangeList } from "./TimeRangeList";
import { storage, convertRangeValue } from "./helpers";
import { RecentlyRanges } from "./RecentlyRanges";
import {
  displayTimeFormat,
  RangeOption,
  rangeOptionsCategories
} from "./rangeOptions";
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
      applyTimeRange(range);
    },
    [applyTimeRange]
  );

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

  const pickerLeft = pickerRef?.current?.getBoundingClientRect()?.left || 0;

  return (
    <div
      className={clsx(
        "absolute right-0 mt-2 flex cursor-auto w-full max-h-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 shadow-lg shadow-gray-200",
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
      <div className="border-r border-gray-300 w-3.5/6 overflow-hidden">
        <div className="p-3">
          <div className="text-gray-500 text-base sm:space-x-2 whitespace-nowrap font-semibold">
            Absolute time range
          </div>
          <div>
            <div className="mb-5">
              <div className="my-3">
                <div className="text-sm font-medium sm:space-x-2 whitespace-nowrap mb-1">
                  From
                </div>
                <TimePickerInput
                  inputValue={inputValueFrom}
                  setInputValue={setInputValueFrom}
                  setShowCalendar={setShowCalendar}
                  error=""
                />
              </div>
              <div className="my-3">
                <div className="text-sm font-medium sm:space-x-2 whitespace-nowrap mb-1">
                  To
                </div>
                <TimePickerInput
                  inputValue={inputValueTo}
                  setInputValue={setInputValueTo}
                  setShowCalendar={setShowCalendar}
                  error=""
                />
              </div>
            </div>
            <div className="flex">
              <button
                onClick={() =>
                  confirmValidRange({
                    from: inputValueFrom as string,
                    to: inputValueTo as string
                  })
                }
                type="button"
                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
              >
                Apply time range
              </button>
            </div>
          </div>
        </div>
        <RecentlyRanges
          recentRanges={recentRanges}
          applyTimeRange={applyTimeRange}
        />
      </div>
      <div className="w-2.5/6 overflow-y-hidden">
        <TimeRangeList
          className="overflow-y-auto h-full"
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
