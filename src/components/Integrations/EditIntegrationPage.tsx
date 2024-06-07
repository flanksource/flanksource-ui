import { useSettingsUpdateResource } from "@flanksource-ui/api/query-hooks/mutations/useSettingsResourcesMutations";
import { getResource } from "@flanksource-ui/api/schemaResources";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "../../ui/BreadcrumbNav";
import { Head } from "../../ui/Head";
import { SearchLayout } from "../../ui/Layout/SearchLayout";
import { Loading } from "../../ui/Loading";
import { Tab, Tabs } from "../../ui/Tabs/Tabs";
import LogBackendsForm from "../Logs/LogBackends/LogBackendsForm";
import { SchemaResourceJobsTab } from "../SchemaResourcePage/SchemaResourceEditJobsTab";
import { SchemaApi } from "../SchemaResourcePage/resourceTypes";
import ConfigScrapperSpecEditor from "../SpecEditor/ConfigScrapperSpecEditor";
import EditTopologyResource from "./Topology/EditTopologyResource";

type IntegrationType = "logging_backends" | "topologies" | "scrapers";

type IntegrationPagePathParams = {
  type: IntegrationType;
  id: string;
};

const integrationTypeToTableMap: Record<IntegrationType, SchemaApi["table"]> = {
  logging_backends: "logging_backends",
  topologies: "topologies",
  scrapers: "config_scrapers"
} as const;

export default function EditIntegrationPage() {
  const navigate = useNavigate();

  const { type, id } = useParams<IntegrationPagePathParams>();

  const table = integrationTypeToTableMap[type!];

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["integration", table, type, id],
    queryFn: () =>
      getResource(
        {
          table,
          api: "incident-commander"
        },
        id!
      ),
    enabled: !!id,
    // disable cache
    cacheTime: 0,
    staleTime: 0
  });

  const resource = data?.data?.[0];

  const { mutateAsync: updateCatalogScrapper } = useSettingsUpdateResource(
    {
      table,
      api: "incident-commander",
      name: "Catalog Scraper"
    },
    resource,
    {
      onSuccess: () => {
        navigate(`/settings/integrations`);
      }
    }
  );

  const [activeTab, setActiveTab] = useState<"Edit Form" | "Job History">(
    "Edit Form"
  );

  return (
    <>
      <Head
        prefix={`Settings - Integrations ${
          resource?.name ? ` - ${resource.name}` : ""
        }`}
      />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot
                key={"integrations-settings"}
                link="/settings/integrations"
              >
                Integrations
              </BreadcrumbRoot>,
              <BreadcrumbChild key={resource?.name}>
                {resource?.name}
              </BreadcrumbChild>
            ]}
          />
        }
        onRefresh={refetch}
        contentClass="flex flex-col p-0 h-full"
        loading={isLoading || isRefetching}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="flex flex-col flex-1 overflow-y-auto mx-auto w-screen max-w-screen-xl p-4">
            <Tabs
              activeTab={activeTab}
              onSelectTab={(tab) => setActiveTab(tab as any)}
            >
              <Tab
                className="flex flex-col flex-1 overflow-y-auto"
                label={"Spec"}
                value={"Edit Form"}
              >
                {isLoading ? (
                  <div className="flex flex-col flex-1 items-center justify-center">
                    <Loading />
                  </div>
                ) : (
                  <div className="flex flex-col flex-1 overflow-y-auto">
                    {type === "logging_backends" ? (
                      <LogBackendsForm />
                    ) : type === "topologies" ? (
                      <div className="flex-col flex flex-1 overflow-y-auto">
                        <EditTopologyResource
                          onSuccess={() => {}}
                          topologyResource={resource!}
                        />
                      </div>
                    ) : type === "scrapers" ? (
                      <ConfigScrapperSpecEditor
                        onSubmit={(val) => {
                          updateCatalogScrapper(val);
                        }}
                        resourceValue={resource!}
                        onDeleted={() => {
                          navigate(`/settings/integrations`);
                        }}
                      />
                    ) : (
                      <div>Unknown type</div>
                    )}
                  </div>
                )}
              </Tab>
              <Tab
                className="flex flex-col flex-1 overflow-y-auto"
                label={"Job History"}
                value={"Job History"}
              >
                <SchemaResourceJobsTab
                  resourceId={id!}
                  tableName={table as any}
                />
              </Tab>
            </Tabs>
          </div>
        </div>
      </SearchLayout>
    </>
  );
}
