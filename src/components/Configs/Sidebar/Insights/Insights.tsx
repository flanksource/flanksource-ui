import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import {
  useGetConfigInsights,
  useGetTopologyRelatedInsightsQuery
} from "../../../../api/query-hooks";
import { ConfigAnalysis } from "../../../../api/types/configs";
import TextSkeletonLoader from "../../../../ui/SkeletonLoader/TextSkeletonLoader";
import {
  sanitizeHTMLContent,
  sanitizeHTMLContentToText,
  truncateText
} from "../../../../utils/common";
import EmptyState from "../../../EmptyState";
import { InfiniteTable } from "../../../InfiniteTable/InfiniteTable";
import { toastError } from "../../../Toast/toast";
import ConfigInsightAgeCell from "./cells/ConfigInsightAgeCell";
import ConfigInsightNameCell from "./cells/ConfigInsightNameCell";

function useFetchInsights(
  id: string,
  type: "configs" | "topologies",
  pageIndex: number,
  pageSize: number
) {
  const resConfigInsightQuery = useGetConfigInsights(
    id,
    pageIndex,
    pageSize,
    false,
    type === "configs"
  );

  const resTopologyInsightQuery = useGetTopologyRelatedInsightsQuery(
    id,
    pageIndex,
    pageSize,
    false,
    type === "topologies"
  );

  return type === "configs" ? resConfigInsightQuery : resTopologyInsightQuery;
}

type ConfigInsightsProps = {
  type: "configs";
  configId: string;
};

type TopologyInsightsProps = {
  type: "topologies";
  topologyId: string;
};

export const columns: ColumnDef<
  Pick<
    ConfigAnalysis,
    | "id"
    | "analyzer"
    | "config"
    | "severity"
    | "analysis_type"
    | "sanitizedMessageTxt"
    | "sanitizedMessageHTML"
    | "first_observed"
  >,
  any
>[] = [
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

export default function InsightsDetails(
  props: ConfigInsightsProps | TopologyInsightsProps
) {
  const id = props.type === "configs" ? props.configId : props.topologyId;

  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 50
  });

  const {
    data: response,
    isLoading,
    isFetching
  } = useFetchInsights(id, props.type, pageIndex, pageSize);

  let insights = useMemo(() => response?.data ?? [], [response?.data]);

  const totalEntries = response?.totalEntries ?? 0;

  const canGoNext = () => {
    const pageCount = Math.ceil(totalEntries / pageSize);
    return pageCount >= pageIndex + 1;
  };

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
          sanitizedMessageHTML: sanitizeHTMLContent(item?.message ?? ""),
          sanitizedMessageTxt: truncateText(
            sanitizeHTMLContentToText(item?.message ?? "")!,
            500
          )
        };
      }),
    [insights]
  );

  if (isLoading && !insights?.length) {
    return <TextSkeletonLoader className="my-2 w-full" />;
  }

  if (!insights?.length && !isLoading) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col overflow-y-hidden">
      <InfiniteTable<
        Pick<
          ConfigAnalysis,
          | "id"
          | "analyzer"
          | "config"
          | "severity"
          | "analysis_type"
          | "sanitizedMessageTxt"
          | "sanitizedMessageHTML"
          | "first_observed"
        >
      >
        columns={columns}
        isLoading={isLoading && !isFetching}
        isFetching={isFetching}
        allRows={insightsWithSanitizedMessages as ConfigAnalysis[]}
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
          change_type: "",
          first_observed: "fit-content whitespace-nowrap"
        }}
      />
    </div>
  );
}
