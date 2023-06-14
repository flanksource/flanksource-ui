import { useEffect, useMemo, useState } from "react";
import ReactTooltip from "react-tooltip";
import {
  sanitizeHTMLContent,
  truncateText,
  sanitizeHTMLContentToText
} from "../../utils/common";
import { ConfigTypeInsights } from "../ConfigInsights";
import EmptyState from "../EmptyState";
import { useGetConfigInsights } from "../../api/query-hooks";
import { toastError } from "../Toast/toast";
import { InfiniteTable } from "../InfiniteTable/InfiniteTable";
import TextSkeletonLoader from "../SkeletonLoader/TextSkeletonLoader";
import ConfigInsightAgeCell from "./cells/ConfigInsightAgeCell";
import { ColumnDef } from "@tanstack/react-table";
import ConfigInsightNameCell from "./cells/ConfigInsightNameCell";

type Props = {
  configId: string;
};

export const columns: ColumnDef<ConfigTypeInsights, any>[] = [
  {
    header: "Name",
    id: "change_type",
    cell: ConfigInsightNameCell,
    accessorKey: "change_type"
  },
  {
    header: "Age",
    id: "first_observed",
    accessorKey: "first_observed",
    cell: ConfigInsightAgeCell
  }
];

export default function InsightsDetails({ configId }: Props) {
  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 50
  });
  const [insights, setInsights] = useState<ConfigTypeInsights[]>([]);
  const {
    data: response,
    isLoading,
    isFetching
  } = useGetConfigInsights<ConfigTypeInsights[]>(configId, pageIndex, pageSize);

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
    setInsights((val) => [...val, ...(data ?? [])]);
  }, [data]);

  useEffect(() => {
    if (response?.error) {
      toastError(response?.error?.message);
    }
  }, [response?.error]);

  const insightsWithSanitizedMessages = useMemo(
    () =>
      insights.map((item) => {
        return {
          ...item,
          sanitizedMessageHTML: sanitizeHTMLContent(item.message),
          sanitizedMessageTxt: truncateText(
            sanitizeHTMLContentToText(item.message)!,
            500
          )
        };
      }),
    [insights]
  );

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  if (!data?.length && !isLoading) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col overflow-y-hidden">
      <InfiniteTable<ConfigTypeInsights>
        columns={columns}
        isLoading={isLoading && !isFetching}
        isFetching={isFetching}
        allRows={insightsWithSanitizedMessages}
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
          first_observed: "text-right"
        }}
      />
    </div>
  );
}
