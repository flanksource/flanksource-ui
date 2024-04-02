import { useNavigate, useParams } from "react-router-dom";
import { useSettingsUpdateResource } from "../../api/query-hooks/mutations/useSettingsResourcesMutations";
import { useGetSettingsResourceDetails } from "../../api/query-hooks/settingsResourcesHooks";
import { BreadcrumbNav } from "../BreadcrumbNav";
import EmptyState from "../EmptyState";
import ErrorPage from "../Errors/ErrorPage";
import { Head } from "../Head/Head";
import { SearchLayout } from "../Layout";
import TableSkeletonLoader from "../SkeletonLoader/TableSkeletonLoader";
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
        <div className="flex flex-col flex-1 overflow-y-auto mx-auto w-screen max-w-screen-xl p-4">
          {!resource && isLoading && <TableSkeletonLoader />}
          {error && <ErrorPage error={error} />}
          {resource && !isLoading && (
            <SchemaResourceEdit
              id={id}
              {...resource}
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
