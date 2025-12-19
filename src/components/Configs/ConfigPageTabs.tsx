import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@flanksource-ui/components/ui/tabs";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
  const navigate = useNavigate();
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
        path: `/catalog/scrapers`,
        search: ""
      }
    ];
  }, [type]);

  const handleTabChange = (value: string) => {
    const tab = configTabsLists.find((t) => t.key === value);
    if (tab) {
      navigate(`${tab.path}${tab.search}`);
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col px-4 py-6">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex h-full flex-col"
      >
        <TabsList className="w-fit">
          {configTabsLists.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent
          value={activeTab}
          className="mt-4 flex h-full flex-1 flex-col gap-4"
        >
          {children}
        </TabsContent>
      </Tabs>
    </div>
  );
}
