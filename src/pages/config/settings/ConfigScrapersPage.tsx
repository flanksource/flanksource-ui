import {
  getAll,
  runConfigScraper,
  SchemaResourceWithJobStatus
} from "@flanksource-ui/api/schemaResources";
import ConfigPageTabs from "@flanksource-ui/components/Configs/ConfigPageTabs";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import AddSchemaResourceModal from "@flanksource-ui/components/SchemaResourcePage/AddSchemaResourceModal";
import ConfigScrapperIcon from "@flanksource-ui/components/SchemaResourcePage/ConfigScrapperIcon";
import {
  SchemaResourceType,
  schemaResourceTypes
} from "@flanksource-ui/components/SchemaResourcePage/resourceTypes";
import AgentBadge from "@flanksource-ui/components/Agents/AgentBadge";
import {
  DataTableTagsColumn,
  MRTJobHistoryStatusColumn
} from "@flanksource-ui/components/Settings/ResourceTable";
import { toastSuccess } from "@flanksource-ui/components/Toast/toast";
import {
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import useReactTableSortState from "@flanksource-ui/ui/DataTable/Hooks/useReactTableSortState";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { Modal } from "@flanksource-ui/ui/Modal";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { useQuery } from "@tanstack/react-query";
import { Play } from "lucide-react";
import { Oval } from "react-loading-icons";
import { MRT_ColumnDef, MRT_Row } from "mantine-react-table";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";

export const catalogScraperResourceInfo = schemaResourceTypes.find(
  (resource) => resource.table === "config_scrapers"
) as SchemaResourceType;

type ConfigScraperRow = SchemaResourceWithJobStatus & {
  table: SchemaResourceType["table"];
};

function RunScraperButton({
  scraperId,
  onRunStart,
  onRunComplete
}: {
  scraperId: string;
  onRunStart: () => void;
  onRunComplete: () => void;
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    onRunStart();
    try {
      await runConfigScraper(scraperId);
      toastSuccess("Scraper ran successfully");
    } catch (err) {
      setError(err);
    } finally {
      setIsRunning(false);
      onRunComplete();
    }
  };

  return (
    <>
      <Button
        size="xs"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleRun();
        }}
        disabled={isRunning}
      >
        {isRunning ? (
          <Oval stroke="currentColor" className="mr-2 h-3.5 w-3.5" />
        ) : (
          <Play className="mr-2 h-3.5 w-3.5" />
        )}
        Run
      </Button>

      <Modal
        title="Scraper Run Failed"
        open={error !== null}
        onClose={() => setError(null)}
        size="medium"
      >
        <div className="p-4">
          <ErrorViewer error={error} />
        </div>
      </Modal>
    </>
  );
}

export default function ConfigScrapersPage() {
  const navigate = useNavigate();

  const [sortState] = useReactTableSortState();

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
            <RunScraperButton
              scraperId={id}
              onRunStart={() => {
                // Refetch after a delay, when the scraper job has started
                setTimeout(() => {
                  refetch();
                }, 1000);
              }}
              onRunComplete={() => {
                refetch();
              }}
            />
          );
        }
      }
    ],
    [refetch]
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
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot link="/catalog" key={"/catalog"}>
                Catalog
              </BreadcrumbRoot>,
              <BreadcrumbRoot
                link="/catalog/scrapers"
                key={"/catalog/scrapers"}
              >
                Scrapers
              </BreadcrumbRoot>,
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
            ]}
          />
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
    </>
  );
}
