import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getResource } from "../../api/schemaResources";
import { CodeEditor } from "../CodeEditor";
import { SearchLayout } from "../Layout";
import { SchemaResource as SchemaResourceI } from "./resourceTypes";
import { SchemaResourceEdit } from "./SchemaResourceEdit";

export function SchemaResource({
  resourceInfo
}: {
  resourceInfo: SchemaResourceI;
}) {
  const [resource, setResource] = useState({});
  const [edit, setEdit] = useState(false);
  const { name } = resourceInfo;
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    getResource(resourceInfo, id)?.then((res) => {
      console.log(res);
      setResource(res.data[0]);
    });
  }, [resourceInfo]);

  const onEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setEdit((edit) => !edit);
  };

  const onSubmit = (props: any) => {
    console.log(props);
  };

  return (
    <SearchLayout
      title={
        <div className="flex items-center flex-shrink-0">
          <div className="text-xl font-semibold mr-4 whitespace-nowrap">
            {name}
          </div>
          /<div className="flex">{id}</div>
        </div>
      }
    >
      <div className="self-center max-w-screen-xl">
        <button onClick={onEdit}>Edit</button>
        {edit ? (
          <SchemaResourceEdit id={id} {...resource} onSubmit={onSubmit} />
        ) : (
          <>
            <div>{resource.name}</div>
            <CodeEditor value={resource.spec} onChange={() => {}} readOnly />
          </>
        )}
      </div>
    </SearchLayout>
  );
}
