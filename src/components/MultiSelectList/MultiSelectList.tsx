import clsx from "clsx";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsCircle } from "react-icons/bs";

type MultiSelectListProps<T> = {
  options: T[];
  renderOption: (option: T, index: number) => React.ReactNode;
  onOptionSelect: (option: T) => void;
  selectedOptions: T[];
  viewOnly?: boolean;
} & React.HTMLProps<HTMLInputElement>;

export default function MultiSelectList<T extends unknown>({
  className,
  options,
  renderOption,
  selectedOptions,
  onOptionSelect,
  viewOnly,
  ...rest
}: MultiSelectListProps<T>) {
  const isSelected = (option: T) => {
    if (viewOnly) {
      return;
    }
    return selectedOptions.includes(option);
  };

  return (
    <div className={clsx("space-y-2 rounded-md bg-white", className)} {...rest}>
      {options.map((option, index) => {
        return (
          <div
            key={index}
            className={clsx(
              "relative cursor-pointer rounded-md border p-4 focus:outline-none",
              isSelected(option)
                ? "z-10 border-blue-200 bg-blue-50"
                : "border-gray-200"
            )}
            onClick={(e) => onOptionSelect(option)}
          >
            {!viewOnly && (
              <>
                {isSelected(option) && (
                  <AiFillCheckCircle
                    className={clsx(
                      "absolute bottom-0 top-0 m-auto h-5 w-5",
                      isSelected(option) ? "text-blue-500" : "text-gray-500"
                    )}
                  />
                )}
                {!isSelected(option) && (
                  <BsCircle
                    className={clsx(
                      "absolute bottom-0 top-0 m-auto h-5 w-5 text-gray-500"
                    )}
                  />
                )}
              </>
            )}
            <div className={clsx("flex", viewOnly ? "" : "ml-8")}>
              {renderOption(option, index)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
