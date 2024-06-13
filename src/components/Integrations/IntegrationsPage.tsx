import { getIntegrationsWithJobStatus } from "@flanksource-ui/api/schemaResources";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BreadcrumbNav, BreadcrumbRoot } from "../../ui/BreadcrumbNav";
import { Head } from "../../ui/Head";
import { SearchLayout } from "../../ui/Layout/SearchLayout";
import AddIntegrationModal from "./Add/AddIntegrationModal";
import IntegrationsList from "./IntegrationsList";

export default function IntegrationsPage() {
  const navigate = useNavigate();

  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 150
  });

  const { data, refetch, isLoading, isRefetching } = useQuery({
    queryKey: ["integrations", { pageIndex, pageSize }],
    queryFn: () => {
      return getIntegrationsWithJobStatus(pageIndex, pageSize);
    },
    // disable cache
    staleTime: 0,
    cacheTime: 0
  });

  const integrations = data?.data ?? [];
  const totalEntries = data?.totalEntries;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  return (
    <>
      <Head prefix="Integrations" />
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
              <AddIntegrationModal key="add-integration" refresh={refetch} />
            ]}
          />
        }
        onRefresh={refetch}
        contentClass="p-0 h-full"
        loading={isLoading || isRefetching}
      >
        <div className="flex flex-col flex-1 p-6 pb-0 h-full w-full">
          <div className="mx-auto flex flex-col">
            <IntegrationsList
              data={integrations ?? []}
              onRowClick={(row) => {
                navigate(
                  `/settings/integrations/${row.integration_type}/${row.id}`
                );
              }}
              isLoading={isLoading || isRefetching}
              pageCount={pageCount}
              pageIndex={pageIndex}
              pageSize={pageSize}
              setPageState={setPageState}
            />
          </div>
        </div>
      </SearchLayout>
    </>
  );
}
