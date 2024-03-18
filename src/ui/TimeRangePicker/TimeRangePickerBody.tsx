import clsx from "clsx";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { formatTimeRange, isValidDate } from "../../utils/date";
import { RecentlyRanges } from "./RecentlyRanges";
import { TimePickerCalendar } from "./TimePickerCalendar";
import { TimePickerInput } from "./TimePickerInput";
import { TimeRangeList } from "./TimeRangeList";
import { convertRangeValue } from "./helpers";
import { TimeRangeAbsoluteOption, TimeRangeOption } from "./rangeOptions";

const recentlyUsedTimeRangesAtom = atomWithStorage<TimeRangeAbsoluteOption[]>(
  "recentlyUsedTimeRanges",
  []
);

type TimeRangePickerBodyProps = {
  isOpen: any;
  closePicker: any;
  currentRange?: TimeRangeOption;
  changeRangeValue: (range: TimeRangeOption) => void;
};

export function TimeRangePickerBody({
  isOpen,
  closePicker = () => {},
  currentRange,
  changeRangeValue = () => {}
}: TimeRangePickerBodyProps) {
  const [params, setParams] = useSearchParams();
  const [recentRanges, setRecentRanges] = useAtom(recentlyUsedTimeRangesAtom);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarValue, setCalendarValue] = useState<Date>(new Date());
  const [inputValueFrom, setInputValueFrom] = useState<string | undefined>(
    () => {
      if (currentRange?.type === "absolute") {
        return formatDateValue(currentRange.from);
      }
    }
  );
  const [inputValueTo, setInputValueTo] = useState<string | undefined>(() => {
    if (currentRange?.type === "absolute") {
      return formatDateValue(currentRange.to);
    }
  });
  const [valueType, setValueType] = useState<"from" | "to">();
  const [focusToInput, setFocusToInput] = useState<boolean>();

  function formatDateValue(val: string): string {
    if (isValidDate(val)) {
      return formatTimeRange(val) as string;
    }
    return val;
  }

  const clearFilter = useCallback(() => {
    params.delete("from");
    params.delete("to");
    params.delete("duration");
    params.delete("timeRange");
    params.delete("rangeType");
    params.delete("display");
    setParams(params);
    setShowCalendar(false);
    closePicker();
  }, [closePicker, params, setParams]);

  const changeRecentRangesList = useCallback(
    (range: TimeRangeOption) => {
      if (range.type !== "absolute") {
        return;
      }
      // move the range to the top of the list, if it exists, otherwise add it to the top
      setRecentRanges((prev) => [
        range,
        // remove the range if it exists in the list
        ...prev
          .filter(
            (r) =>
              `${formatTimeRange(r.from)} to ${formatTimeRange(r.to)}` !==
              `${formatTimeRange(range.from)} to ${formatTimeRange(range.to)}`
          )
          .slice(0, 4)
      ]);
    },
    [setRecentRanges]
  );

  const onChangeCalendarValue = (value: Date) => {
    if (valueType === "from") {
      const from = formatTimeRange(value);
      setInputValueFrom(from as string);
      setInputValueTo(isValidDate(inputValueTo) ? inputValueTo : "");
      setFocusToInput(true);
    } else if (valueType === "to") {
      const to = formatTimeRange(value);
      setInputValueTo(to as string);
      setInputValueFrom(isValidDate(inputValueFrom) ? inputValueFrom : "");
      setFocusToInput(false);
    }
    setCalendarValue(value);
    setShowCalendar(false);
  };

  const applyTimeRange = useCallback(
    (range: TimeRangeOption) => {
      // if the range is not absolute, add it to the recent ranges list
      if (range.type === "absolute") {
        changeRecentRangesList(range);
      }
      setShowCalendar(false);
      closePicker();
      setFocusToInput(false);
      changeRangeValue(range);
    },
    [changeRangeValue, changeRecentRangesList, closePicker]
  );

  const confirmValidRange = useCallback(
    (range: TimeRangeOption) => {
      applyTimeRange(range);
    },
    [applyTimeRange]
  );

  const onShowCalendar = (calendarFor: "from" | "to") => {
    setValueType(calendarFor);
    setShowCalendar((val) => !val);
    if (calendarFor === "from" && isValidDate(inputValueFrom)) {
      setCalendarValue(convertRangeValue(inputValueFrom!, "jsDate") as Date);
    } else if (calendarFor === "to" && isValidDate(inputValueTo)) {
      setCalendarValue(convertRangeValue(inputValueTo!, "jsDate") as Date);
    }
  };

  useEffect(() => {
    // only update the input values if the range is absolute
    if (currentRange?.type === "absolute") {
      setInputValueFrom(formatDateValue(currentRange.from));
      setInputValueTo(formatDateValue(currentRange.to));
    }
  }, [currentRange]);

  return (
    <div
      className={clsx(
        "flex cursor-auto w-full max-h-96 rounded-md py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 shadow-lg shadow-gray-200"
      )}
    >
      <div
        className={clsx(
          "absolute shadow-lg shadow-gray-200 z-50",

          showCalendar && isOpen ? "" : "invisible opacity-0"
        )}
      >
        <TimePickerCalendar
          calendarValue={calendarValue}
          onChange={onChangeCalendarValue as any}
          setShowCalendar={setShowCalendar}
        />
      </div>
      <div className="border-r border-gray-300 w-3.5/6 px-1 overflow-hidden">
        <div className="p-3">
          <div className="text-gray-500 text-base sm:space-x-2 whitespace-nowrap font-semibold">
            Absolute time range
          </div>
          <div>
            <div className="mb-2">
              <div className="my-3">
                <div className="text-sm font-medium sm:space-x-2 whitespace-nowrap mb-1">
                  From
                </div>
                <TimePickerInput
                  inputValue={inputValueFrom}
                  setInputValue={setInputValueFrom}
                  showCalendar={() => {
                    onShowCalendar("from");
                  }}
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
                  showCalendar={() => {
                    onShowCalendar("to");
                  }}
                  error=""
                  focus={focusToInput}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                title="Clear Time Range"
                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                onClick={clearFilter}
              >
                Clear
              </button>
              <button
                disabled={!inputValueFrom || !inputValueTo}
                onClick={() => {
                  if (inputValueFrom && inputValueTo) {
                    confirmValidRange({
                      type: "absolute",
                      display: "Custom",
                      from: inputValueFrom as string,
                      to: inputValueTo as string
                    });
                  }
                }}
                type="button"
                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        <RecentlyRanges
          recentRanges={recentRanges}
          applyTimeRange={applyTimeRange}
        />
      </div>
      <div className="w-auto overflow-y-hidden">
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
}
