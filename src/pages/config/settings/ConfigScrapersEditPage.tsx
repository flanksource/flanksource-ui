import { useSettingsUpdateResource } from "@flanksource-ui/api/query-hooks/mutations/useSettingsResourcesMutations";
import { getResource } from "@flanksource-ui/api/schemaResources";
import ConfigPageTabs from "@flanksource-ui/components/Configs/ConfigPageTabs";
import { SchemaResourceJobsTab } from "@flanksource-ui/components/SchemaResourcePage/SchemaResourceEditJobsTab";
import ConfigScrapperSpecEditor from "@flanksource-ui/components/SpecEditor/ConfigScrapperSpecEditor";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import FormSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/FormSkeletonLoader";
import { Tab, Tabs } from "@flanksource-ui/ui/Tabs/Tabs";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { catalogScraperResourceInfo } from "./ConfigScrapersPage";

export default function ConfigScrapersEditPage() {
  const [activeTab, setActiveTab] = useState<"Spec" | "Job History">("Spec");

  const navigate = useNavigate();
  const { id } = useParams();

  const { data, refetch, isLoading, isRefetching } = useQuery({
    queryKey: ["config-db", "config_scrapers", id],
    queryFn: () => {
      return getResource(
        {
          api: "config-db",
          table: "config_scrapers"
        },
        id!
      );
    },
    enabled: !!id,
    // disable cache
    staleTime: 0,
    cacheTime: 0
  });

  const scrapper = data?.data?.[0];

  const { mutateAsync: updateResource } = useSettingsUpdateResource(
    catalogScraperResourceInfo,
    scrapper,
    {
      onSuccess: () => {
        navigate(`/catalog/scrapers`);
      }
    }
  );

  return (
    <>
      <Head prefix={`Catalog Settings ${data ? ` - ${scrapper?.name}` : ""}`} />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot link="/catalog" key={"/catalog"}>
                Catalog
              </BreadcrumbRoot>,
              <BreadcrumbChild
                link="/catalog/scrapers"
                key={"/catalog/scrapers"}
              >
                Scrapers
              </BreadcrumbChild>,
              scrapper && <BreadcrumbChild>{scrapper.name}</BreadcrumbChild>
            ]}
          />
        }
        onRefresh={() => refetch()}
        loading={isLoading || isRefetching}
        contentClass="p-0 h-full"
      >
        <ConfigPageTabs activeTab="Scrapers">
          <div className="flex flex-1 flex-col overflow-y-auto">
            <div className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col overflow-y-auto p-4">
              <Tabs
                activeTab={activeTab}
                onSelectTab={(value) => setActiveTab(value)}
              >
                <Tab
                  className="flex flex-1 flex-col overflow-y-auto"
                  label={"Spec"}
                  value={"Spec"}
                >
                  {isLoading || !data ? (
                    <FormSkeletonLoader />
                  ) : (
                    <ConfigScrapperSpecEditor
                      onSubmit={(val) => updateResource(val)}
                      resourceValue={scrapper}
                      onBack={() => {
                        navigate(`/catalog/scrapers`);
                      }}
                      onDeleted={() => {
                        navigate(`/catalog/scrapers`);
                      }}
                    />
                  )}
                </Tab>
                <Tab
                  className="flex flex-1 flex-col overflow-y-auto"
                  label={"Job History"}
                  value={"Job History"}
                >
                  <SchemaResourceJobsTab
                    resourceId={id!}
                    tableName={"config_scrapers"}
                  />
                </Tab>
              </Tabs>
            </div>
          </div>
        </ConfigPageTabs>
      </SearchLayout>
    </>
  );
}
