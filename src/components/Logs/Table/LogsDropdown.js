import React from "react";
import { Menu } from "@headlessui/react";
import { v4 as uuidv4 } from "uuid";

export const LogsDropdown = ({ buttonTitle, items }) => (
  <Menu>
    <Menu.Button>
      <label className="w-full">
        <p className="text-left text-sm">{buttonTitle}</p>
        <input type="text" placeholder={buttonTitle} className="w-full" />
      </label>
    </Menu.Button>
    <Menu.Items>
      <div className="border mt-1.5 rounded-6px">
        {items.map((data) => (
          <Menu.Item key={uuidv4()}>
            {({ active }) => (
              <div className={`${active && "bg-lightest-gray"}`}>
                <p className="text-sm py-3 text-leading-5 font-normal pl-8">
                  {data}
                </p>
              </div>
            )}
          </Menu.Item>
        ))}
      </div>
    </Menu.Items>
  </Menu>
);
