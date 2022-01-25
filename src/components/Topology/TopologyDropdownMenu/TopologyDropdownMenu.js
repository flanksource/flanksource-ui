import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Menu, Transition } from "@headlessui/react";
import cx from "clsx";

export const TopologyDropdownMenu = ({
  items,
  renderButton,
  className,
  menuButtonClassName,
  keyProperty,
  renderItem = (item) => (
    <div className="py-3 pl-4 pr-3 text-sm">{item.title}</div>
  )
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
      <Menu.Items className="absolute grid right-0 top-full font-inter w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-card ring-1 ring-black ring-opacity-5 focus:outline-none ">
        {items.map((item) => (
          <Menu.Item key={item[keyProperty] || item.title}>
            {(renderProps) => (
              <button type="button" className="hover:bg-gray-200">
                {renderItem(item, renderProps)}
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Transition>
  </Menu>
);

TopologyDropdownMenu.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  renderButton: PropTypes.func.isRequired,
  menuButtonClassName: PropTypes.string,
  keyProperty: PropTypes.string,
  // eslint-disable-next-line react/require-default-props
  renderItem: PropTypes.func
};

TopologyDropdownMenu.defaultProps = {
  className: "",
  menuButtonClassName: "",
  keyProperty: "title"
};
