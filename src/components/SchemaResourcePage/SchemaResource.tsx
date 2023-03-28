import { useNavigate, useParams } from "react-router-dom";
import {
  deleteResource,
  SchemaResourceI,
  updateResource
} from "../../api/schemaResources";
import { BreadcrumbNav } from "../BreadcrumbNav";
import { SearchLayout } from "../Layout";
import { SchemaResourceType } from "./resourceTypes";
import { SchemaResourceEdit } from "./SchemaResourceEdit";
import { toastError } from "../Toast/toast";
import { useGetSettingsResourceDetails } from "../../api/query-hooks/settingsResourcesHooks";

export function SchemaResource({
  resourceInfo
}: {
  resourceInfo: SchemaResourceType;
}) {
  const navigate = useNavigate();
  const { name } = resourceInfo;
  const { id } = useParams();

  const { data: resource, isLoading } = useGetSettingsResourceDetails(
    resourceInfo,
    id
  );

  const onSubmit = async (props: Partial<SchemaResourceI>) => {
    try {
      await updateResource(resourceInfo, {
        ...resource,
        ...props
      });
    } catch (ex: any) {
      toastError(ex);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteResource(resourceInfo, id);
      navigate(`../${resourceInfo.table}`);
    } catch (ex: any) {
      toastError(ex);
    }
  };

  return (
    <SearchLayout
      loading={isLoading}
      title={
        <BreadcrumbNav
          list={[{ title: name, to: `/settings/${resourceInfo.table}` }, id]}
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
            onSubmit={onSubmit}
            onDelete={onDelete}
          />
        )}
      </div>
    </SearchLayout>
  );
}
