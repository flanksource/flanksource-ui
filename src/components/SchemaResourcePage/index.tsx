import { useGetSettingsAllQuery } from "../../api/query-hooks/settingsResourcesHooks";
import { BreadcrumbNav, BreadcrumbRoot } from "../BreadcrumbNav";
import ErrorPage from "../Errors/ErrorPage";
import { Head } from "../Head/Head";
import { SearchLayout } from "../Layout";
import AddSchemaResourceModal from "./AddSchemaResourceModal";
import { SchemaResourceList } from "./SchemaResourceList";
import { SchemaResourceType } from "./resourceTypes";

export function SchemaResourcePage({
  resourceInfo
}: {
  resourceInfo: SchemaResourceType & { href: string };
}) {
  const { name, href } = resourceInfo;

  const {
    data: list,
    refetch,
    isLoading,
    error
  } = useGetSettingsAllQuery(resourceInfo);

  return (
    <>
      <Head prefix={resourceInfo ? `Settings - ${resourceInfo.name}` : ""} />
      <SearchLayout
        loading={isLoading}
        onRefresh={refetch}
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot
                key="root"
                link={`/settings/${resourceInfo.table}`}
              >
                {name}
              </BreadcrumbRoot>,
              <AddSchemaResourceModal
                key={"add-resource"}
                onClose={() => refetch()}
                resourceInfo={resourceInfo!}
              />
            ]}
          />
        }
        contentClass="flex flex-col h-full p-6"
      >
        <div className="flex flex-col flex-1 w-full overflow-y-auto">
          <SchemaResourceList
            items={list || []}
            baseUrl={href}
            table={resourceInfo.table}
            isLoading={isLoading}
          />
          {Boolean(error) && <ErrorPage error={error as Error} />}
        </div>
      </SearchLayout>
    </>
  );
}
