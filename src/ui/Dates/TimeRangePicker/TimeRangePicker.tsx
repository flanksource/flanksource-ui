import { autoUpdate, useFloating } from "@floating-ui/react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import clsx from "clsx";
import { useCallback, useMemo } from "react";
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
  showFutureTimeRanges?: boolean;
};

export function TimeRangePicker({
  onChange = () => {},
  value,
  className = "w-fit",
  showFutureTimeRanges = false
}: TimeRangePickerType) {
  const currentRange = useMemo((): TimeRangeOption | undefined => {
    return value;
  }, [value]);

  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
    placement: "bottom-start"
  });

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
      <Popover className={clsx("relative text-sm", className)}>
        <PopoverButton
          ref={refs.setReference}
          type="button"
          className="inline-flex w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          {({ open }) => {
            return (
              <>
                <FiClock className="mt-1" />
                {updateDisplayValue && (
                  <div className="ml-2 flex-1 items-center text-left font-medium">
                    <span>{updateDisplayValue}</span>
                  </div>
                )}
                {!updateDisplayValue && (
                  <div className="ml-2 flex-1 items-center text-left font-medium">
                    Please select time range
                  </div>
                )}
                <div
                  className={clsx("ml-2 mt-1", {
                    "rotate-180": open
                  })}
                >
                  <MdOutlineKeyboardArrowDown />
                </div>
              </>
            );
          }}
        </PopoverButton>
        <PopoverPanel
          portal
          ref={refs.setFloating}
          style={floatingStyles}
          className={`absolute z-50 flex origin-top-right flex-col divide-y divide-gray-100 rounded-md bg-slate-50 ring-1 ring-black ring-opacity-5 drop-shadow-xl focus:outline-none`}
        >
          {({ open, close }) => {
            return (
              <TimeRangePickerBody
                isOpen={open}
                closePicker={() => close()}
                currentRange={currentRange}
                changeRangeValue={changeRangeValue}
                showFutureTimeRanges={showFutureTimeRanges}
              />
            );
          }}
        </PopoverPanel>
      </Popover>
    </>
  );
}
