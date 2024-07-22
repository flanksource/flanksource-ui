import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SchemaResourceWithJobStatus } from "../../api/schemaResources";
import ResourceTable from "../Settings/ResourceTable";
import { SchemaResourceType } from "./resourceTypes";

interface Props {
  items: SchemaResourceWithJobStatus[];
  baseUrl: string;
  table: string;
  isLoading?: boolean;
}

export function SchemaResourceList({
  items,
  baseUrl,
  table,
  isLoading
}: Props) {
  const navigate = useNavigate();

  const onRowClick = useCallback(
    (row: SchemaResourceWithJobStatus) => {
      navigate(`${baseUrl}/${row.id}`);
    },
    [baseUrl, navigate]
  );

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-auto">
      <ResourceTable
        data={items}
        table={table as SchemaResourceType["table"]}
        onRowClick={onRowClick}
        isLoading={isLoading}
      />
    </div>
  );
}
