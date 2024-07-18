import { SearchIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { ChangeEventHandler } from "react";
import { IoCloseCircle } from "react-icons/io5";

type Props = {
  className?: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onSubmit?: (value?: string) => void;
  inputClassName?: string;
  inputOuterClassName?: string;
  buttonIcon?: React.ReactNode;
  hideButton?: boolean;
  onClear?: () => void;
  placeholder?: string;
  hideClearButton?: boolean;
  value?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function TextInputClearable({
  className,
  defaultValue,
  onChange = (val) => {},
  onSubmit = () => {},
  inputClassName,
  inputOuterClassName,
  buttonIcon,
  hideButton,
  onClear,
  placeholder,
  hideClearButton = false,
  value,
  ...rest
}: Props) {
  return (
    <div className={`flex ${className}`}>
      <div className={`relative flex-1 ${inputOuterClassName}`}>
        <input
          defaultValue={defaultValue}
          onChange={onChange}
          type="text"
          className={clsx(
            `block h-full w-full border-gray-300 py-1 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              hideButton ? "rounded-md" : "rounded-l-md"
            } ${inputClassName}`,
            !hideClearButton && value && "pr-6"
          )}
          placeholder={placeholder}
          {...rest}
          value={value}
        />
        {!hideClearButton && value && (
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              className="p-1"
              type="button"
              onClick={() => {
                if (onClear) {
                  onClear();
                }
              }}
            >
              <IoCloseCircle
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </button>
          </div>
        )}
      </div>
      {!hideButton && (
        <button
          onClick={() => onSubmit(value)}
          type="submit"
          className="rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 hover:bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {buttonIcon || (
            <SearchIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}
