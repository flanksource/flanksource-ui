import { toastError } from "@flanksource-ui/components/Toast/toast";
import { Switch } from "@flanksource-ui/components/ui/switch";
import { useUser } from "@flanksource-ui/context";
import {
  deleteProperty,
  fetchProperties,
  saveProperty,
  updateProperty
} from "@flanksource-ui/api/services/properties";
import { JobHistorySummary as JobHistorySummaryType } from "@flanksource-ui/api/services/jobsHistory";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { formatJobName } from "@flanksource-ui/utils/common";
import { formatDuration } from "@flanksource-ui/utils/date";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

type JobHistorySummaryProps = {
  data: JobHistorySummaryType[];
  isLoading?: boolean;
  isRefetching?: boolean;
  pageCount: number;
  totalEntries?: number;
};

const getJobDisabledPropertyName = (jobName: string) =>
  `jobs.${jobName}.disabled`;

const getLegacyJobDisabledPropertyName = (jobName: string) =>
  `jobs.${jobName}.disable`;

export default function JobHistorySummary({
  data,
  isLoading,
  isRefetching,
  pageCount,
  totalEntries
}: JobHistorySummaryProps) {
  const navigate = useNavigate();
  const user = useUser();
  const queryClient = useQueryClient();

  const { data: properties = [] } = useQuery({
    queryKey: ["job_history_summary", "disabled_properties"],
    queryFn: async () => {
      const response = await fetchProperties();
      return response.data ?? [];
    },
    staleTime: 5000
  });

  const disabledJobs = useMemo(() => {
    return new Set(
      properties
        .filter((property) => {
          if (property.value !== "true") {
            return false;
          }

          const isDisabled = property.name.endsWith(".disabled");
          const isLegacyDisabled = property.name.endsWith(".disable");
          return isDisabled || isLegacyDisabled;
        })
        .map((property) => {
          if (property.name.endsWith(".disabled")) {
            return property.name.slice(5, -9);
          }
          return property.name.slice(5, -8);
        })
    );
  }, [properties]);

  const toggleJobMutation = useMutation({
    mutationFn: async ({
      jobName,
      disabled
    }: {
      jobName: string;
      disabled: boolean;
    }) => {
      const propertyName = getJobDisabledPropertyName(jobName);
      const legacyPropertyName = getLegacyJobDisabledPropertyName(jobName);

      if (disabled) {
        const payload = {
          name: propertyName,
          value: "true",
          created_by: user.user?.id
        };

        const createResponse = await saveProperty(payload);
        if (!createResponse.data) {
          const updateResponse = await updateProperty(payload);
          if (!updateResponse.data) {
            throw new Error(
              createResponse.error?.message ??
                updateResponse.error?.message ??
                "Failed to disable job"
            );
          }
        }

        await deleteProperty({ name: legacyPropertyName }).catch(() => {
          // legacy property may not exist; ignore cleanup failure
        });
        return;
      }

      const results = await Promise.allSettled([
        deleteProperty({ name: propertyName }),
        deleteProperty({ name: legacyPropertyName })
      ]);

      const hasDeleteSuccess = results.some(
        (result) => result.status === "fulfilled"
      );
      if (!hasDeleteSuccess) {
        throw new Error("Failed to enable job");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["job_history_summary", "disabled_properties"]
      });
    },
    onError: (error) => {
      toastError((error as Error).message);
    }
  });

  const columns: MRT_ColumnDef<JobHistorySummaryType>[] = [
    {
      header: "Job Name",
      id: "name",
      accessorKey: "name",
      minSize: 220,
      Cell: ({ row }) => <span>{formatJobName(row.original.name)}</span>
    },
    {
      header: "Average Duration",
      id: "average_duration",
      accessorKey: "average_duration",
      size: 100,
      Cell: ({ row }) => {
        const rawValue = row.original.average_duration;
        const duration = Number(rawValue ?? 0);

        if (!Number.isFinite(duration) || duration <= 0) {
          return <span>-</span>;
        }

        return <span>{formatDuration(duration)}</span>;
      }
    },
    {
      header: "Total",
      id: "total",
      accessorKey: "total",
      size: 70
    },
    {
      header: "Success",
      id: "success",
      accessorKey: "success",
      size: 70
    },
    {
      header: "Failed",
      id: "failed",
      accessorKey: "failed",
      size: 70,
      Cell: ({ row }) => (
        <span className={row.original.failed > 0 ? "text-red-500" : ""}>
          {row.original.failed}
        </span>
      )
    },
    {
      header: "Skipped",
      id: "skipped",
      accessorKey: "skipped",
      size: 70
    },
    {
      header: "Last Run",
      id: "last_run_at",
      accessorKey: "last_run_at",
      size: 90,
      Cell: MRTDateCell
    },
    {
      header: "Disable",
      id: "action",
      enableSorting: false,
      size: 80,
      Cell: ({ row }) => (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Switch
            className="data-[state=checked]:bg-red-600"
            checked={disabledJobs.has(row.original.name)}
            disabled={toggleJobMutation.isLoading}
            onCheckedChange={(checked) => {
              toggleJobMutation.mutate({
                jobName: row.original.name,
                disabled: checked
              });
            }}
          />
        </div>
      )
    }
  ];

  return (
    <MRTDataTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      isRefetching={isRefetching}
      enableServerSideSorting
      enableServerSidePagination
      manualPageCount={pageCount}
      totalRowCount={totalEntries}
      defaultSorting={[{ id: "last_run_at", desc: true }]}
      onRowClick={(row) => {
        navigate(`/settings/jobs/${encodeURIComponent(row.name)}`);
      }}
    />
  );
}
