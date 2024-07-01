import { useGetSettingsAllQuery } from "../../api/query-hooks/settingsResourcesHooks";
import { BreadcrumbNav, BreadcrumbRoot } from "../../ui/BreadcrumbNav";
import { Head } from "../../ui/Head";
import { SearchLayout } from "../../ui/Layout/SearchLayout";
import ErrorPage from "../Errors/ErrorPage";
import { AuthorizationAccessCheck } from "../Permissions/AuthorizationAccessCheck";
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
      <Head prefix={resourceInfo ? `${resourceInfo.name}` : "Settings"} />
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
              <AuthorizationAccessCheck
                resource={resourceInfo.table}
                action="write"
                key="add-button"
              >
                <AddSchemaResourceModal
                  key={"add-resource"}
                  onClose={() => refetch()}
                  resourceInfo={resourceInfo!}
                />
              </AuthorizationAccessCheck>
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
