import { Disclosure, Menu } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { IconType } from "react-icons";
import { IoChevronForwardOutline } from "react-icons/io5";
import { NavLink, Outlet } from "react-router-dom";

import { getUser } from "../../api/auth";
import { useOuterClick } from "../../lib/useOuterClick";
import { getLocalItem, setLocalItem } from "../../utils/storage";
import { Icon } from "../Icon";

interface SideNavItemI {
  name: string;
  href: string;
  icon: IconType;
}

interface SideNavGroupI {
  name: string;
  icon: IconType;
  submenu: SideNavItemI[];
}

export type SideNav = (SideNavItemI | SideNavGroupI)[];

interface Props {
  navigation: SideNav;
}

interface SideNavGroupProps {
  navs: SideNav;
  collapseSidebar?: boolean;
}

const NavLabel = ({
  icon: Icon,
  active,
  iconOnly = false,
  name
}: {
  icon: IconType;
  active: boolean;
  iconOnly?: boolean;
  name: string;
}) => (
  <span className="flex">
    <Icon
      className={clsx(
        active ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500",
        "mr-3 flex-shrink-0 h-6 w-6"
      )}
      aria-hidden="true"
    />
    <p
      className={clsx("duration-300 transition-opacity", {
        "opacity-0": iconOnly
      })}
    >
      {name}
    </p>
  </span>
);

interface NavItemWrapperProps {
  as?: React.ElementType<any>;
  children: React.ReactNode;
  active?: boolean;
  to?: string;
}

const NavItemWrapper = (props: NavItemWrapperProps) => {
  const { as: Component = "div", active, children } = props;

  const cls = clsx(
    active
      ? "bg-gray-100 text-gray-900"
      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
    "group rounded-md py-2 px-2 flex items-center text-sm font-medium"
  );
  return Component === "div" ? (
    <div className={cls}>{children} </div>
  ) : (
    <Component to={props.to} className={cls}>
      {children}
    </Component>
  );
};
function SideNavItem({
  name,
  current = false,
  href,
  collapseSidebar,
  icon
}: SideNavItemI & { collapseSidebar: boolean; current?: boolean }) {
  return (
    <NavItemWrapper as={NavLink} to={href}>
      <NavLabel
        icon={icon}
        active={current}
        iconOnly={collapseSidebar}
        name={name}
      />
    </NavItemWrapper>
  );
}

function SideNavGroup({
  submenu,
  name,
  icon,
  collapseSidebar,
  current = false
}: {
  submenu: SideNavItemI[];
  name: string;
  icon: IconType;
  current?: boolean;
  collapseSidebar: boolean;
}) {
  if (collapseSidebar) {
    return (
      <Menu as="div" className="relative">
        <Menu.Button className="w-full">
          <NavItemWrapper>
            <NavLabel icon={icon} active={current} iconOnly name={name} />
          </NavItemWrapper>
        </Menu.Button>
        <Menu.Items className="absolute bg-gray-100 border left-0 ml-12 shadow-md top-0 z-10">
          {submenu.map(({ name, icon, href }) => (
            <Menu.Item key={name}>
              {({ active }) => (
                <NavLink className="w-full" to={href}>
                  <NavItemWrapper active={active}>
                    <NavLabel icon={icon} active={active} name={name} />
                  </NavItemWrapper>
                </NavLink>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Menu>
    );
  }

  return (
    <Disclosure as="div">
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
          <Disclosure.Panel className="pl-2">
            <SideNav navs={submenu} />
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

function isSubmenu(item: SideNavItemI | SideNavGroupI): item is SideNavGroupI {
  return "submenu" in item;
}

function SideNav({ navs, collapseSidebar = false }: SideNavGroupProps) {
  return (
    <nav className="flex-1 px-2 space-y-1">
      {navs.map((item) => (
        <div key={item.name} data-tip={item.name}>
          {isSubmenu(item) ? (
            <SideNavGroup {...item} collapseSidebar={collapseSidebar} />
          ) : (
            <SideNavItem {...item} collapseSidebar={collapseSidebar} />
          )}
        </div>
      ))}
    </nav>
  );
}

export function SidebarLayout({ navigation }: Props) {
  const [user, setUser] = useState(null);
  const [collapseSidebar, setCollapseSidebar] = useState(false);

  useEffect(() => {
    getUser().then((user) => {
      setUser(user);
    });
  }, []);

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

  if (user == null) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex h-screen">
        <div
          className={clsx("transform duration-500 w-14 z-10", {
            "lg:w-64": !collapseSidebar
          })}
          ref={innerRef}
        >
          <div
            className={clsx("h-full transform duration-500 w-14", {
              "lg:w-64": !collapseSidebar
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

            <div className="h-full border-r border-gray-200 pt-5 flex flex-col flex-grow bg-white">
              {collapseSidebar ? (
                <div className="w-14">
                  <Icon
                    name="flanksource-icon"
                    className="px-3 w-auto h-auto"
                  />
                </div>
              ) : (
                <Icon name="flanksource" className="w-auto h-auto px-4" />
              )}
              <div className="flex-grow mt-5 flex flex-col">
                <SideNav navs={navigation} collapseSidebar={collapseSidebar} />
              </div>
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
}
