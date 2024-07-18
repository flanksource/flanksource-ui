import { ColumnDef } from "@tanstack/table-core";
import { useEffect, useMemo, useState } from "react";
import { useGetConfigChangesByConfigIdQuery } from "../../../../api/query-hooks";
import { ConfigChange } from "../../../../api/types/configs";
import PillBadge from "../../../../ui/Badge/PillBadge";
import CollapsiblePanel from "../../../../ui/CollapsiblePanel/CollapsiblePanel";
import { CreatedAtCell } from "../../../../ui/DataTable/Cells/DateCells";
import { Icon } from "../../../../ui/Icons/Icon";
import TextSkeletonLoader from "../../../../ui/SkeletonLoader/TextSkeletonLoader";
import EmptyState from "../../../EmptyState";
import { InfiniteTable } from "../../../InfiniteTable/InfiniteTable";
import Title from "../../../Title/title";
import { toastError } from "../../../Toast/toast";
import ConfigChangeNameCell from "./Cells/ConfigChangeNameCell";

type Props = {
  configID: string;
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
};

export const columns: ColumnDef<ConfigChange, any>[] = [
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
    cell: CreatedAtCell,
    enableGrouping: true,
    enableSorting: true
  }
];

export function ConfigChangesDetails({ configID }: Props) {
  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 50
  });
  const [changes, setChanges] = useState<ConfigChange[]>([]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <InfiniteTable<ConfigChange>
        columns={columns}
        // className="border-none"
        isLoading={isLoading && !isFetching}
        isFetching={isFetching}
        allRows={changes}
        loaderView={<TextSkeletonLoader className="my-2 w-full" />}
        totalEntries={totalEntries}
        fetchNextPage={() => {
          if (canGoNext()) {
            setPageState({
              pageIndex: pageIndex + 1,
              pageSize
            });
          }
        }}
        virtualizedRowEstimatedHeight={40}
        columnsClassName={{
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
        <div className="flex w-full flex-row items-center space-x-2">
          <Title
            title="Changes"
            icon={<Icon name="diff" className="h-auto w-6 opacity-40" />}
          />
          <PillBadge>{count}</PillBadge>
        </div>
      }
      dataCount={count}
    >
      <ConfigChangesDetails {...props} />
    </CollapsiblePanel>
  );
}
