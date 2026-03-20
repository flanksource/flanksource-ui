import TabbedLinks from "@flanksource-ui/ui/Tabs/TabbedLinks";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

type ConfigPageTabsProps = {
  activeTab: string;
  children: React.ReactNode;
  configType?: string;
};

export default function ConfigPageTabs({
  activeTab,
  children,
  configType
}: ConfigPageTabsProps) {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("configType") ?? configType;
  const configTabsLists = useMemo(() => {
    const query = type ? `?configType=${type}` : "";
    return [
      {
        label: "Catalog",
        key: "Catalog",
        path: `/catalog`,
        search: `${query}`
      },
      {
        label: "Changes",
        key: "Changes",
        path: `/catalog/changes`,
        search: `${query}`
      },
      {
        label: "Insights",
        key: "Insights",
        path: `/catalog/insights`,
        search: `${query}`
      },
      {
        label: "Scrapers",
        key: "Scrapers",
        path: `/catalog/scrapers`
      },
      {
        label: "Plugins",
        key: "Plugins",
        path: `/catalog/plugins`
      }
    ];
  }, [type]);

  return (
    <TabbedLinks
      tabLinks={configTabsLists}
      activeTabName={activeTab}
      contentClassName="bg-white border border-t-0 border-gray-300 flex-1 min-h-0 overflow-auto p-0"
    >
      <div className={`flex h-full flex-1 flex-col`}>{children}</div>
    </TabbedLinks>
  );
}
