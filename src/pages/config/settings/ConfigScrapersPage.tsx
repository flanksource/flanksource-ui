import {
  getAll,
  SchemaResourceWithJobStatus
} from "@flanksource-ui/api/schemaResources";
import AgentBadge from "@flanksource-ui/components/Agents/AgentBadge";
import ConfigPageTabs from "@flanksource-ui/components/Configs/ConfigPageTabs";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import AddSchemaResourceModal from "@flanksource-ui/components/SchemaResourcePage/AddSchemaResourceModal";
import ConfigScrapperIcon from "@flanksource-ui/components/SchemaResourcePage/ConfigScrapperIcon";
import {
  SchemaResourceType,
  schemaResourceTypes
} from "@flanksource-ui/components/SchemaResourcePage/resourceTypes";
import {
  DataTableTagsColumn,
  MRTJobHistoryStatusColumn
} from "@flanksource-ui/components/Settings/ResourceTable";
import { ScrapeRunViewerDialog } from "./components/ScrapeRunViewerDialog";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import {
  BreadcrumbNav,
  BreadcrumbChild,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import useReactTableSortState from "@flanksource-ui/ui/DataTable/Hooks/useReactTableSortState";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { useQuery } from "@tanstack/react-query";
import { MRT_ColumnDef, MRT_Row } from "mantine-react-table";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ScrapeRunDialog } from "./components/ScrapeRunDialog";
import { Button } from "@flanksource-ui/components/ui/button";

export const catalogScraperResourceInfo = schemaResourceTypes.find(
  (resource) => resource.table === "config_scrapers"
) as SchemaResourceType;

type ConfigScraperRow = SchemaResourceWithJobStatus & {
  table: SchemaResourceType["table"];
};

type ScraperRunActionCellProps = {
  scraperId: string;
  refetch: () => void;
  setSearchParams: ReturnType<typeof useSearchParams>[1];
};

function ScraperRunActionCell({
  scraperId,
  refetch,
  setSearchParams
}: ScraperRunActionCellProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-6 px-2 text-xs"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsDialogOpen(true);
        }}
      >
        Run
      </Button>

      <ScrapeRunDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        scraperId={scraperId}
        onRunStart={() => {
          // Refetch after a delay, when the scraper job has started
          setTimeout(() => {
            refetch();
          }, 1000);
        }}
        onRunComplete={() => {
          refetch();
        }}
        onRunSuccess={({ jobHistoryId }) => {
          if (!jobHistoryId) {
            return;
          }

          setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("jobHistoryId", jobHistoryId);
            next.set("scrapeTab", "spec");
            return next;
          });
        }}
      />
    </>
  );
}

export default function ConfigScrapersPage() {
  const navigate = useNavigate();

  const [sortState] = useReactTableSortState();
  const [searchParams, setSearchParams] = useSearchParams();
  const jobHistoryId = searchParams.get("jobHistoryId") ?? undefined;
  const isRunDialogOpen = !!jobHistoryId;

  const { data, refetch, isLoading, isRefetching } = useQuery({
    queryKey: ["catalog", "catalog_scrapper", sortState],
    queryFn: () => {
      return getAll(catalogScraperResourceInfo, sortState);
    },
    // disable cache
    staleTime: 0,
    cacheTime: 0
  });

  const onRowClick = (row: any) => {
    navigate(`/catalog/scrapers/${row.id}`);
  };

  const columns = useMemo<MRT_ColumnDef<ConfigScraperRow>[]>(
    () => [
      {
        accessorKey: "name",
        enableResizing: true,
        header: "Name",
        minSize: 150,
        Cell: ({ row }: { row: MRT_Row<ConfigScraperRow> }) => {
          const { agent, name, spec } = row.original;

          return (
            <div className="flex w-full flex-row items-center gap-2 truncate">
              <div className="min-w-max">
                <ConfigScrapperIcon spec={spec} />
              </div>
              <div data-tip={name} className="block truncate">
                <span className="mr-1"> {name}</span>
                <AgentBadge agent={agent} />
              </div>
            </div>
          );
        }
      },
      {
        accessorKey: "jobStatus",
        header: "Job Status",
        enableResizing: true,
        size: 120,
        Cell: ({ row }: { row: MRT_Row<ConfigScraperRow> }) => (
          <MRTJobHistoryStatusColumn row={row} />
        )
      },
      {
        id: "last_runtime",
        accessorFn: (row: ConfigScraperRow) =>
          row.last_runtime ?? row.job_time_start,
        header: "Last Run",
        enableResizing: true,
        Cell: MRTDateCell,
        size: 100
      },
      {
        accessorKey: "job_last_failed",
        header: "Last Failed",
        enableResizing: true,
        Cell: MRTDateCell,
        size: 80
      },
      {
        header: "Tags",
        accessorKey: "tags",
        enableResizing: true,
        enableSorting: false,
        Cell: ({ row }: { row: MRT_Row<ConfigScraperRow> }) => (
          <DataTableTagsColumn row={row} />
        ),
        size: 150
      },
      {
        header: "Created",
        accessorKey: "created_at",
        enableResizing: true,
        Cell: MRTDateCell,
        size: 80,
        maxSize: 200
      },
      {
        header: "Updated",
        accessorKey: "updated_at",
        enableResizing: true,
        Cell: MRTDateCell,
        size: 80,
        maxSize: 200
      },
      {
        header: "Created By",
        accessorKey: "created_by",
        enableResizing: true,
        enableSorting: false,
        size: 80,
        maxSize: 200,
        Cell: ({ row }: { row: MRT_Row<ConfigScraperRow> }) => {
          const { created_by } = row.original;
          if (!created_by) {
            return null;
          }
          return <Avatar user={created_by} />;
        }
      },
      {
        id: "action",
        header: "Action",
        enableResizing: false,
        enableSorting: false,
        size: 80,
        Cell: ({ row }: { row: MRT_Row<ConfigScraperRow> }) => {
          const { id } = row.original;
          return (
            <ScraperRunActionCell
              scraperId={id}
              refetch={refetch}
              setSearchParams={setSearchParams}
            />
          );
        }
      }
    ],
    [refetch, setSearchParams]
  );

  const dataWithTable = useMemo<ConfigScraperRow[]>(() => {
    const integrations = data?.data ?? [];
    return integrations.map((row: SchemaResourceWithJobStatus) => ({
      ...row,
      table: "config_scrapers" as const
    }));
  }, [data]);

  return (
    <>
      <Head prefix={`Catalog Settings`} />
      <SearchLayout
        title={
          <div className="flex items-center gap-2">
            <BreadcrumbNav
              list={[
                <BreadcrumbRoot link="/catalog" key={"/catalog"}>
                  Catalog
                </BreadcrumbRoot>,
                <BreadcrumbChild
                  link="/catalog/scrapers"
                  key={"/catalog/scrapers"}
                >
                  Scrapers
                </BreadcrumbChild>
              ]}
            />
            <AuthorizationAccessCheck
              resource={catalogScraperResourceInfo.table}
              action="write"
              key="add-button"
            >
              <AddSchemaResourceModal
                key={"add-resource"}
                onClose={() => refetch()}
                resourceInfo={catalogScraperResourceInfo!}
              />
            </AuthorizationAccessCheck>
          </div>
        }
        onRefresh={() => refetch()}
        loading={isLoading || isRefetching}
        contentClass="p-0 h-full"
      >
        <ConfigPageTabs activeTab="Scrapers">
          <div className="flex h-full flex-col overflow-y-hidden">
            <MRTDataTable
              data={dataWithTable}
              columns={columns}
              onRowClick={onRowClick}
              isLoading={isLoading}
              enableServerSideSorting
            />
          </div>
        </ConfigPageTabs>
      </SearchLayout>

      {jobHistoryId && (
        <ScrapeRunViewerDialog
          open={isRunDialogOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setSearchParams(
                (prev) => {
                  const next = new URLSearchParams(prev);
                  next.delete("jobHistoryId");
                  next.delete("scrapeTab");
                  next.delete("scrapeId");
                  next.delete("scrapeQ");
                  return next;
                },
                { replace: true }
              );
            }
          }}
          jobHistoryId={jobHistoryId}
          title="Scrape Run Output"
        />
      )}
    </>
  );
}
