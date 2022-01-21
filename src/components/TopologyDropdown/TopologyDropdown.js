import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Menu, Transition } from "@headlessui/react";
import { Icon } from "../Icon";

export const TopologyDropdown = ({ items }) => (
  <Menu>
    <Menu.Button>
      <div className="flex-initial text-1 p-1.5 mt-1.5">
        <Icon name="dots" className="" />
      </div>
    </Menu.Button>
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className="absolute right-0 font-inter w-56 mt-8 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-card ring-1 ring-black ring-opacity-5 focus:outline-none">
        {items.map(({ title }) => (
          <Menu.Item key={title}>
            <div className="py-3 ml-4 text-sm">{title}</div>
          </Menu.Item>
        ))}
      </Menu.Items>
    </Transition>
  </Menu>
);

TopologyDropdown.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};
