import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import TabbedLinks from "../../ui/Tabs/TabbedLinks";

type ConfigPageTabsProps = {
  activeTab: string;
  children: React.ReactNode;
};

export default function ConfigPageTabs({
  activeTab,
  children
}: ConfigPageTabsProps) {
  const [searchParams] = useSearchParams();

  const type = searchParams.get("configType") ?? undefined;

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
      }
    ];
  }, [type]);

  return (
    <div className={`flex h-full flex-row`}>
      <TabbedLinks tabLinks={configTabsLists} activeTabName={activeTab}>
        <div className={`flex h-full flex-1 flex-col gap-4`}>{children}</div>
      </TabbedLinks>
    </div>
  );
}
