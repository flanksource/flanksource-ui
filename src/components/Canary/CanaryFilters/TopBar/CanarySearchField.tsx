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
      className={`relative w-full flex flex-row ${className}`}
      style={{ maxWidth: "480px", width: "100%" }}
    >
      <input
        type="text"
        className={`shadow-sm focus:ring-blue-500 w-full focus:border-blue-500 block sm:text-base placeholder:text-sm border-gray-300 rounded-l-md`}
        placeholder={placeholder}
        value={value ?? defaultValue}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      {!hideClearButton && value && (
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
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
        className="py-2 px-3 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      >
        <SearchIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
      </button>
    </div>
  );
}
