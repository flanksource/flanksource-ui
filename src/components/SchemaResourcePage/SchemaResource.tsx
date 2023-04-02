import { useParams } from "react-router-dom";
import { BreadcrumbNav } from "../BreadcrumbNav";
import { SearchLayout } from "../Layout";
import { SchemaResourceType } from "./resourceTypes";
import { SchemaResourceEdit } from "./SchemaResourceEdit";
import { useGetSettingsResourceDetails } from "../../api/query-hooks/settingsResourcesHooks";
import { Head } from "../Head/Head";
import {
  useSettingsDeleteResource,
  useSettingsUpdateResource
} from "../../api/query-hooks/mutations/useSettingsResourcesMutations";

export function SchemaResource({
  resourceInfo
}: {
  resourceInfo: SchemaResourceType;
}) {
  const { name } = resourceInfo;
  const { id } = useParams();

  const { data: resource, isLoading } = useGetSettingsResourceDetails(
    resourceInfo,
    id
  );

  const { mutateAsync: deleteResourceItem } =
    useSettingsDeleteResource(resourceInfo);

  const { mutateAsync: updateResource } = useSettingsUpdateResource(
    resourceInfo,
    resource
  );

  return (
    <>
      <Head
        prefix={`Settings - ${name} ${
          resource?.name ? ` - ${resource.name}` : ""
        } `}
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
          {resource && !isLoading && (
            <SchemaResourceEdit
              id={id}
              resourceName={resourceInfo.name}
              {...resource}
              onSubmit={updateResource}
              onDelete={deleteResourceItem}
            />
          )}
        </div>
      </SearchLayout>
    </>
  );
}
