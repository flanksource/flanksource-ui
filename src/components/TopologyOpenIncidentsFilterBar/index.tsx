import { Menu, Transition } from "@headlessui/react";
import { Fragment, ReactNode, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaFilter } from "react-icons/fa";
import { HiOutlineChevronDown } from "react-icons/hi";
import { RiLightbulbFill } from "react-icons/ri";
import { typeItems } from "../Incidents/data";

const filterIncidentsStatusOptions: Record<
  string,
  { text: string; icon: ReactNode }
> = {
  All: {
    text: "All",
    icon: ""
  },
  Open: {
    text: "Open",
    icon: <RiLightbulbFill color="green" />
  },
  Closed: {
    text: "Closed",
    icon: <AiOutlineClose color="gray" />
  }
} as const;

export type IncidentFilter = {
  type: "all" | keyof typeof typeItems;
  status: keyof typeof filterIncidentsStatusOptions;
  age: number;
};

type Props = {
  onChangeFilterValues: (filterValues: IncidentFilter) => void;
  defaultValues: IncidentFilter;
};

export default function TopologyOpenIncidentsFilterBar({
  defaultValues,
  onChangeFilterValues
}: Props) {
  const [filterValues, setFilterValues] = useState(() => defaultValues);

  useEffect(() => {
    onChangeFilterValues(filterValues);
  }, [filterValues, onChangeFilterValues]);

  return (
    <div className="flex flex-row text-xs">
      <div>
        <FaFilter className="text-gray-500 w-4 inline-block object-center" />
      </div>

      <div className="flex flex-row space-x-2 w-auto">
        <label className="text-gray-500">Type: </label>
        <div className="relative">
          <Menu>
            {/* @ts-expect-error */}
            <Menu.Button className="font-semibold space-x-3 capitalize">
              <span>{filterValues.type}</span>
              <HiOutlineChevronDown className="inline text-gray-500" />
            </Menu.Button>
            {/* @ts-expect-error */}
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              {/* @ts-expect-error */}
              <Menu.Items
                as="ul"
                className="absolute left-0 mt-2 p-1 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-xs"
              >
                {/* @ts-expect-error */}
                <Menu.Item
                  key="all"
                  as="li"
                  className="flex flex-row p-1 items-center cursor-pointer hover:bg-blue-200 text-black rounded-sm"
                >
                  <button
                    className="flex flex-row w-full"
                    onClick={() => {
                      setFilterValues((state) => ({
                        ...state,
                        type: "all"
                      }));
                    }}
                  >
                    All
                  </button>
                </Menu.Item>
                {Object.entries(typeItems).map(([key, content]) => (
                  <>
                    {/* @ts-expect-error */}
                    <Menu.Item
                      key={"filter-" + key}
                      as="li"
                      className="flex flex-row p-1 items-center cursor-pointer hover:bg-blue-200 text-black rounded-sm"
                    >
                      <button
                        className="flex flex-row w-full items-center space-x-1"
                        onClick={() => {
                          setFilterValues((state) => ({
                            ...state,
                            type: content.value as IncidentFilter["type"]
                          }));
                        }}
                      >
                        {content.icon} <span>{content.description}</span>
                      </button>
                    </Menu.Item>
                  </>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      <div className="flex flex-row space-x-2 flex-1">
        <label className="text-gray-500">Status: </label>
        <div className="relative">
          <Menu>
            {/* @ts-expect-error */}
            <Menu.Button className="font-semibold space-x-3 capitalize">
              <span>{filterValues.status}</span>
              <HiOutlineChevronDown className="inline text-gray-500" />
            </Menu.Button>
            {/* @ts-expect-error */}
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              {/* @ts-expect-error */}
              <Menu.Items
                as="ul"
                className="absolute left-0 mt-2 p-1 w-auto origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-xs"
              >
                {Object.entries(filterIncidentsStatusOptions).map(
                  ([key, content]) => (
                    <>
                      {/* @ts-expect-error */}
                      <Menu.Item
                        key={key}
                        as="li"
                        className="flex flex-row p-1 items-center cursor-pointer hover:bg-blue-200 text-black rounded-sm"
                      >
                        <button
                          className="flex flex-row w-full  items-center space-x-1"
                          onClick={() => {
                            setFilterValues((state) => ({
                              ...state,
                              status: key as IncidentFilter["status"]
                            }));
                          }}
                        >
                          {content.icon} <span>{content.text}</span>
                        </button>
                      </Menu.Item>
                    </>
                  )
                )}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
}
