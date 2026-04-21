import { useScraperJobsHistoryForSettingQuery } from "@flanksource-ui/api/query-hooks/useJobsHistoryQuery";
import ErrorPage from "@flanksource-ui/components/Errors/ErrorPage";
import {
  JobHistory,
  default as JobsHistoryTable
} from "@flanksource-ui/components/JobsHistory/JobsHistoryTable";
import { JobsHistoryTableColumn } from "@flanksource-ui/components/JobsHistory/JobsHistoryTableColumn";
import { Button } from "@flanksource-ui/components/ui/button";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ScrapeRunViewerDialog } from "./ScrapeRunViewerDialog";

type ScraperJobHistoryProps = {
  resourceId: string;
};

export function ScraperJobHistory({ resourceId }: ScraperJobHistoryProps) {
  const [searchParams] = useSearchParams();
  const pageSize = parseInt(searchParams.get("pageSize") ?? "150");

  const [isScrapeDialogOpen, setIsScrapeDialogOpen] = useState(false);
  const [selectedJobHistoryId, setSelectedJobHistoryId] = useState<
    string | undefined
  >();

  const { isLoading, isRefetching, data, error } =
    useScraperJobsHistoryForSettingQuery(
      {
        keepPreviousData: true
      },
      resourceId
    );

  const jobs = data?.data;
  const totalEntries = data?.totalEntries;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  const columns = useMemo<MRT_ColumnDef<JobHistory>[]>(
    () => [
      ...JobsHistoryTableColumn,
      {
        id: "artifacts",
        header: "Artifacts",
        enableSorting: false,
        size: 110,
        Cell: ({ row }) => {
          const artifacts = (row.original.artifacts ?? []).filter(
            (artifact) => !artifact.deleted_at
          );

          if (artifacts.length === 0) {
            return null;
          }

          return (
            <Button
              variant="secondary"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedJobHistoryId(row.original.id);
                setIsScrapeDialogOpen(true);
              }}
            >
              Open
            </Button>
          );
        }
      }
    ],
    []
  );

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {!data && error && !isLoading ? (
        <ErrorPage error={error} />
      ) : (
        <JobsHistoryTable
          jobs={jobs ?? []}
          isLoading={isLoading}
          isRefetching={isRefetching}
          pageCount={pageCount}
          totalJobHistoryItems={totalEntries}
          hiddenColumns={["resource_id", "resource_type", "resource_name"]}
          columns={columns}
          mantineTableBodyCellProps={{
            sx: {
              paddingTop: "4px",
              paddingBottom: "4px"
            }
          }}
        />
      )}

      {selectedJobHistoryId && (
        <ScrapeRunViewerDialog
          open={isScrapeDialogOpen}
          onOpenChange={(open: boolean) => {
            setIsScrapeDialogOpen(open);
            if (!open) {
              setSelectedJobHistoryId(undefined);
            }
          }}
          jobHistoryId={selectedJobHistoryId}
          title="Scrape Run Output"
        />
      )}
    </div>
  );
}
