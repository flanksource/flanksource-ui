import { getAll } from "@flanksource-ui/api/schemaResources";
import ConfigPageTabs from "@flanksource-ui/components/Configs/ConfigPageTabs";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import AddSchemaResourceModal from "@flanksource-ui/components/SchemaResourcePage/AddSchemaResourceModal";
import {
  SchemaResourceType,
  schemaResourceTypes
} from "@flanksource-ui/components/SchemaResourcePage/resourceTypes";
import ResourceTable from "@flanksource-ui/components/Settings/ResourceTable";
import {
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import useReactTableSortState from "@flanksource-ui/ui/DataTable/Hooks/useReactTableSortState";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const catalogScraperResourceInfo = schemaResourceTypes.find(
  (resource) => resource.table === "config_scrapers"
) as SchemaResourceType;

export default function ConfigScrapersPage() {
  const navigate = useNavigate();

  const [sortState] = useReactTableSortState();

  const { data, refetch, isLoading, isRefetching } = useQuery({
    queryKey: ["catalog", "catalog_scrapper", sortState],
    queryFn: () => {
      return getAll(catalogScraperResourceInfo, sortState);
    },
    // disable cache
    staleTime: 0,
    cacheTime: 0
  });

  const integrations = data?.data ?? [];

  const onRowClick = (row: any) => {
    navigate(`/catalog/scrapers/${row.id}`);
  };

  return (
    <>
      <Head prefix={`Catalog Settings`} />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot link="/catalog" key={"/catalog"}>
                Catalog
              </BreadcrumbRoot>,
              <BreadcrumbRoot
                link="/catalog/scrapers"
                key={"/catalog/scrapers"}
              >
                Scrapers
              </BreadcrumbRoot>,
              <AuthorizationAccessCheck
                resource={catalogScraperResourceInfo.table}
                action="write"
                key="add-button"
              >
                <AddSchemaResourceModal
                  key={"add-resource"}
                  onClose={() => refetch()}
                  resourceInfo={catalogScraperResourceInfo!}
                />
              </AuthorizationAccessCheck>
            ]}
          />
        }
        onRefresh={() => refetch()}
        loading={isLoading || isRefetching}
        contentClass="p-0 h-full"
      >
        <ConfigPageTabs activeTab="Scrapers">
          <div className="flex h-full flex-col overflow-y-hidden">
            <ResourceTable
              data={integrations}
              table={"config_scrapers"}
              onRowClick={onRowClick}
              isLoading={isLoading}
              enableServerSidePagination
            />
          </div>
        </ConfigPageTabs>
      </SearchLayout>
    </>
  );
}
