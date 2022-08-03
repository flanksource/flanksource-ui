import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get } from "src/api/schemaResources";
import { CodeEditor } from "../CodeEditor";
import { SearchLayout } from "../Layout";

export interface SchemaResourceI {
  name: string;
  source: string;
  spec: string;
  id: string;
  created_at: string;
  updated_at: string;
}

export function SchemaResource({
  resourceInfo
}: {
  resourceInfo: { name: string; table: string };
}) {
  const [resource, setResource] = useState({});
  const { table, name } = resourceInfo;
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    get(table, id).then((res) => {
      console.log(res);
      setResource(res.data[0]);
    });
  }, [table, id]);

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
        <div>{resource.name}</div>
        <CodeEditor value={resource.spec} onChange={() => {}} readOnly />
      </div>
    </SearchLayout>
  );
}
