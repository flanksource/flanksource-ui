import { Menu } from "@headlessui/react";
import { useState } from "react";
import { HiOutlineChevronDown, HiOutlineRefresh } from "react-icons/hi";

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

type Props = {};

export default function RefreshButton({}: Props) {
  const [refreshRate, setRefreshRate] = useState("None");

  return (
    <div>
      <button className="bg-gray-100 border border-r-0 border-gray-300 p-1 ">
        <HiOutlineRefresh size={18} className="inline-block" />
      </button>
      <Menu>
        {/* @ts-expect-error */}
        <Menu.Button className="bg-gray-100 border border-gray-300 p-1  ">
          <span className="inline p-1"> {refreshRate}</span>
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
                className={`ui-active:bg-blue-500`}
              >
                {option}
              </Menu.Item>
            </>
          ))}
        </Menu.Items>
      </Menu>
    </div>
  );
}
