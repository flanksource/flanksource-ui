/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/solid";
import { Controller } from "react-hook-form";
import clsx from "clsx";

export function SubtleDropdown({
  className,
  label,
  control,
  items = {},
  name,
  onChange = () => {},
  value = null,
  placeholder,
  emptyable,
  prefix = "",
  suffix = "",
  labelPrefix = "",
  labelSuffix = "",
  ...rest
}) {
  items = Object.fromEntries(
    (Object.values(items) || []).map((item) => [
      item.value,
      {
        ...item,
        label: item.label || item.description,
        name: item.name || item.id,
        id: item.id || item.name || item.value,
        key: item.id || item.name || item.value
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
              return null;
            }
            return (
              <DropdownListbox
                onChange={onChangeControlled}
                value={valueControlled}
                label={label}
                items={items}
                rest={rest}
              />
            );
          }}
        />
      ) : (
        <DropdownListbox
          label={label}
          items={items}
          rest={rest}
          onChange={onChange}
          value={value}
          prefix={prefix}
          suffix={suffix}
          labelPrefix={labelPrefix}
          labelSuffix={labelSuffix}
        />
      )}
    </div>
  );
}

export const DropdownListbox = ({
  onChange,
  value,
  label,
  items,
  prefix = "",
  suffix = "",
  labelPrefix = "",
  labelSuffix = "",
  ...rest
}) => (
  <Listbox
    value={value}
    onChange={(e) => {
      onChange(e);
    }}
    {...rest}
  >
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
          <Listbox.Button
            className={`relative cursor-pointer w-full group-hover:bg-white border border-transparent group-hover:border-gray-300 rounded-md group-hover:shadow-sm px-2 py-2 text-left focus:outline-none sm:text-sm
              ${items[value]?.id === "_empty" && "text-gray-400"}
            `}
          >
            {items[value].iconTitle}
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {Object.values(items).map((item) => (
                <Listbox.Option
                  key={item.id}
                  className={({ active }) =>
                    classNames(
                      active ? "text-white bg-indigo-600" : "text-gray-900",
                      "cursor-pointer select-none relative py-2 pl-3 pr-9"
                    )
                  }
                  value={item.value}
                >
                  {({ selected, active }) => (
                    <>
                      <div className="flex items-center">
                        <div>{item.icon}</div>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "ml-2 block truncate"
                          )}
                        >
                          {item.description}
                        </span>
                      </div>

                      {selected ? (
                        <span
                          className={classNames(
                            active ? "text-white" : "text-indigo-600",
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
