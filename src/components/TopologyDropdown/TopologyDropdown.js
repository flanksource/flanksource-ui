import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Menu, Transition } from "@headlessui/react";
import cx from "clsx";

export const TopologyDropdown = ({
  items,
  renderButton,
  className,
  menuButtonClassName
}) => (
  <Menu as="div" className={cx("relative inline-block", className)}>
    <Menu.Button className={menuButtonClassName}>{renderButton()}</Menu.Button>
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className="absolute right-0 font-inter w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-card ring-1 ring-black ring-opacity-5 focus:outline-none">
        {items.map(({ title }) => (
          <Menu.Item key={title}>
            <div className="py-3 pl-4 pr-3 text-sm">{title}</div>
          </Menu.Item>
        ))}
      </Menu.Items>
    </Transition>
  </Menu>
);

TopologyDropdown.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  renderButton: PropTypes.func.isRequired,
  menuButtonClassName: PropTypes.string
};

TopologyDropdown.defaultProps = {
  className: "",
  menuButtonClassName: ""
};
