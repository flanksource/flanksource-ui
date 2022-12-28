import React from "react";
import { useMatch } from "react-router-dom";
import ConfigSidebar from "../ConfigSidebar";
import ConfigsListFilterControls from "../ConfigsListFilters";
import { SearchLayout } from "../Layout/search";
import { ConfigsPageTabs } from "./ConfigsPageTabs";

type Props = {
  basePath: string;
  title: React.ReactNode;
  isConfigDetails?: boolean;
  children?: React.ReactNode;
  refresh?: () => void;
  isLoading?: boolean;
  tabRight?: React.ReactNode;
};

export function ConfigLayout({
  basePath,
  isConfigDetails = false,
  children,
  title,
  refresh = () => {},
  isLoading = false,
  tabRight
}: Props) {
  const isConfigListRoute = !!useMatch("/configs");

  return (
    <SearchLayout
      title={
        <div className="flex space-x-2">
          <span className="text-lg">{title}</span>
        </div>
      }
      onRefresh={refresh}
      loading={isLoading}
      contentClass="p-0 h-full"
    >
      <div
        className={`flex flex-row ${
          isConfigDetails ? "min-h-full h-auto" : "h-full"
        } `}
      >
        <div
          className={`flex flex-col flex-1 p-6 pb-0 h-full ${
            isConfigDetails ? "min-h-full h-auto overflow-auto" : "h-full"
          }`}
        >
          {isConfigListRoute && (
            <div className="flex flex-row items-center pb-6">
              <ConfigsListFilterControls />
            </div>
          )}
          <ConfigsPageTabs basePath={basePath} tabRight={tabRight} />
          {/* <ConfigBreadcrumb setTitle={setTitle} /> */}
          {children}
        </div>
        {isConfigDetails && <ConfigSidebar />}
      </div>
    </SearchLayout>
  );
}
