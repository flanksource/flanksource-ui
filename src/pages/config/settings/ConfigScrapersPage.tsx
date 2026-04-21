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
import { useNavigate, useSearchParams } from "react-router-dom";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";
import { ScrapeUIDialog } from "@flanksource-ui/scrapeui/ScrapeUIDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@flanksource-ui/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@flanksource-ui/components/ui/select";
import { Switch } from "@flanksource-ui/components/ui/switch";

export const catalogScraperResourceInfo = schemaResourceTypes.find(
  (resource) => resource.table === "config_scrapers"
) as SchemaResourceType;

type ConfigScraperRow = SchemaResourceWithJobStatus & {
  table: SchemaResourceType["table"];
};

const RUN_LOG_LEVELS = ["trace", "debug", "info", "warn", "error"] as const;
type RunLogLevel = (typeof RUN_LOG_LEVELS)[number];

type RunScraperSuccessPayload = {
  artifactId?: string;
  jobHistoryId?: string;
};

function RunScraperButton({
  scraperId,
  onRunStart,
  onRunComplete,
  onRunSuccess
}: {
  scraperId: string;
  onRunStart: () => void;
  onRunComplete: () => void;
  onRunSuccess: (payload: RunScraperSuccessPayload) => void;
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [logLevel, setLogLevel] = useState<RunLogLevel>("info");
  const [captureHAR, setCaptureHAR] = useState(false);
  const [captureLogs, setCaptureLogs] = useState(true);
  const [captureSnapshots, setCaptureSnapshots] = useState(false);
  const [openScrapeUI, setOpenScrapeUI] = useState(true);

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    onRunStart();
    try {
      const response = await runConfigScraper(scraperId, {
        logLevel,
        captureHAR,
        captureLogs,
        captureSnapshots
      });
      const payload = response?.data?.payload ?? response?.data;
      const runArtifactId = payload?.run_artifact_id;
      const jobHistoryId = payload?.job_history_id;

      toastSuccess("Scraper started successfully");
      setIsDialogOpen(false);

      if (openScrapeUI && (runArtifactId || jobHistoryId)) {
        onRunSuccess({
          artifactId: runArtifactId,
          jobHistoryId
        });
      }
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
          setIsDialogOpen(true);
        }}
        disabled={isRunning}
      >
        <Play className="mr-2 h-3.5 w-3.5" />
        Run
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="sm:max-w-md"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <DialogHeader>
            <DialogTitle>Run scraper</DialogTitle>
            <DialogDescription>
              Configure this run before starting the scraper.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Log level</p>
              <Select
                value={logLevel}
                onValueChange={(value) => setLogLevel(value as RunLogLevel)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select log level" />
                </SelectTrigger>
                <SelectContent>
                  {RUN_LOG_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Run options</p>

              <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Capture logs
                  </p>
                  <p className="text-xs text-gray-500">
                    Include scraper runtime logs in job details.
                  </p>
                </div>
                <Switch
                  checked={captureLogs}
                  onCheckedChange={setCaptureLogs}
                />
              </div>

              <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Capture snapshots
                  </p>
                  <p className="text-xs text-gray-500">
                    Capture and store snapshots while scraping.
                  </p>
                </div>
                <Switch
                  checked={captureSnapshots}
                  onCheckedChange={setCaptureSnapshots}
                />
              </div>

              <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Capture HAR
                  </p>
                  <p className="text-xs text-gray-500">
                    Capture HTTP archive (HAR) for the run.
                  </p>
                </div>
                <Switch checked={captureHAR} onCheckedChange={setCaptureHAR} />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Open Scrape UI
                </p>
                <p className="text-xs text-gray-500">
                  Automatically open run output dialog after starting.
                </p>
              </div>
              <Switch
                checked={openScrapeUI}
                onCheckedChange={setOpenScrapeUI}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              disabled={isRunning}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleRun} disabled={isRunning}>
              {isRunning ? (
                <Oval stroke="currentColor" className="mr-2 h-3.5 w-3.5" />
              ) : (
                <Play className="mr-2 h-3.5 w-3.5" />
              )}
              Run
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
  const [searchParams, setSearchParams] = useSearchParams();
  const artifactId = searchParams.get("artifactId") ?? undefined;
  const jobHistoryId = searchParams.get("jobHistoryId") ?? undefined;
  const isRunDialogOpen =
    searchParams.get("scrapeui") === "1" && !!(artifactId || jobHistoryId);

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
              onRunSuccess={({ artifactId, jobHistoryId }) => {
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  next.set("scrapeui", "1");

                  if (artifactId) {
                    next.set("artifactId", artifactId);
                  } else {
                    next.delete("artifactId");
                  }

                  if (jobHistoryId) {
                    next.set("jobHistoryId", jobHistoryId);
                  } else {
                    next.delete("jobHistoryId");
                  }

                  next.set("scrapeTab", "spec");
                  return next;
                });
              }}
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

      {(artifactId || jobHistoryId) && (
        <ScrapeUIDialog
          open={isRunDialogOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setSearchParams(
                (prev) => {
                  const next = new URLSearchParams(prev);
                  next.delete("scrapeui");
                  next.delete("artifactId");
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
          artifactId={artifactId}
          jobHistoryId={jobHistoryId}
          title="Scrape Run Output"
        />
      )}
    </>
  );
}
