import { Disclosure, Menu } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { IconType } from "react-icons";
import { IoChevronForwardOutline } from "react-icons/io5";
import { Link, NavLink, Outlet } from "react-router-dom";
import { NavigationItems, SettingsNavigationItems } from "../../App";
import { $ArrayElemType } from "../../types/utility";

import { AuthContext } from "../../context";
import { useFeatureFlagsContext } from "../../context/FeatureFlagsContext";
import { useOuterClick } from "../../lib/useOuterClick";
import { getLocalItem, setLocalItem } from "../../utils/storage";
import { withAccessCheck } from "../AccessCheck/AccessCheck";
import { Icon } from "../Icon";
import FullPageSkeletonLoader from "../SkeletonLoader/FullPageSkeletonLoader";

interface Props {
  navigation: NavigationItems;
  settingsNav: SettingsNavigationItems;
  checkPath: boolean;
}

interface SideNavGroupProps {
  navs: NavigationItems;
  settings: SettingsNavigationItems;
  collapseSidebar?: boolean;
  checkPath: boolean;
}

type NavLabelProps = {
  icon: IconType;
  active: boolean;
  iconOnly?: boolean;
  name: string;
};

function NavLabel({
  icon: Icon,
  active,
  iconOnly = false,
  name
}: NavLabelProps) {
  return (
    <span className="flex items-center">
      <Icon
        className={clsx(
          active
            ? "text-gray-100 font-bold"
            : "text-gray-200 group-hover:text-gray-100",
          "flex-shrink-0",
          iconOnly ? "h-7 w-7" : "mr-3 h-6 w-6"
        )}
        aria-hidden="true"
      />
      {!iconOnly && (
        <p className={clsx("duration-300 transition-opacity")}>{name}</p>
      )}
    </span>
  );
}

interface NavItemWrapperProps {
  as?: React.ElementType<any>;
  children: React.ReactNode;
  active?: boolean;
  to?: string;
  className?: string;
}

function NavItemWrapper(props: NavItemWrapperProps) {
  const { as: Component = "div", active, children, className } = props;

  const cls = ({ isActive }: { isActive: boolean }) =>
    clsx(
      active || isActive
        ? "bg-gray-800 text-gray-100"
        : "text-gray-200 hover:bg-gray-800 hover:text-gray-100",
      "group rounded-md py-1.5 px-2 flex items-center text-md font-medium",
      className
    );
  return Component === "div" ? (
    <div className={cls({ isActive: false })}>{children} </div>
  ) : (
    <Component to={props.to} className={cls}>
      {children}
    </Component>
  );
}

function SideNavItem({
  name,
  current = false,
  href,
  collapseSidebar,
  icon
}: $ArrayElemType<NavigationItems> & {
  collapseSidebar: boolean;
  current?: boolean;
}) {
  return (
    <NavItemWrapper
      className={clsx(collapseSidebar && "justify-center")}
      as={NavLink}
      to={href}
    >
      {/* @ts-expect-error */}
      {({ isActive }) => (
        <NavLabel
          icon={icon as IconType}
          active={current || isActive}
          iconOnly={collapseSidebar}
          name={name}
        />
      )}
    </NavItemWrapper>
  );
}

function SideNavGroup({
  submenu,
  name,
  icon,
  collapseSidebar,
  current = false,
  checkPath
}: SettingsNavigationItems & {
  current?: boolean;
  collapseSidebar: boolean;
}) {
  const { isFeatureDisabled } = useFeatureFlagsContext();

  if (collapseSidebar) {
    return (
      <Menu as="div" className="relative">
        {/* @ts-expect-error */}
        <Menu.Button className="w-full">
          <NavItemWrapper className="justify-center">
            <NavLabel icon={icon} active={current} iconOnly name={name} />
          </NavItemWrapper>
        </Menu.Button>
        {/* @ts-expect-error */}
        <Menu.Items className="absolute border left-0 ml-12 w-48 shadow-md top-0 z-10 bg-gray-800 space-y-1">
          {submenu.map(({ name, icon, href, featureName, resourceName }) => {
            return !isFeatureDisabled(featureName!)
              ? withAccessCheck(
                  /* @ts-expect-error */
                  <Menu.Item key={name}>
                    {/* @ts-expect-error */}
                    {({ active }) => (
                      <NavLink className="w-full" to={href}>
                        <NavItemWrapper active={active}>
                          <NavLabel
                            icon={icon as IconType}
                            active={active}
                            name={name}
                          />
                        </NavItemWrapper>
                      </NavLink>
                    )}
                  </Menu.Item>,
                  resourceName,
                  "read"
                )
              : null;
          })}
        </Menu.Items>
      </Menu>
    );
  }

  return (
    <Disclosure as="div" defaultOpen={checkPath ? true : false}>
      {({ open }) => (
        <>
          <Disclosure.Button className="w-full">
            <NavItemWrapper>
              <div className="flex w-full justify-between">
                <NavLabel
                  icon={icon}
                  active={current}
                  iconOnly={collapseSidebar}
                  name={name}
                />
                <ChevronUpIcon
                  className={`${
                    submenu && open ? "rotate-180 transform" : ""
                  } h-5 w-5`}
                />
              </div>
            </NavItemWrapper>
          </Disclosure.Button>
          <Disclosure.Panel className="pl-4 space-y-1">
            {submenu.map((item) =>
              !isFeatureDisabled(item.featureName!)
                ? withAccessCheck(
                    <SideNavItem
                      key={item.name}
                      {...item}
                      collapseSidebar={false}
                    />,
                    item.resourceName,
                    "read"
                  )
                : null
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

function SideNav({
  navs,
  settings,
  collapseSidebar = false,
  checkPath
}: SideNavGroupProps) {
  const { isFeatureDisabled } = useFeatureFlagsContext();

  return (
    <nav className="flex flex-col divide-y divide-gray-500">
      <div className="flex flex-col gap-1 mb-1">
        {navs.map((item) =>
          !isFeatureDisabled(item.featureName!)
            ? withAccessCheck(
                <SideNavItem
                  key={item.name}
                  {...item}
                  collapseSidebar={collapseSidebar}
                />,
                item.resourceName,
                "read"
              )
            : null
        )}
      </div>
      {withAccessCheck(
        <div>
          <SideNavGroup
            {...settings}
            collapseSidebar={collapseSidebar}
            checkPath={checkPath}
          />
        </div>,
        settings.submenu.map((item) => item.resourceName),
        "read"
      )}
    </nav>
  );
}

export function SidebarLayout({ navigation, settingsNav, checkPath }: Props) {
  const { user } = useContext(AuthContext);
  const [collapseSidebar, setCollapseSidebar] = useState(false);

  useEffect(() => {
    const localCollapsed = getLocalItem("sidebarCollapsed") ?? false;
    const sidebarCollapsed =
      typeof localCollapsed === "string"
        ? JSON.parse(localCollapsed)
        : localCollapsed;
    setCollapseSidebar(sidebarCollapsed);
  }, []);

  useEffect(() => {
    setLocalItem("sidebarCollapsed", collapseSidebar);
  }, [collapseSidebar]);

  const closeOnOuterClick = useCallback(() => {
    if (!collapseSidebar && window.innerWidth < 1024) {
      setCollapseSidebar(true);
    }
  }, [collapseSidebar]);

  const innerRef = useOuterClick(closeOnOuterClick);

  // [TODO] user comes context, probably show an error here instead of a loading
  // animation
  if (user == null) {
    return <FullPageSkeletonLoader />;
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex flex-row h-screen min-w-[1280px]">
        <div
          className={clsx(
            "transform duration-500 z-10 bg-gray-700 flex flex-col",
            {
              "w-56": !collapseSidebar,
              "w-14": collapseSidebar
            }
          )}
          ref={innerRef}
        >
          <div
            className={clsx("flex flex-col h-full transform duration-500", {
              "w-56": !collapseSidebar,
              "w-14": collapseSidebar
            })}
          >
            <button
              type="button"
              className={clsx(
                "absolute bg-white -right-6 top-20 border border-gray-300 rounded-full transform duration-500 m-2 p-1 hover:bg-gray-200",
                { "rotate-180": !collapseSidebar }
              )}
              onClick={() => setCollapseSidebar((value) => !value)}
            >
              <IoChevronForwardOutline />
            </button>

            <Link
              to={{
                pathname: "/"
              }}
            >
              {collapseSidebar ? (
                <div className="flex border-b border-b-gray-500 h-16 shadow">
                  <Icon
                    name="mission-control-white"
                    className="w-10 h-auto m-auto fill-white stroke-white"
                  />
                </div>
              ) : (
                <div className="p-3 pl-5 border-b border-b-gray-500 shadow">
                  <Icon
                    name="mission-control-logo-white"
                    className="h-10 stroke-white"
                  />
                </div>
              )}
            </Link>

            <div
              className={clsx(
                "flex flex-col flex-1 overflow-y-auto",
                collapseSidebar ? "px-1" : "px-3"
              )}
            >
              <div className="flex-grow mt-5 flex flex-col">
                <SideNav
                  navs={navigation}
                  settings={settingsNav}
                  collapseSidebar={collapseSidebar}
                  checkPath={checkPath}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 h-screen overflow-auto bg-gray-50">
          <Outlet />
        </div>
      </div>
    </>
  );
}
