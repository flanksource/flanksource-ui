import { useNavigate, useParams } from "react-router-dom";
import { useSettingsUpdateResource } from "../../api/query-hooks/mutations/useSettingsResourcesMutations";
import { useGetSettingsResourceDetails } from "../../api/query-hooks/settingsResourcesHooks";
import { BreadcrumbNav } from "../../ui/BreadcrumbNav";
import { Head } from "../../ui/Head";
import { SearchLayout } from "../../ui/Layout/SearchLayout";
import TableSkeletonLoader from "../../ui/SkeletonLoader/TableSkeletonLoader";
import EmptyState from "../EmptyState";
import ErrorPage from "../Errors/ErrorPage";
import { SchemaResourceEdit } from "./SchemaResourceEdit";
import { SchemaResourceType } from "./resourceTypes";

export function SchemaResource({
  resourceInfo
}: {
  resourceInfo: SchemaResourceType;
}) {
  const navigate = useNavigate();

  const { name } = resourceInfo;
  const { id } = useParams();

  const {
    data: resource,
    isLoading,
    error
  } = useGetSettingsResourceDetails(resourceInfo, id);

  const { mutateAsync: updateResource } = useSettingsUpdateResource(
    resourceInfo,
    resource,
    {
      onSuccess: () => {
        navigate(`/settings/${resourceInfo.table}`);
      }
    }
  );

  return (
    <>
      <Head
        prefix={`${name} ${resource?.name ? ` - ${resource.name}` : ""} `}
      />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              { title: name, to: `/settings/${resourceInfo.table}` },
              resource?.name
            ]}
          />
        }
        contentClass="flex flex-col h-full"
      >
        <div className="mx-auto flex w-screen max-w-screen-xl flex-1 flex-col overflow-y-auto p-4">
          {!resource && isLoading && <TableSkeletonLoader />}
          {error && <ErrorPage error={error} />}
          {resource && !isLoading && (
            <SchemaResourceEdit
              id={id}
              {...resource}
              onCancel={() => navigate(`/settings/${resourceInfo.table}`)}
              onSubmit={updateResource}
              resourceInfo={resourceInfo}
            />
          )}
          {!resource && !isLoading && !error && (
            <div className="flex w-full flex-1 items-center justify-center text-gray-500">
              <EmptyState title="No resources found" />
            </div>
          )}
        </div>
      </SearchLayout>
    </>
  );
}
