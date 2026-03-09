import { UserAccessStateContext } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import { MissionControlLogo, MissionControl } from "@flanksource/icons/mi";
import { ChevronRight, ChevronUp } from "lucide-react";
import React, { useContext } from "react";
import { IconType } from "react-icons";
import { useLocation, UNSAFE_NavigationContext } from "react-router-dom";
import { NavigationItems, SettingsNavigationItems } from "../../App";
import { withAuthorizationAccessCheck } from "../Permissions/AuthorizationAccessCheck";
import { useFeatureFlagsContext } from "../../context/FeatureFlagsContext";
import { features } from "../../services/permissions/features";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar
} from "@flanksource-ui/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@flanksource-ui/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@flanksource-ui/components/ui/dropdown-menu";
import clsx from "clsx";

interface AppSidebarProps {
  navigation: NavigationItems;
  settingsNav: SettingsNavigationItems;
  checkPath: boolean;
}

/**
 * A lightweight link component that does NOT subscribe to LocationContext.
 *
 * React Router's `Link` (and `NavLink`) internally call `useLocation()` via
 * `useHref` / `useResolvedPath` / `useLinkClickHandler`, which means every
 * instance re-renders on ANY URL change (including search param changes).
 *
 * This component reads only from `NavigationContext` (which is `useMemo`'d in
 * the Router and never changes after mount) to get the `navigator` for
 * programmatic navigation.  The result: zero re-renders on URL changes.
 */
const SidebarLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }
>(function SidebarLink({ to, onClick, children, ...rest }, ref) {
  const { navigator } = useContext(UNSAFE_NavigationContext);

  return (
    <a
      ref={ref}
      href={to}
      onClick={(e) => {
        onClick?.(e);
        if (
          !e.defaultPrevented &&
          e.button === 0 &&
          !e.metaKey &&
          !e.ctrlKey &&
          !e.shiftKey &&
          !e.altKey
        ) {
          e.preventDefault();
          navigator.push(to);
        }
      }}
      {...rest}
    >
      {children}
    </a>
  );
});

const NavItem = React.memo(function NavItem({
  item,
  collapsed,
  pathname
}: {
  item: NavigationItems[0];
  collapsed: boolean;
  pathname: string;
}) {
  const Icon = item.icon as IconType;
  const isActive =
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={item.name} isActive={isActive}>
        <SidebarLink to={item.href}>
          <Icon className="h-5 w-5 fill-white text-white" />
          {!collapsed && (
            <span className={isActive ? "font-medium" : ""}>{item.name}</span>
          )}
        </SidebarLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
});

const SubNavItem = React.memo(function SubNavItem({
  subItem,
  pathname
}: {
  subItem: SettingsNavigationItems["submenu"][0];
  pathname: string;
}) {
  const isActive = pathname.startsWith(subItem.href);
  const SubIcon = subItem.icon as IconType;

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild isActive={isActive}>
        <SidebarLink to={subItem.href}>
          <SubIcon className="h-4 w-4 fill-white text-white" />
          <span className={isActive ? "font-medium" : ""}>{subItem.name}</span>
        </SidebarLink>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
});

const SettingsNavGroup = React.memo(function SettingsNavGroup({
  settings,
  checkPath,
  pathname
}: {
  settings: SettingsNavigationItems;
  checkPath: boolean;
  pathname: string;
}) {
  const { isFeatureDisabled } = useFeatureFlagsContext();
  const Icon = settings.icon;
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  // When sidebar is collapsed, show a dropdown menu instead of collapsible
  if (collapsed) {
    return (
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton tooltip={settings.name}>
              <Icon className="h-5 w-5 text-white" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="start"
            className="max-h-none min-w-48"
          >
            {settings.submenu.map((subItem) => {
              if (
                isFeatureDisabled(
                  subItem.featureName as unknown as keyof typeof features
                )
              ) {
                return null;
              }
              const SubIcon = subItem.icon as IconType;
              const isActive = pathname.startsWith(subItem.href);
              return (
                <React.Fragment key={subItem.href}>
                  {withAuthorizationAccessCheck(
                    <DropdownMenuItem asChild>
                      <SidebarLink
                        to={subItem.href}
                        className={clsx(
                          "flex cursor-pointer items-center gap-2",
                          isActive && "bg-primary text-white"
                        )}
                      >
                        <SubIcon className="h-4 w-4" />
                        <span>{subItem.name}</span>
                      </SidebarLink>
                    </DropdownMenuItem>,
                    subItem.resourceName,
                    "read"
                  )}
                </React.Fragment>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible defaultOpen={checkPath} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={settings.name}>
            <Icon className="h-5 w-5 text-white" />
            <span>{settings.name}</span>
            <ChevronUp className="ml-auto h-4 w-4 text-white transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {settings.submenu.map((subItem) =>
              !isFeatureDisabled(
                subItem.featureName as unknown as keyof typeof features
              ) ? (
                <React.Fragment key={subItem.href}>
                  {withAuthorizationAccessCheck(
                    <SubNavItem subItem={subItem} pathname={pathname} />,
                    subItem.resourceName,
                    "read"
                  )}
                </React.Fragment>
              ) : null
            )}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
});

interface AppSidebarInnerProps extends AppSidebarProps {
  pathname: string;
}

/**
 * The actual sidebar body, memoized so that it only re-renders when
 * `pathname` (or the other props) actually change.  Because nothing
 * inside this tree subscribes to LocationContext, search-param-only
 * URL changes are completely invisible to it.
 */
const AppSidebarInner = React.memo(function AppSidebarInner({
  navigation,
  settingsNav,
  checkPath,
  pathname
}: AppSidebarInnerProps) {
  const { isFeatureDisabled } = useFeatureFlagsContext();
  const { isViewer } = useContext(UserAccessStateContext);
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      {/* Logo Header - Uses sidebar background color, h-12 matches top bar height */}
      <SidebarHeader className="bg-gray-700 p-0">
        <div className="flex h-12 items-center justify-between">
          {collapsed ? (
            <button
              onClick={toggleSidebar}
              className="flex h-12 w-full items-center justify-center gap-1"
            >
              <MissionControl
                className="h-4 w-6 fill-white text-white [&_*]:fill-white"
                size="auto"
              />
              <ChevronRight className="h-3 w-3 text-white" />
            </button>
          ) : (
            <SidebarLink to="/" className="block flex-1">
              <div className="py-2 pl-4">
                <MissionControlLogo
                  className="h-7 w-auto fill-white text-white [&_*]:fill-white"
                  size="auto"
                />
              </div>
            </SidebarLink>
          )}
          {!collapsed && (
            <SidebarTrigger className="mr-2 text-white hover:bg-gray-600 hover:text-white" />
          )}
        </div>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) =>
                !isFeatureDisabled(
                  item.featureName as unknown as keyof typeof features
                ) ? (
                  <React.Fragment key={item.href}>
                    {withAuthorizationAccessCheck(
                      <NavItem
                        item={item}
                        collapsed={collapsed}
                        pathname={pathname}
                      />,
                      item.resourceName,
                      "read"
                    )}
                  </React.Fragment>
                ) : null
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Settings Section */}
        {!isViewer &&
          withAuthorizationAccessCheck(
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SettingsNavGroup
                    settings={settingsNav}
                    checkPath={checkPath}
                    pathname={pathname}
                  />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>,
            settingsNav.submenu.map((item) => item.resourceName),
            "read"
          )}
      </SidebarContent>
    </Sidebar>
  );
});

/**
 * Thin wrapper that reads `useLocation()` and passes only `pathname`
 * to the memoized inner sidebar.  When only search params change,
 * `pathname` stays the same → memo bails out → nothing re-renders.
 */
export function AppSidebar({
  navigation,
  settingsNav,
  checkPath
}: AppSidebarProps) {
  const { pathname } = useLocation();

  return (
    <AppSidebarInner
      navigation={navigation}
      settingsNav={settingsNav}
      checkPath={checkPath}
      pathname={pathname}
    />
  );
}
