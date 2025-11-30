import { UserAccessStateContext } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import {
  MissionControlLogoWhite,
  MissionControlWhite
} from "@flanksource/icons/mi";
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems
} from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import React, { useCallback, useContext } from "react";
import { IconType } from "react-icons";
import { IoChevronForwardOutline } from "react-icons/io5";
import { Link, NavLink, Outlet } from "react-router-dom";
import { NavigationItems, SettingsNavigationItems } from "../../App";
import { withAuthorizationAccessCheck } from "../../components/Permissions/AuthorizationAccessCheck";
import { AuthContext } from "../../context";
import { useFeatureFlagsContext } from "../../context/FeatureFlagsContext";
import { useOuterClick } from "../../lib/useOuterClick";
import { features } from "../../services/permissions/features";
import { $ArrayElemType } from "../../types/utility";
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
            ? "fill-white font-bold"
            : "fill-zinc-200 group-hover:fill-zinc-50",
          "flex-shrink-0",
          iconOnly ? "h-7 w-7" : "mr-3 h-6 w-6"
        )}
        aria-hidden="true"
      />
      {!iconOnly && (
        <p className={clsx("transition-opacity duration-300")}>{name}</p>
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
        ? "bg-blue-500 text-white"
        : "text-gray-200 hover:bg-blue-500/70 hover:text-white",
      "group rounded-md py-1.5 px-2 flex items-center text-base font-medium",
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
        <MenuButton className="w-full">
          <NavItemWrapper className="justify-center">
            <NavLabel icon={icon} active={current} iconOnly name={name} />
          </NavItemWrapper>
        </MenuButton>

        <MenuItems
          anchor={"right start"}
          portal
          className="absolute left-0 top-0 z-10 ml-1 w-48 space-y-1 border border-blue-400/30 bg-[#1e3a5f] shadow-md"
        >
          {submenu.map(({ name, icon, href, featureName, resourceName }) => {
            return !isFeatureDisabled(
              featureName as unknown as keyof typeof features
            )
              ? withAuthorizationAccessCheck(
                  <MenuItem key={href}>
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
                  </MenuItem>,
                  resourceName,
                  "read"
                )
              : null;
          })}
        </MenuItems>
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
                    submenu && open ? "" : "rotate-180 transform"
                  } h-5 w-5`}
                />
              </div>
            </NavItemWrapper>
          </Disclosure.Button>
          <Disclosure.Panel className="-mx-3 mt-1 flex flex-col gap-1 bg-[#0f1f2e] px-3 py-2">
            {submenu.map((item) =>
              !isFeatureDisabled(
                item.featureName as unknown as keyof typeof features
              )
                ? withAuthorizationAccessCheck(
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
  const { isViewer } = useContext(UserAccessStateContext);

  return (
    <nav className="flex flex-col divide-y divide-blue-400/30">
      <div className="mb-1 flex flex-col gap-1">
        {navs.map((item) =>
          !isFeatureDisabled(
            item.featureName as unknown as keyof typeof features
          )
            ? withAuthorizationAccessCheck(
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
      {/* For view, we hide settings menu */}
      {!isViewer
        ? withAuthorizationAccessCheck(
            <div>
              <SideNavGroup
                key={"settings"}
                {...settings}
                collapseSidebar={collapseSidebar}
                checkPath={checkPath}
              />
            </div>,
            settings.submenu.map((item) => item.resourceName),
            "read"
          )
        : null}
    </nav>
  );
}

export const isSidebarCollapsedAtom = atomWithStorage<boolean>(
  "sidebarCollapsed",
  false
);

export function SidebarLayout({ navigation, settingsNav, checkPath }: Props) {
  const { user } = useContext(AuthContext);
  const [collapseSidebar, setCollapseSidebar] = useAtom(isSidebarCollapsedAtom);

  const closeOnOuterClick = useCallback(() => {
    if (!collapseSidebar && window.innerWidth < 1024) {
      setCollapseSidebar(true);
    }
  }, [collapseSidebar, setCollapseSidebar]);

  const innerRef = useOuterClick(closeOnOuterClick);

  // [TODO] user comes context, probably show an error here instead of a loading
  // animation
  if (user == null) {
    return <FullPageSkeletonLoader />;
  }

  return (
    <div className="flex h-screen min-w-[800px] flex-row">
      <div
        className={clsx(
          "z-10 flex transform flex-col bg-[#1e3a5f] duration-500",
          {
            "w-56": !collapseSidebar,
            "w-14": collapseSidebar
          }
        )}
        ref={innerRef}
      >
        <div
          className={clsx("flex h-full transform flex-col duration-500", {
            "w-56": !collapseSidebar,
            "w-14": collapseSidebar
          })}
        >
          <button
            type="button"
            className={clsx(
              "absolute -right-6 top-20 m-2 transform rounded-full border border-gray-300 bg-white p-1 duration-500 hover:bg-gray-200",
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
              <div className="flex h-16 border-b border-b-blue-400/30 shadow">
                <MissionControlWhite className="h-auto w-auto" size="auto" />
              </div>
            ) : (
              <div className="border-b border-b-blue-400/30 p-3 pl-5 shadow">
                <MissionControlLogoWhite
                  className="h-auto w-auto"
                  size="auto"
                />
              </div>
            )}
          </Link>

          <div
            className={clsx(
              "flex flex-1 flex-col overflow-y-auto",
              collapseSidebar ? "px-1" : "px-3"
            )}
          >
            <div className="mt-5 flex flex-grow flex-col">
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
      <div className="flex h-screen flex-1 flex-col overflow-auto bg-gray-50">
        <React.Suspense fallback={<FullPageSkeletonLoader />}>
          <Outlet />
        </React.Suspense>
      </div>
    </div>
  );
}
