import { UserAccessStateContext } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import { MissionControlLogo, MissionControl } from "@flanksource/icons/mi";
import { ChevronRight, ChevronUp } from "lucide-react";
import React, { useContext } from "react";
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
          <Icon className="h-5 w-5 fill-white text-white" />
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
          <SubIcon className="h-4 w-4 fill-white text-white" />
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
              const isActive = location.pathname.startsWith(subItem.href);
              return (
                <React.Fragment key={subItem.href}>
                  {withAuthorizationAccessCheck(
                    <DropdownMenuItem asChild>
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
                    <SubNavItem subItem={subItem} />,
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
      <SidebarHeader className="bg-gray-700 p-0">
        <div className="flex h-12 items-center justify-between">
          {collapsed ? (
            <button
              onClick={toggleSidebar}
              className="flex h-12 w-full items-center justify-center gap-1"
            >
              <MissionControl
                className="h-4 w-6 fill-white text-white"
                size="auto"
              />
              <ChevronRight className="h-3 w-3 text-white" />
            </button>
          ) : (
            <Link to="/" className="block flex-1">
              <div className="py-2 pl-4">
                <MissionControlLogo
                  className="h-7 w-auto fill-white text-white [&_*]:fill-white"
                  size="auto"
                />
              </div>
            </Link>
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
                      <NavItem item={item} collapsed={collapsed} />,
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
