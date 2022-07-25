import { useEffect, useState } from "react";
import { Combobox } from "@headlessui/react";
import clsx from "clsx";

import { ComboboxInput } from "./ComboboxInput";
import { CheckIcon } from "@heroicons/react/outline";
import { IItem } from "../../types/IItem";

interface IDropdownWithActionsProps<T> {
  label: string;
  name: string;
  onQuery: (s: string) => Promise<T[]>;

  displayOption: (props: {
    selected: boolean;
    option: T;
    active: boolean;
  }) => React.ReactNode;
  displayValue: (v: T) => string;
  value?: T;
  setValue: any;
}

export function DropdownWithActions<T extends IItem>({
  label,
  name,
  onQuery,
  value = { value: null, description: "" } as T,
  displayValue,
  displayOption,
  setValue
}: IDropdownWithActionsProps<T>) {
  const [options, setOptions] = useState<T[]>([]);
  const [query, setQuery] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const getOptions = async (query: string) => {
      setIsFetching(true);
      const res = await onQuery(query);
      setIsFetching(false);
      setOptions(res || []);
    };
    getOptions(query);
  }, [query, onQuery]);

  return (
    <Combobox
      className="relative mt-1"
      as="div"
      key={value?.value}
      by="value"
      name={name}
      value={value}
      onChange={(val: T) => setValue(name, val)}
      onBlur={() => {
        if (query && options.length === 0) {
          setValue(name, { value: null, description: query });
        }
      }}
    >
      <ComboboxInput
        isFetching={isFetching}
        onChange={(e) => {
          setValue(name, { value: null, description: e });
          setQuery(e);
        }}
        displayValue={displayValue}
      />

      <Combobox.Options
        className={clsx(
          "absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:out line-none   sm:text-sm z-20",
          options.length === 0 && "invisible"
        )}
      >
        {!!query && (
          <Combobox.Option
            className={({ active }) =>
              clsx(
                "relative cursor-default select-none py-2 px-4 text-gray-900 border-b border-dotted ",
                active && "bg-blue-200"
              )
            }
            value={{ value: null, description: query }}
          >
            <b>{query}</b>
            <div className="text-gray-400 text-xs">Create new {label}</div>
          </Combobox.Option>
        )}

        {options.map((value) => (
          <Combobox.Option
            key={value?.value}
            className={({ active, selected }) =>
              clsx(
                "relative cursor-default select-none py-2 px-4 text-gray-900 border-b border-gray-200 flex",
                active && "bg-blue-200",
                selected && "bg-blue-100 font-bold"
              )
            }
            value={value}
          >
            {({ selected, active }) =>
              displayOption({ selected, active, option: value })
            }
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  );
}
