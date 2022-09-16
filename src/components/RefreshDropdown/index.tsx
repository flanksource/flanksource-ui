import { Menu } from "@headlessui/react";
import { useEffect, useState } from "react";
import { HiOutlineChevronDown, HiOutlineRefresh } from "react-icons/hi";
import useTimeRangeToDisableRefreshDropdownOptions from "../Hooks/useTimeRangeToDisableRefreshDropdownOptions";

const HEALTH_PAGE_REFRESH_RATE_KEY = "healthPageRefreshRate";

/**
 *
 * This takes a readonly tuple and returns a union type
 *
 * An example of readonly tuple is the RefreshOptions below
 *
 */
export type ReadonlyTupleToUnionType<T extends Readonly<any[]>> = T[number];

const RefreshOptions = [
  "None",
  "15s",
  "30s",
  "60s",
  "2m",
  "3m",
  "5m",
  "10m",
  "15m"
] as const;

type Props = {
  /**
   * The local storage key to use for storing the refresh rate
   **/
  localStorageKey?: string;
  onClick: (...args: any[]) => void;
  isLoading?: boolean;
};

export default function RefreshButton({
  localStorageKey = HEALTH_PAGE_REFRESH_RATE_KEY,
  isLoading = false,
  onClick
}: Props) {
  const [refreshRate, setRefreshRate] =
    useState<ReadonlyTupleToUnionType<typeof RefreshOptions>>("None");

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
    <div>
      <button
        onClick={onClick}
        className={`bg-gray-100 border border-r-0 border-gray-300 p-1 px-2`}
      >
        <HiOutlineRefresh
          size={18}
          className={`inline-block ${isLoading && "animate-spin"}`}
        />
      </button>
      <Menu>
        {/* @ts-expect-error */}
        <Menu.Button className="bg-gray-100 border border-gray-300 p-1  ">
          <span className="inline p-1 pr-2"> {refreshRate}</span>
          <HiOutlineChevronDown className="inline" />
        </Menu.Button>
        {/* @ts-expect-error */}
        <Menu.Items as="ul">
          {RefreshOptions.map((option) => (
            <>
              {/* @ts-expect-error */}
              <Menu.Item
                onClick={() => setRefreshRate(option)}
                as="li"
                disabled={
                  !!refreshDropdownDisabledOptions.find(
                    (opts) => opts === option
                  )
                }
              >
                {({ active, disabled }) => (
                  <li
                    className={`${
                      disabled ? "text-gray-500" : "cursor-pointer"
                    }`}
                  >
                    {option}
                  </li>
                )}
              </Menu.Item>
            </>
          ))}
        </Menu.Items>
      </Menu>
    </div>
  );
}
