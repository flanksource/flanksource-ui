import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import {
  HiOutlineChevronDown,
  HiOutlineClock,
  HiOutlineRefresh
} from "react-icons/hi";
import useTimeRangeToDisableRefreshDropdownOptions from "../Hooks/useTimeRangeToDisableRefreshDropdownOptions";

const HEALTH_PAGE_REFRESH_RATE_KEY = "healthPageRefreshRate";

export type RefreshOptions =
  | "None"
  | "15s"
  | "30s"
  | "60s"
  | "2m"
  | "3m"
  | "5m"
  | "10m"
  | "15m";

const RefreshOptionsList = [
  ["None", "None"],
  ["15s", "15 seconds"],
  ["30s", "30 seconds"],
  ["60s", "1 minute"],
  ["2m", "2 minutes"],
  ["3m", "3 minutes"],
  ["5m", "5 minutes"],
  ["10m", "10 minutes"],
  ["15m", "15 minutes"]
] as const;

type Props = {
  /**
   * The local storage key to use for storing the refresh rate
   **/
  localStorageKey?: string;
  /**
   * The event handler to call when the refresh button is clicked
   */
  onClick: (...args: any[]) => void;
  /**
   * Whether or not to animate the refresh icon
   */
  isLoading?: boolean;
};

export default function RefreshDropdown({
  localStorageKey = HEALTH_PAGE_REFRESH_RATE_KEY,
  isLoading = false,
  onClick = () => {}
}: Props) {
  const [refreshRate, setRefreshRate] = useState<RefreshOptions>(() => {
    const storedRefreshRate = localStorage.getItem(localStorageKey);
    if (storedRefreshRate) {
      return storedRefreshRate as RefreshOptions;
    }
    return "None";
  });

  const refreshDropdownDisabledOptions =
    useTimeRangeToDisableRefreshDropdownOptions();

  /* Whenever refresh rate changes update local storage */
  useEffect(() => {
    if (refreshRate === "None") {
      localStorage.removeItem(localStorageKey);
      return;
    }
    localStorage.setItem(localStorageKey, refreshRate);
  }, [localStorageKey, refreshRate]);

  return (
    <div className="relative px-2">
      <div>
        <button
          onClick={() => onClick()}
          className={` border border-r-0 border-gray-300 p-[0.35rem] px-2  rounded-md rounded-r-none`}
        >
          <HiOutlineRefresh
            size={18}
            className={`inline-block ${isLoading && "animate-spin"}`}
          />
        </button>
        <Menu>
          {/* @ts-expect-error */}
          <Menu.Button className="border border-gray-300 p-2 text-sm rounded-md rounded-l-none">
            <span className="inline p-1 pr-2">{refreshRate}</span>
            <HiOutlineChevronDown className="inline" />
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
              className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              {RefreshOptionsList.map(([optionsKeys, optionsValue]) => (
                <>
                  {/* @ts-expect-error */}
                  <Menu.Item
                    as="li"
                    className="block"
                    disabled={
                      !!refreshDropdownDisabledOptions.find(
                        (opts) => opts === optionsKeys
                      )
                    }
                  >
                    {({ active, disabled }) => (
                      <button
                        onClick={() => setRefreshRate(optionsKeys)}
                        disabled={
                          !!refreshDropdownDisabledOptions.find(
                            (opts) => opts === optionsKeys
                          )
                        }
                        className={`flex group w-full items-center rounded-md px-2 py-2  ${
                          disabled ? "text-gray-500" : "cursor-pointer"
                        } ${active ? "bg-blue-200" : "text-gray-900"} ${
                          refreshRate === optionsKeys ? "font-bold" : ""
                        }`}
                      >
                        <HiOutlineClock
                          className="mr-2 h-5 w-5"
                          aria-hidden="true"
                        />
                        {optionsValue}
                      </button>
                    )}
                  </Menu.Item>
                </>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}
