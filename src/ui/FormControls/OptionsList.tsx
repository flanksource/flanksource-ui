import clsx from "clsx";
import { useState } from "react";
import { IconType } from "react-icons";
import { Icon } from "../Icons/Icon";

type Option = {
  label: string;
  description?: string;
  value: string;
  icon: string | IconType;
};

type OptionsListProps = {
  name: string;
  value?: Option;
  options: Option[];
  onSelect: (option: Option) => void;
} & React.HTMLProps<HTMLDivElement>;

export function OptionsList({
  name,
  value,
  options,
  onSelect,
  className,
  ...rest
}: OptionsListProps) {
  const [selectedOption, setSelectedOption] = useState<Option | undefined>(
    value
  );

  const optionSelect = (option: Option) => {
    setSelectedOption(option);
    onSelect(option);
  };

  if (!options.length) {
    return null;
  }

  return (
    <div
      className={clsx("-space-y-px rounded-md border bg-white", className)}
      {...rest}
    >
      {options.map((option, index) => {
        return (
          <label
            className={clsx(
              "relative flex cursor-pointer rounded-tl-md rounded-tr-md border-0 border-b p-4 focus:outline-none",
              selectedOption === option ? "z-10 bg-blue-50" : "border-gray-200"
            )}
            key={index}
            onClick={(e) => optionSelect(option)}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              className="mt-0.5 hidden h-4 w-4 shrink-0 cursor-pointer border-gray-300 text-blue-600 focus:ring-blue-500"
              aria-labelledby={`name-${index}-label`}
              aria-describedby={`name-${index}-description`}
            />
            {option.icon &&
              (typeof option.icon === "string" ? (
                <Icon name={option.icon} />
              ) : (
                <option.icon />
              ))}
            <span className="ml-3 flex flex-col">
              <span
                id={`name-${index}-label`}
                className={clsx(
                  "block text-sm font-medium",
                  selectedOption === value ? "text-blue-900" : "text-gray-900"
                )}
              >
                {option.label}
              </span>
              <span
                id={`name-${index}-description`}
                className={clsx(
                  "block text-sm",
                  selectedOption === value ? "text-blue-700" : "text-gray-500"
                )}
              >
                {option.description}
              </span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
