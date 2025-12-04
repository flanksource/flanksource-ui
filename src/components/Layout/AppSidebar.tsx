import { UserAccessStateContext } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import { MissionControlLogo, MissionControl } from "@flanksource/icons/mi";
import { ChevronUp } from "lucide-react";
import { useContext } from "react";
import { IconType } from "react-icons";
import { NavLink, Link, useLocation } from "react-router-dom";
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

function NavItem({
  item,
  collapsed
}: {
  item: NavigationItems[0];
  collapsed: boolean;
}) {
  const Icon = item.icon as IconType;
  const location = useLocation();
  const isActive = location.pathname.startsWith(item.href);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={item.name} isActive={isActive}>
        <NavLink to={item.href}>
          <Icon
            className={clsx(
              "h-5 w-5 transition-colors",
              isActive
                ? "fill-white text-white"
                : "fill-gray-900 text-gray-900 group-hover/menu-item:fill-white group-hover/menu-item:text-white"
            )}
          />
          {!collapsed && (
            <span className={isActive ? "font-medium" : ""}>{item.name}</span>
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function SubNavItem({
  subItem
}: {
  subItem: SettingsNavigationItems["submenu"][0];
}) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(subItem.href);
  const SubIcon = subItem.icon as IconType;

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild isActive={isActive}>
        <NavLink to={subItem.href}>
          <SubIcon
            className={clsx(
              "h-4 w-4 transition-colors",
              isActive
                ? "fill-white text-white"
                : "fill-gray-900 text-gray-900 group-hover/menu-subitem:fill-white group-hover/menu-subitem:text-white"
            )}
          />
          <span className={isActive ? "font-medium" : ""}>{subItem.name}</span>
        </NavLink>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

function SettingsNavGroup({
  settings,
  checkPath
}: {
  settings: SettingsNavigationItems;
  checkPath: boolean;
}) {
  const { isFeatureDisabled } = useFeatureFlagsContext();
  const Icon = settings.icon;
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  // When sidebar is collapsed, show a dropdown menu instead of collapsible
  if (collapsed) {
    return (
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton tooltip={settings.name}>
              <Icon className="h-5 w-5" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="min-w-48">
            {settings.submenu.map((subItem) => {
              if (
                isFeatureDisabled(
                  subItem.featureName as unknown as keyof typeof features
                )
              ) {
                return null;
              }
              const SubIcon = subItem.icon as IconType;
              const isActive = location.pathname.startsWith(subItem.href);
              return withAuthorizationAccessCheck(
                <DropdownMenuItem key={subItem.href} asChild>
                  <NavLink
                    to={subItem.href}
                    className={clsx(
                      "flex cursor-pointer items-center gap-2",
                      isActive && "bg-primary text-white"
                    )}
                  >
                    <SubIcon className="h-4 w-4" />
                    <span>{subItem.name}</span>
                  </NavLink>
                </DropdownMenuItem>,
                subItem.resourceName,
                "read"
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
            <Icon className="h-5 w-5" />
            <span>{settings.name}</span>
            <ChevronUp className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {settings.submenu.map((subItem) =>
              !isFeatureDisabled(
                subItem.featureName as unknown as keyof typeof features
              )
                ? withAuthorizationAccessCheck(
                    <SubNavItem key={subItem.href} subItem={subItem} />,
                    subItem.resourceName,
                    "read"
                  )
                : null
            )}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function AppSidebar({
  navigation,
  settingsNav,
  checkPath
}: AppSidebarProps) {
  const { isFeatureDisabled } = useFeatureFlagsContext();
  const { isViewer } = useContext(UserAccessStateContext);
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      {/* Logo Header - Uses sidebar background color, h-12 matches top bar height */}
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar p-0">
        <div className="flex h-12 items-center justify-between">
          {collapsed ? (
            <button
              onClick={toggleSidebar}
              className="flex h-12 w-full items-center justify-center"
            >
              <MissionControl
                className="h-4 w-6 fill-primary text-primary"
                size="auto"
              />
            </button>
          ) : (
            <Link to="/" className="block flex-1">
              <div className="py-2 pl-4">
                <MissionControlLogo
                  className="h-7 w-auto fill-primary text-primary"
                  size="auto"
                />
              </div>
            </Link>
          )}
          {!collapsed && (
            <SidebarTrigger className="mr-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900" />
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
                )
                  ? withAuthorizationAccessCheck(
                      <NavItem
                        key={item.name}
                        item={item}
                        collapsed={collapsed}
                      />,
                      item.resourceName,
                      "read"
                    )
                  : null
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
}
