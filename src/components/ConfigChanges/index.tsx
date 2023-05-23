import { ColumnDef } from "@tanstack/table-core";
import { useEffect, useMemo, useState } from "react";
import { GoDiff } from "react-icons/go";
import { useGetConfigChangesByConfigIdQuery } from "../../api/query-hooks";
import { ConfigItem } from "../../api/services/configs";
import { User } from "../../api/services/users";
import PillBadge from "../Badge/PillBadge";
import CollapsiblePanel from "../CollapsiblePanel";
import EmptyState from "../EmptyState";
import Title from "../Title/title";
import { toastError } from "../Toast/toast";
import ConfigChangeAgeCell from "./Cells/ConfigChangeAgeCell";
import ConfigChangeNameCell from "./Cells/ConfigChangeNameCell";
import { InfiniteTable } from "../InfiniteTable/InfiniteTable";
import TextSkeletonLoader from "../SkeletonLoader/TextSkeletonLoader";

export type ConfigTypeChanges = {
  id: string;
  config_id: string;
  external_change_id: string;
  change_type: string;
  severity: string;
  source: string;
  summary: string;
  patches: string;
  details: string;
  created_at: string;
  created_by: string | User;
  external_created_by: string;
  config?: ConfigItem;
};

type Props = {
  configID: string;
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
};

export const columns: ColumnDef<ConfigTypeChanges, any>[] = [
  {
    header: "Name",
    id: "change_type",
    cell: ConfigChangeNameCell,
    aggregatedCell: "",
    accessorKey: "change_type",
    enableGrouping: true
  },
  {
    header: "Age",
    id: "created_at",
    accessorKey: "created_at",
    cell: ConfigChangeAgeCell,
    enableGrouping: true,
    enableSorting: true
  }
];

export function ConfigChangesDetails({ configID }: Props) {
  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 50
  });
  const [changes, setChanges] = useState<ConfigTypeChanges[]>([]);

  const {
    data: response,
    isLoading,
    isFetching
  } = useGetConfigChangesByConfigIdQuery(configID, pageIndex, pageSize);

  let data = response?.data;
  const totalEntries = response?.totalEntries ?? 0;

  const canGoNext = () => {
    const pageCount = Math.ceil(totalEntries / pageSize);
    return pageCount >= pageIndex + 1;
  };

  useMemo(() => {
    if (!data?.length) {
      return;
    }
    setChanges([...changes, ...data]);
  }, [data]);

  useEffect(() => {
    if (response?.error) {
      toastError(response?.error?.message);
    }
  }, [response?.error]);

  if (!data?.length && !isLoading) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col overflow-y-hidden">
      <InfiniteTable<ConfigTypeChanges>
        columns={columns}
        isLoading={isLoading && !isFetching}
        isFetching={isFetching}
        allRows={changes}
        loaderView={<TextSkeletonLoader className="w-full my-2" />}
        totalEntries={totalEntries}
        fetchNextPage={() => {
          if (canGoNext()) {
            setPageState({
              pageIndex: pageIndex + 1,
              pageSize
            });
          }
        }}
        stickyHead
        virtualizedRowEstimatedHeight={40}
        columnsClassName={{
          change_type: "flex-1 w-[100px]",
          created_at: "text-right"
        }}
      />
    </div>
  );
}

export default function ConfigChanges({
  isCollapsed,
  onCollapsedStateChange,
  ...props
}: Props) {
  const { data: response } = useGetConfigChangesByConfigIdQuery(
    props.configID,
    0,
    50
  );
  const count = response?.totalEntries ?? 0;

  return (
    <CollapsiblePanel
      isCollapsed={isCollapsed}
      onCollapsedStateChange={onCollapsedStateChange}
      Header={
        <div className="flex flex-row w-full items-center space-x-2">
          <Title title="Changes" icon={<GoDiff className="w-6 h-auto" />} />
          <PillBadge>{response?.data?.length ?? 0}</PillBadge>
        </div>
      }
      dataCount={count}
    >
      <ConfigChangesDetails {...props} />
    </CollapsiblePanel>
  );
}
