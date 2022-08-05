import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteResource,
  getResource,
  updateResource
} from "../../api/schemaResources";
import { BreadcrumbNav } from "../BreadcrumbNav";
import { SearchLayout } from "../Layout";
import { SchemaResource as SchemaResourceI } from "./resourceTypes";
import { SchemaResourceEdit } from "./SchemaResourceEdit";

export function SchemaResource({
  resourceInfo
}: {
  resourceInfo: SchemaResourceI;
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
      console.log(res);
      setResource(res.data[0]);
      setLoadingState("success");
    });
  }, [resourceInfo, id]);

  const onSubmit = (props: any) =>
    updateResource(resourceInfo, { ...resource, ...props })?.then((res) =>
      console.log("res", res)
    );
  const onDelete = async (id: string) => {
    await deleteResource(resourceInfo, id);
    navigate(`../${resourceInfo.table}`);
  };

  return (
    <SearchLayout
      title={
        <BreadcrumbNav
          list={[{ title: name, to: `../${resourceInfo.table}` }, id]}
        />
      }
    >
      <div className="self-center max-w-screen-xl p-4">
        {loadingState === "success" && id && (
          <SchemaResourceEdit
            id={id}
            {...resource}
            onSubmit={onSubmit}
            onDelete={onDelete}
          />
        )}
      </div>
    </SearchLayout>
  );
}
