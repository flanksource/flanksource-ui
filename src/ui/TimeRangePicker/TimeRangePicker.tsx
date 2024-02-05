import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiClock } from "react-icons/fi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { TimeRangePickerBody } from "./TimeRangePickerBody";
import { TimeRangeOption } from "./rangeOptions";

type TimeRangePickerType = Omit<
  React.HTMLProps<HTMLDivElement>,
  "onChange" | "value"
> & {
  value?: TimeRangeOption;
  onChange: (val: TimeRangeOption) => void;
};

export function TimeRangePicker({
  onChange = () => {},
  value,
  className = "w-fit",
  ...rest
}: TimeRangePickerType) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<any>();

  const currentRange = useMemo((): TimeRangeOption | undefined => {
    return value;
  }, [value]);

  const updateDisplayValue = useMemo(() => {
    if (currentRange?.type === "absolute") {
      return `${currentRange.from} - ${currentRange.to}`;
    }
    return currentRange?.display;
  }, [currentRange]);

  const changeRangeValue = useCallback(
    (range: TimeRangeOption) => {
      onChange(range);
    },
    [onChange]
  );

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!pickerRef?.current?.contains(event.target)) {
        setIsPickerOpen(false);
      }
    };
    document.addEventListener("click", listener);
    return () => {
      document.removeEventListener("click", listener);
    };
  }, []);

  return (
    <>
      <style global jsx>{`
        /*calendar*/
        .react-calendar-custom__tile {
          color: #000;
          background-color: #f9fafb;
          font-size: 14px;
          border: 1px solid transparent;
        }

        .react-calendar-custom__tile:hover {
          position: relative;
        }

        .react-calendar-custom {
          z-index: 40;
          background-color: #f9fafb;
          font-size: 14px;
        }

        .react-calendar__navigation {
          display: flex;
        }

        .react-calendar__navigation__label,
        .react-calendar__navigation__arrow,
        .react-calendar__navigation {
          padding-top: 4px;
          background-color: inherit;
          color: #000;
          border: 0;
          font-weight: 500;
        }

        .react-calendar__month-view__weekdays {
          background-color: inherit;
          text-align: center;
          color: #230e99;
        }

        .react-calendar__month-view__weekdays abbr {
          border: 0;
          text-decoration: none;
          cursor: default;
          display: block;
          padding: 4px 0 4px 0;
        }

        .react-calendar__month-view__days {
          background-color: inherit;
        }

        .react-calendar__tile,
        .react-calendar__tile--now {
          margin-bottom: 4px;
          background-color: inherit;
          height: 26px;
        }

        .react-calendar__navigation__label,
        .react-calendar__navigation > button:focus,
        .time-picker-calendar-tile:focus {
          outline: 0;
        }

        .react-calendar__tile--active,
        .react-calendar__tile--active:hover {
          color: #fff;
          font-weight: 400;
          background: rgb(61, 113, 217);
          box-shadow: none;
          border: 0px;
        }

        .react-calendar__tile--rangeEnd,
        .react-calendar__tile--rangeStart {
          padding: 0;
          border: 0px;
          color: #fff;
          font-weight: 400;
          background: rgb(61, 113, 217);
        }

        .react-calendar__tile--rangeEnd abbr,
        .react-calendar__tile--rangeStart abbr {
          background-color: rgb(61, 113, 217);
          border-radius: 100px;
          display: block;
          padding-top: 2px;
          height: 26px;
        }

        .react-calendar__tile--rangeStart {
          border-top-left-radius: 20px;
          border-bottom-left-radius: 20px;
        }

        .react-calendar__tile--rangeEnd {
          border-top-right-radius: 20px;
          border-bottom-right-radius: 20px;
        }
      `}</style>
      <div
        className={clsx("relative text-sm", className)}
        ref={pickerRef}
        {...rest}
      >
        <button
          type="button"
          className="inline-flex rounded-md border border-gray-300 shadow-sm px-2 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={() => setIsPickerOpen((prevState) => !prevState)}
        >
          <FiClock className="mt-1" />
          {updateDisplayValue && (
            <div className="ml-2 font-medium items-center">
              <span>{updateDisplayValue}</span>
            </div>
          )}
          {!updateDisplayValue && (
            <div className="ml-2 font-medium items-center">
              Please select time range
            </div>
          )}
          <div
            className={clsx("ml-2 mt-1", {
              "rotate-180": isPickerOpen
            })}
          >
            <MdOutlineKeyboardArrowDown />
          </div>
        </button>
        <TimeRangePickerBody
          pickerRef={pickerRef}
          isOpen={isPickerOpen}
          closePicker={() => setIsPickerOpen(false)}
          currentRange={currentRange}
          changeRangeValue={changeRangeValue}
        />
      </div>
    </>
  );
}
