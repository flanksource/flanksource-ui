/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Controller } from "react-hook-form";
import { isArray } from "lodash";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Dropdown({
  className,
  label,
  control,
  items = {},
  name,
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
  return (
    <>
      <div className={className}>
        <Controller
          control={control}
          name={name}
          render={({ field }) => {
            const { onChange, value } = field;
            if (items[value] == null) {
              return null;
            }
            return (
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
                    <div className={`${label && "mt-1"} relative`}>
                      <Listbox.Button className="relative cursor-pointer w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left  focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <div className="flex items-center">
                          {items[value] && items[value].icon}
                          <span className="ml-3 block truncate">
                            {items[value] && items[value].description}
                          </span>
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
                          {Object.values(items).map((item) => (
                            <Listbox.Option
                              key={item.id}
                              className={({ active }) =>
                                classNames(
                                  active
                                    ? "text-white bg-indigo-600"
                                    : "text-gray-900",
                                  "cursor-pointer select-none relative py-2 pl-3 pr-9"
                                )
                              }
                              value={item.value}
                            >
                              {({ selected, active }) => (
                                <>
                                  <div className="flex items-center">
                                    {item.icon}
                                    <span
                                      className={classNames(
                                        selected
                                          ? "font-semibold"
                                          : "font-normal",
                                        "ml-3 block truncate"
                                      )}
                                    >
                                      {item.description}
                                    </span>
                                  </div>

                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active
                                          ? "text-white"
                                          : "text-indigo-600",
                                        "absolute inset-y-0 right-0 flex items-center pr-4"
                                      )}
                                    >
                                      <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
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
          }}
        />
      </div>
    </>
  );
}
