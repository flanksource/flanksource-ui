import { UserAccessStateContext } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import {
  MissionControlLogoWhite,
  MissionControlWhite
} from "@flanksource/icons/mi";
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
                : "fill-gray-900 text-gray-900 group-hover/menu-item:fill-white group-hover/menu-item:text-white"
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

  return (
    <Collapsible defaultOpen={checkPath} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={settings.name}>
            <Icon className="h-5 w-5" />
            {!collapsed && <span>{settings.name}</span>}
            {!collapsed && (
              <ChevronUp className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
            )}
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
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      {/* Logo Header - Uses --primary color */}
      <SidebarHeader className="border-b border-sidebar-border bg-primary p-0">
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="block flex-1">
            {collapsed ? (
              <div className="flex h-14 items-center justify-center">
                <MissionControlWhite className="h-8 w-8" size="auto" />
              </div>
            ) : (
              <div className="p-3 pl-4">
                <MissionControlLogoWhite
                  className="h-auto w-auto"
                  size="auto"
                />
              </div>
            )}
          </Link>
          {!collapsed && (
            <SidebarTrigger className="mr-2 text-white hover:bg-primary/80 hover:text-white" />
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
