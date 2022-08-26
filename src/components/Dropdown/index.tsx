import clsx from "clsx";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Controller } from "react-hook-form";
import { isArray } from "lodash";

export function Dropdown({
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
  // eslint-disable-next-line no-underscore-dangle
  let _items = items;
  if (isArray(items)) {
    _items = {};
    items.forEach((item) => {
      const i = {
        label: item.label || item.description,
        name: item.name || item.id,
        id: item.id || item.name || item.value,
        key: item.id || item.name || item.value,
        icon: item.icon,
        description: item.description,
        value: item.value
      };
      _items[i.id] = i;
    });
  }
  items = _items;

  //  check if has placeholder
  if (placeholder) {
    const placeholderObj = {
      description: placeholder,
      name: "none",
      id: "none",
      key: "none",
      value: null
    };
    items = { null: placeholderObj, ...items };
  }

  // check if emptyable
  if (emptyable && Object.values(items).length === 0) {
    const emptyObj = {
      description: "No available selections",
      name: "_empty",
      id: "_empty",
      key: "_empty",
      value: null
    };
    items = { null: emptyObj, ...items };
  }
  return (
    <div className={className}>
      {control ? (
        <Controller
          control={control}
          name={name}
          render={({ field }) => {
            const { onChange: onChangeControlled, value: valueControlled } =
              field;
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
        <div className={`${label && "mt-1"} relative h-full`}>
          <Listbox.Button
            className={`relative cursor-pointer h-full w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-1 text-left  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm
              ${items[value]?.id === "_empty" && "text-gray-400"}
            `}
          >
            <div className="flex items-center">
              {prefix}
              {items[value] && <div>{items[value].icon}</div>}
              <span className="ml-2 block truncate">
                {labelPrefix}
                {items[value] && items[value].description}
                {labelSuffix}
              </span>
              {suffix}
            </div>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {Object.values(items)
                .sort((a, b) => {
                  if (
                    Object.prototype.hasOwnProperty.call(a, "order") &&
                    Object.prototype.hasOwnProperty.call(b, "order")
                  ) {
                    return a.order - b.order;
                  }
                  if (Object.prototype.hasOwnProperty.call(a, "order")) {
                    return -1;
                  }
                  if (Object.prototype.hasOwnProperty.call(b, "order")) {
                    return 1;
                  }
                  return 0;
                })
                .map((item) => (
                  <Listbox.Option
                    key={item.id || item.value}
                    className={({ active }) =>
                      clsx(
                        active ? "text-white bg-blue-600" : "text-gray-900",
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
                            className={clsx(
                              selected ? "font-semibold" : "font-normal",
                              "ml-2 block truncate"
                            )}
                          >
                            {item.description}
                          </span>
                        </div>

                        {!!selected && (
                          <span
                            className={clsx(
                              active ? "text-white" : "text-blue-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
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
