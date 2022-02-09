import React, { Fragment, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { HiOutlineChevronDown } from "react-icons/hi";

export const ListBoxLogs = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState(items[3]);
  return (
    <Listbox value={selectedItem} onChange={setSelectedItem}>
      <div className="relative mt-1 mb-3">
        <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
          <span className="block truncate text-gray-warmer text-base font-normal">
            {selectedItem.name}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <div className="w-5 h-5 text-gray-400" aria-hidden="true">
              <HiOutlineChevronDown />
            </div>
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
            {items.map((person, personIdx) => (
              <Listbox.Option
                key={personIdx}
                className={({ active }) =>
                  `${active ? "text-amber-900 bg-amber-100" : "text-gray-900"}
                          cursor-default select-none relative py-2 pl-10 pr-4`
                }
                value={person}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`${
                        selected ? "font-medium" : "font-normal"
                      } text-sm text-leading-5 block truncate ${
                        personIdx === 0 && "text-dark-blue"
                      }`}
                    >
                      {person.name}
                    </span>
                    {selected ? (
                      <span
                        className={`${
                          active ? "text-amber-600" : "text-amber-600"
                        }
                                absolute inset-y-0 left-0 flex items-center pl-3 text-sm py-3 text-leading-5 font-normal`}
                      >
                        <div className="text-dark-blue">
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </div>
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
