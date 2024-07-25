import { SearchIcon } from "@heroicons/react/solid";
import { useField } from "formik";
import { debounce } from "lodash";
import { IoCloseCircle } from "react-icons/io5";

type Props = {
  className?: string;
  name: string;
  hideClearButton?: boolean;
  defaultValue?: string;
  placeholder?: string;
};

export function CanarySearchField({
  name,
  className,
  hideClearButton = false,
  defaultValue,
  placeholder
}: Props) {
  const [field] = useField({
    name
  });

  const value = field.value;

  const onChange = debounce((value) => {
    field.onChange({
      target: {
        value,
        name
      }
    });
  }, 400);

  return (
    <div
      className={`relative flex w-full flex-row ${className}`}
      style={{ maxWidth: "480px", width: "100%" }}
    >
      <input
        type="text"
        className={`block w-full rounded-l-md border-gray-300 shadow-sm placeholder:text-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base`}
        placeholder={placeholder}
        value={value ?? defaultValue}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      {!hideClearButton && value && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <button
            className="p-1"
            type="button"
            onClick={() => {
              field.onChange({
                target: {
                  value: undefined,
                  name
                }
              });
            }}
          >
            <IoCloseCircle
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </button>
        </div>
      )}
      <button
        type="submit"
        className="rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 hover:bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <SearchIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
      </button>
    </div>
  );
}
