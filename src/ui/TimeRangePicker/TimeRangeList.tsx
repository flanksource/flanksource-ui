import clsx from "clsx";
import { TimeRangeOption, rangeOptionsCategories } from "./rangeOptions";

type TimeRangeListProps = {
  closePicker: () => void;
  currentRange?: TimeRangeOption;
  changeRangeValue: (val: TimeRangeOption) => void;
  setShowCalendar: (val: boolean) => void;
  showFutureTimeRanges?: boolean;
} & React.HTMLProps<HTMLDivElement>;

export function TimeRangeList({
  closePicker = () => {},
  currentRange,
  changeRangeValue = () => {},
  setShowCalendar = () => {},
  showFutureTimeRanges = false,
  ...rest
}: TimeRangeListProps) {
  const isChecked = (option?: TimeRangeOption, value?: TimeRangeOption) => {
    return option?.display === value?.display;
  };

  const setOption = (option: TimeRangeOption) => {
    changeRangeValue(option);
    closePicker();
    setShowCalendar(false);
  };

  return (
    <div {...rest}>
      {rangeOptionsCategories
        .filter((category) => {
          if (showFutureTimeRanges) {
            return category.type === "future";
          }
          return category.type === "past";
        })
        .map((category, index) => {
          return (
            <div className="px-4 text-left" key={category.name}>
              <div className="my-1 whitespace-nowrap pl-1 text-base font-semibold text-gray-500 sm:space-x-2">
                {category.name}
              </div>
              {category.options.map((option) => {
                return (
                  <button
                    type="button"
                    onClick={() => setOption(option)}
                    key={option.display}
                    className={clsx(
                      "option-item flex w-full items-center justify-between text-left hover:bg-gray-100",
                      { "bg-gray-100": isChecked(option, currentRange) }
                    )}
                  >
                    <label
                      htmlFor={`checkbox-${option.display}`}
                      className="cursor-pointer px-2 py-1.5"
                    >
                      {option.display}
                    </label>
                    <input
                      type="checkbox"
                      className="cursor-pointer opacity-0"
                      checked={isChecked(option, currentRange)}
                      onChange={() => {}}
                      name="range-checkbox"
                      id={`checkbox-${option.display}`}
                    />
                  </button>
                );
              })}
            </div>
          );
        })}
    </div>
  );
}
