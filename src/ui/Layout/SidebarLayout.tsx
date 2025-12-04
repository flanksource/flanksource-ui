import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { NavigationItems, SettingsNavigationItems } from "../../App";
import { AuthContext } from "../../context";
import FullPageSkeletonLoader from "../SkeletonLoader/FullPageSkeletonLoader";
import {
  SidebarInset,
  SidebarProvider
} from "@flanksource-ui/components/ui/sidebar";
import { AppSidebar } from "@flanksource-ui/components/Layout/AppSidebar";

interface Props {
  navigation: NavigationItems;
  settingsNav: SettingsNavigationItems;
  checkPath: boolean;
}

export function SidebarLayout({ navigation, settingsNav, checkPath }: Props) {
  const { user } = useContext(AuthContext);

  // Show loading state while user is being fetched
  if (user == null) {
    return <FullPageSkeletonLoader />;
  }

  return (
    <SidebarProvider>
      <AppSidebar
        navigation={navigation}
        settingsNav={settingsNav}
        checkPath={checkPath}
      />
      <SidebarInset className="bg-gray-50">
        <div className="flex-1 overflow-auto">
          <React.Suspense fallback={<FullPageSkeletonLoader />}>
            <Outlet />
          </React.Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
