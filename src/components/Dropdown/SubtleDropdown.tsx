import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/solid";
import { Controller } from "react-hook-form";
import clsx from "clsx";
import { IItem } from "../../types/IItem";

interface Props {
  className: string;
  value: string;
  label: string;
  control: any;
  onChange: (value: string) => void;
  name: string;
  items: { [k: string]: IItem };
}

export function SubtleDropdown({
  className,
  label,
  control,
  items = {},
  name,
  onChange = () => {},
  value
}: Props) {
  items = Object.fromEntries(
    (Object.values(items) || []).map((item) => [
      item.value,
      {
        ...item,
        label: item.description,
        name: item.description,
        id: item.value,
        key: item.value
      }
    ])
  );

  return (
    <div className={clsx(className)}>
      {control ? (
        <Controller
          control={control}
          name={name}
          render={({ field }) => {
            const { onChange: onChangeControlled, value: valueControlled } =
              field;
            if (items[valueControlled] == null) {
              return <div />;
            }
            return (
              <DropdownListbox
                onChange={onChangeControlled}
                value={valueControlled}
                label={label}
                items={items}
              />
            );
          }}
        />
      ) : (
        <DropdownListbox
          label={label}
          items={items}
          onChange={onChange}
          value={value}
        />
      )}
    </div>
  );
}

interface IDropdownListbox {
  onChange: (val: string) => void;
  value: string;
  label: string;
  items: { [k: string]: IItem };
}

export const DropdownListbox = ({
  onChange,
  value,
  label,
  items
}: IDropdownListbox) => (
  <Listbox value={value} onChange={onChange}>
    {({ open }) => (
      <>
        {label && (
          <Listbox.Label
            as="span"
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </Listbox.Label>
        )}
        <div className={`${label && "mt-1"} group relative h-full`}>
          <Listbox.Button className="relative cursor-pointer w-full group-hover:bg-white border border-transparent group-hover:border-gray-300 rounded-full group-hover:shadow-sm p-1 text-left focus:outline-none text-sm">
            {items[value].iconTitle}
          </Listbox.Button>

          {/* @ts-ignore */}
          <Transition
            show={open}
            as={Fragment as any}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {Object.values(items).map((item) => (
                <Listbox.Option
                  key={`option-${item.value}`}
                  className={({ active }) =>
                    clsx(
                      active ? "text-white bg-blue-600" : "text-gray-900",
                      "cursor-pointer select-none relative py-2 pl-3 pr-9 text-sm"
                    )
                  }
                  value={item.value}
                >
                  {({ selected, active }) => (
                    <>
                      <div className="flex items-center">
                        <div>{item.icon}</div>
                        <span
                          className={clsx(
                            selected ? "font-semibold" : "font-normal",
                            "ml-2 block truncate"
                          )}
                        >
                          {item.description}
                        </span>
                      </div>

                      {selected ? (
                        <span
                          className={clsx(
                            active ? "text-white" : "text-blue-600",
                            "absolute inset-y-0 right-0 flex items-center pr-4"
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </>
    )}
  </Listbox>
);
