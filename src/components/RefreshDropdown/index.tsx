import { Menu, Transition } from "@headlessui/react";
import { Fragment, useContext, useEffect, useState } from "react";
import {
  HiOutlineChevronDown,
  HiOutlineClock,
  HiOutlineRefresh
} from "react-icons/hi";
import useTimeRangeToDisableRefreshDropdownOptions from "../Hooks/useTimeRangeToDisableRefreshDropdownOptions";
import { HealthRefreshDropdownRateContext } from "./RefreshRateContext";

export const HEALTH_PAGE_REFRESH_RATE_KEY = "healthPageRefreshRate";
export const HEALTH_PAGE_REFRESH_RATE_STORAGE_CHANGE_EVENT =
  "healthPageRefreshRateChanged";

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

type RefreshRateState = {
  rate: RefreshOptions;
  /**
   * Whether rate should be persisted to local storage
   */
  saveToLocalStorage: boolean;
};

export default function RefreshDropdown({
  localStorageKey = HEALTH_PAGE_REFRESH_RATE_KEY,
  isLoading = false,
  onClick = () => {}
}: Props) {
  const [refreshRate, setRefreshRate] = useState<RefreshRateState>(() => {
    const storedRefreshRate = localStorage.getItem(localStorageKey);
    if (storedRefreshRate) {
      return {
        rate: storedRefreshRate as RefreshOptions,
        saveToLocalStorage: true
      };
    }
    return { rate: "None", saveToLocalStorage: false };
  });

  const { setRefreshRate: setRefreshRateContext } = useContext(
    HealthRefreshDropdownRateContext
  );

  const refreshDropdownDisabledOptions =
    useTimeRangeToDisableRefreshDropdownOptions();

  /* Whenever refresh rate changes update local storage and update refresh rate */
  useEffect(() => {
    // remove value from local storage if rate is None, or if saveToLocalStorage is false
    if (refreshRate.rate === "None" || !refreshRate.saveToLocalStorage) {
      localStorage.removeItem(localStorageKey);
    }
    if (refreshRate.saveToLocalStorage) {
      localStorage.setItem(localStorageKey, refreshRate.rate);
    }
    // dispatch event to notify others that the refresh rate has changed
    setRefreshRateContext(refreshRate.rate);
  }, [localStorageKey, refreshRate, setRefreshRateContext]);

  /**
   *
   * If a change in timeRange is detected, we need to check if the current
   * refresh rate is disabled. And if it is, we need to set the refresh rate to
   * the next available option that is not disabled.
   *
   * */
  useEffect(() => {
    if (refreshRate.rate === "None") {
      return;
    }
    if (refreshDropdownDisabledOptions.has(refreshRate.rate as any)) {
      // find the next refresh rate that is not disabled
      const nextRefreshRate = RefreshOptionsList.find(([option]) => {
        // we don't want the item to be selected to be disabled
        if (refreshDropdownDisabledOptions.has(option as any)) {
          return false;
        }
        // avoid selecting a lower refresh rate than the current one
        if (
          refreshRate.rate !== "15s" &&
          refreshRate.rate !== "30s" &&
          option === "60s"
        ) {
          return false;
        }
        // we don't want to revert to None
        if (option === "None") {
          return false;
        }
        return true;
      });
      setRefreshRate({
        rate: nextRefreshRate ? (nextRefreshRate[0] as RefreshOptions) : "None",
        saveToLocalStorage: false
      });
    }
  }, [refreshDropdownDisabledOptions, refreshRate]);

  return (
    <div className="flex flex-row px-2">
      <button
        onClick={() => onClick()}
        className={`border border-r-0 border-gray-300 p-[0.35rem] px-2 rounded-md rounded-r-none hover:bg-blue-200`}
      >
        <HiOutlineRefresh
          size={18}
          className={`inline-block ${isLoading && "animate-spin"}`}
        />
      </button>
      <div className="relative">
        <Menu>
          {/* @ts-expect-error */}
          <Menu.Button className="border border-gray-300 p-2 text-sm rounded-md rounded-l-none">
            <span className="inline p-1 pr-2">{refreshRate.rate}</span>
            <HiOutlineChevronDown className="inline" />
          </Menu.Button>
          {/* @ts-expect-error */}
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {RefreshOptionsList.map(([optionsKeys, optionsValue]) => (
                <Fragment key={optionsValue}>
                  {/* @ts-ignore */}
                  <Menu.Item
                    disabled={refreshDropdownDisabledOptions.has(
                      optionsKeys as any
                    )}
                  >
                    {({ active, disabled }: any) => (
                      <button
                        onClick={() =>
                          setRefreshRate({
                            rate: optionsKeys as RefreshOptions,
                            saveToLocalStorage: true
                          })
                        }
                        disabled={refreshDropdownDisabledOptions.has(
                          optionsKeys as any
                        )}
                        className={`flex group w-full items-center rounded-md px-2 py-2 text-sm ${
                          disabled ? "text-gray-500" : "cursor-pointer"
                        } ${active ? "bg-blue-200" : "text-gray-900"} ${
                          refreshRate.rate === optionsKeys ? "font-bold" : ""
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
                </Fragment>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}
