import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dump } from "js-yaml";
import { isEmpty } from "lodash";
import {
  deleteResource,
  getResource,
  SchemaResourceI,
  updateResource
} from "../../api/schemaResources";
import { BreadcrumbNav } from "../BreadcrumbNav";
import { SearchLayout } from "../Layout";
import { SchemaResourceType } from "./resourceTypes";
import { SchemaResourceEdit } from "./SchemaResourceEdit";
import { toastError } from "../Toast/toast";

export function SchemaResource({
  resourceInfo
}: {
  resourceInfo: SchemaResourceType;
}) {
  const [resource, setResource] = useState({});
  const navigate = useNavigate();
  const [loadingState, setLoadingState] = useState("initial");
  const { name } = resourceInfo;
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    setLoadingState("loading");
    getResource(resourceInfo, id)?.then((res) => {
      const specData = res.data[0]?.spec;
      setResource({
        ...res.data[0],
        spec:
          specData && !isEmpty(specData)
            ? dump(specData, { sortKeys: true })
            : ""
      });
      setLoadingState("success");
    });
  }, [resourceInfo, id]);

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
      title={
        <BreadcrumbNav
          list={[{ title: name, to: `/settings/${resourceInfo.table}` }, id]}
        />
      }
      contentClass="flex flex-col h-full"
    >
      <div className="flex flex-col flex-1 overflow-y-auto mx-auto w-screen max-w-screen-xl p-4">
        {loadingState === "success" && id && (
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
