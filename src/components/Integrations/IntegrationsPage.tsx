import { getIntegrationsWithJobStatus } from "@flanksource-ui/api/schemaResources";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { BreadcrumbNav, BreadcrumbRoot } from "../../ui/BreadcrumbNav";
import { Head } from "../../ui/Head";
import { SearchLayout } from "../../ui/Layout/SearchLayout";
import { AuthorizationAccessCheck } from "../Permissions/AuthorizationAccessCheck";
import AddIntegrationModal from "./Add/AddIntegrationModal";
import IntegrationsList from "./IntegrationsList";

export default function IntegrationsPage() {
  const navigate = useNavigate();

  const { pageIndex, pageSize } = useReactTablePaginationState();

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
              <AuthorizationAccessCheck
                key="add-integration"
                resource={tables.integrations}
                action="write"
              >
                <AddIntegrationModal key="add-integration" refresh={refetch} />
              </AuthorizationAccessCheck>
            ]}
          />
        }
        onRefresh={refetch}
        contentClass="p-0 h-full"
        loading={isLoading || isRefetching}
      >
        <div className="flex h-full w-full flex-1 flex-col p-6 pb-0">
          <div className="mx-auto flex w-full flex-1 flex-col">
            <IntegrationsList
              data={integrations ?? []}
              onRowClick={(row) => {
                navigate(
                  `/settings/integrations/${row.integration_type}/${row.id}`
                );
              }}
              isLoading={isLoading}
              pageCount={pageCount}
            />
          </div>
        </div>
      </SearchLayout>
    </>
  );
}
