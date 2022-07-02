import { Combobox } from "@headlessui/react";
import { SelectorIcon } from "@heroicons/react/outline";
import { ThreeDots } from "react-loading-icons";

interface IInputProps<T> {
  isFetching: boolean;
  displayValue: (v: T) => string;
  onChange: (v: string) => void;
}

export function ComboboxInput<T>({
  isFetching,
  onChange,
  displayValue
}: IInputProps<T>) {
  return (
    <div className="bg-white cursor-default relative w-full">
      <Combobox.Input
        className="border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 leading-5 pl-3 pr-10 py-2 rounded-md shadow-sm text-gray-900 text-sm w-full"
        displayValue={(value: T) => displayValue(value)}
        onChange={(event) => onChange(event.target.value)}
      />
      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
        {isFetching ? (
          <ThreeDots fill="gray" stroke="black" width="24px" />
        ) : (
          <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        )}
      </Combobox.Button>
    </div>
  );
}
