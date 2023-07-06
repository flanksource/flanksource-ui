import clsx from "clsx";
import { memo, useCallback, useEffect, useState } from "react";
import { TimeRangeList } from "./TimeRangeList";
import {
  storage,
  convertRangeValue,
  isSupportedRelativeRange
} from "./helpers";
import { RecentlyRanges } from "./RecentlyRanges";
import { RangeOption } from "./rangeOptions";
import { TimePickerCalendar } from "./TimePickerCalendar";
import { TimePickerInput } from "./TimePickerInput";
import { FiAlertTriangle } from "react-icons/fi";
import { formatISODate, isValidDate, formatTimeRange } from "../../utils/date";

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
  const [calendarValue, setCalendarValue] = useState<Date>(new Date());
  const [inputValueFrom, setInputValueFrom] = useState<string>(
    formatDateValue(currentRange.from)
  );
  const [inputValueTo, setInputValueTo] = useState(
    formatDateValue(currentRange.to)
  );
  const [valueType, setValueType] = useState<"from" | "to">();
  const [inputValueError, setInputValueError] = useState<string>();
  const [focusToInput, setFocusToInput] = useState<boolean>();

  function formatDateValue(val: string): string {
    if (isValidDate(val)) {
      return formatTimeRange(val) as string;
    }
    return val;
  }

  const changeRecentRangesList = useCallback(
    (range: RangeOption) => {
      if (
        !recentRanges.find(
          (el: RangeOption) =>
            formatISODate(el.from) === formatISODate(range.from) &&
            formatISODate(el.to) === formatISODate(range.to)
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
    (range: RangeOption) => {
      setInputValueError("");
      if (isValidDate(range.from) && isValidDate(range.to)) {
        changeRecentRangesList({
          from: formatISODate(range.from),
          to: formatISODate(range.to)
        });
        setShowCalendar(false);
        closePicker();
        setFocusToInput(false);
        changeRangeValue({
          from: formatISODate(range.from),
          to: formatISODate(range.to)
        });
      } else if (isSupportedRelativeRange(range.from, range.to)) {
        setShowCalendar(false);
        closePicker();
        setFocusToInput(false);
        changeRangeValue(range);
      } else {
        setInputValueError("Please provide valid values");
      }
    },
    [changeRangeValue, changeRecentRangesList, closePicker]
  );

  const confirmValidRange = useCallback(
    (range: RangeOption) => {
      applyTimeRange(range);
    },
    [applyTimeRange]
  );

  const onShowCalendar = (calendarFor: "from" | "to") => {
    setValueType(calendarFor);
    setShowCalendar((val) => !val);
    if (calendarFor === "from" && isValidDate(inputValueFrom)) {
      setCalendarValue(convertRangeValue(inputValueFrom, "jsDate") as Date);
    } else if (calendarFor === "to" && isValidDate(inputValueTo)) {
      setCalendarValue(convertRangeValue(inputValueTo, "jsDate") as Date);
    }
  };

  useEffect(() => {
    setInputValueFrom(formatDateValue(currentRange.from));
    setInputValueTo(formatDateValue(currentRange.to));
  }, [currentRange]);

  const pickerLeft = pickerRef?.current?.getBoundingClientRect()?.left || 0;

  return (
    <div
      className={clsx(
        "absolute right-0 mt-2 flex cursor-auto w-full max-h-96 rounded-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 shadow-lg shadow-gray-200",
        { "invisible opacity-0": !isOpen, "right-0": pickerLeft > 600 }
      )}
    >
      <div
        className={clsx(
          "absolute shadow-lg shadow-gray-200 z-50",
          {
            calendarRight: pickerLeft < 300
          },
          showCalendar && isOpen ? "" : "invisible opacity-0"
        )}
      >
        <TimePickerCalendar
          calendarValue={calendarValue}
          onChange={onChangeCalendarValue as any}
          setShowCalendar={setShowCalendar}
        />
      </div>
      <div className="border-r border-gray-300 w-3.5/6 overflow-hidden">
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
              {inputValueError && (
                <div className="relative flex items-center mt-1 text-red-500 text-xs font-medium rounded-sm pt-1 pb-1 px-2.5 z-0">
                  <div className="mt-0.5 mr-1">
                    <FiAlertTriangle />
                  </div>
                  <div>{inputValueError}</div>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() =>
                  confirmValidRange({
                    from: inputValueFrom as string,
                    to: inputValueTo as string
                  })
                }
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
