import { SearchIcon } from "@heroicons/react/solid";
import { Controller, useForm } from "react-hook-form";
import { IoCloseCircle } from "react-icons/io5";

export function CanarySearchBar({
  className,
  onSubmit,
  inputClassName,
  inputOuterClassName,
  onClear,
  placeholder,
  hideClearButton = false,
  defaultValue,
  ...rest
}) {
  const { handleSubmit, control, setValue, watch } = useForm();
  const textValue = watch("CanarySearchTextbox");

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data.CanarySearchTextbox))}
      className={`flex justify-center ${className}`}
      {...rest}
    >
      <div className={`relative ${inputOuterClassName}`}>
        <Controller
          name="CanarySearchTextbox"
          control={control}
          defaultValue={defaultValue}
          rules={{ required: true }}
          render={({ field }) => (
            <input
              type="text"
              className={`h-full shadow-sm focus:ring-blue-500 focus:border-blue-500 block py-1 sm:text-sm border-gray-300 rounded-l-md ${inputClassName}`}
              placeholder={placeholder}
              {...field}
            />
          )}
        />
        {!hideClearButton && textValue && (
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
            <button
              className="p-1"
              type="button"
              onClick={() => {
                setValue("CanarySearchTextbox", "");
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

      <button
        type="submit"
        className="py-2 px-3 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      >
        <SearchIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
      </button>
    </form>
  );
}
