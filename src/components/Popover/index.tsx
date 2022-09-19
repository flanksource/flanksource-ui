import clsx from "clsx";

import { TopologySort } from "./topologySort";
import { TopologyPreference } from "./topologyPreference";

export enum POPOVERS {
  topologySort = "topologySort",
  topologyPreference = "topologyPreference"
}

const POPOVER = {
  [POPOVERS.topologySort]: {
    name: POPOVERS.topologySort,
    title: "Sort By",
    component: TopologySort
  },
  [POPOVERS.topologyPreference]: {
    name: POPOVERS.topologyPreference,
    title: "Preferences",
    component: TopologyPreference
  }
};

type PopOverType = {
  width?: number;
  isOpen: boolean;
  type?: POPOVERS;
  children?: JSX.Element | JSX.Element[];
} & Partial<Parameters<typeof TopologySort>[0]> &
  Partial<Parameters<typeof TopologyPreference>[0]>;

export const PopOver = ({
  type,
  children,
  width = 96,
  ...props
}: PopOverType) => {
  let component;

  if (children) {
    component = children;
  }

  if (type) {
    const { component: PopOverComponent, ...moreProps } = POPOVER[type];
    component = <PopOverComponent {...props} {...moreProps} />;
  }

  if (!component) {
    return null;
  }

  return (
    <div
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      className={clsx(
        "origin-top-right absolute right-0 mt-10 w-96 z-50 divide-y divide-gray-100 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none capitalize",
        props.isOpen === true ? "display-block" : "hidden",
        Boolean(width) ? `w-${width}` : "w-96"
      )}
    >
      {component}
    </div>
  );
};

export default PopOver;
