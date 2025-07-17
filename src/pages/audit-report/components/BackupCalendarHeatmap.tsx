import React, { useMemo } from "react";
import CalendarHeatmap, {
  ReactCalendarHeatmapValue
} from "react-calendar-heatmap";
import { Backup } from "../types";
import { Tooltip } from "react-tooltip";

interface BackupCalendarHeatmapProps {
  backups: Backup[];
  className?: string;
}

interface HeatmapValue extends ReactCalendarHeatmapValue<string> {
  date: string;
  successful: number;
  failed: number;
}

const SUCCESS_STATUSES = ["successful", "completed"];

export const BackupCalendarHeatmap: React.FC<BackupCalendarHeatmapProps> = ({
  backups,
  className = ""
}) => {
  const backupsByDatabase = useMemo(() => {
    const databaseMap = new Map<string, Backup[]>();

    backups.forEach((backup) => {
      if (!databaseMap.has(backup.database)) {
        databaseMap.set(backup.database, []);
      }
      databaseMap.get(backup.database)!.push(backup);
    });

    return databaseMap;
  }, [backups]);

  const createHeatmapData = (databaseBackups: Backup[]): HeatmapValue[] => {
    const backupMap = new Map<string, HeatmapValue>();

    databaseBackups.forEach((backup) => {
      try {
        const date = new Date(backup.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        });
        if (!backupMap.has(date)) {
          backupMap.set(date, {
            date,
            successful: 0,
            failed: 0
          });
        }

        const entry = backupMap.get(date);
        if (entry) {
          if (SUCCESS_STATUSES.includes(backup.status.toLowerCase())) {
            entry.successful += 1;
          } else {
            entry.failed += 1;
          }
        }
      } catch (error) {
        console.warn(`Error processing backup date: ${backup.date}`, error);
      }
    });

    return Array.from(backupMap.values());
  };

  const dateRange = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);
    return { startDate, endDate };
  }, []);

  const getClassForValue = (
    value: ReactCalendarHeatmapValue<string> | undefined
  ) => {
    if (!value) {
      return "fill-gray-100";
    }

    const heatmapValue = value as HeatmapValue;
    const totalBackups = heatmapValue.successful + heatmapValue.failed;

    if (totalBackups === 0) {
      return "fill-gray-100";
    }

    const successRate = heatmapValue.successful / totalBackups;

    if (successRate === 1) {
      return "fill-green-200";
    } else if (successRate >= 0.5) {
      return "fill-orange-200";
    } else {
      return "fill-red-200";
    }
  };

  const getTooltipDataAttrs = (
    value: ReactCalendarHeatmapValue<string> | undefined
  ) => {
    if (!value || !value.date) {
      return {
        "data-tooltip-content": "No backups",
        "data-tooltip-id": "backup-tooltip"
      } as any;
    }

    const heatmapValue = value as HeatmapValue;
    const total = heatmapValue.successful + heatmapValue.failed;
    const date = new Date(value.date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric"
    });
    return {
      "data-tooltip-content": `${date}: ${heatmapValue.successful} successful, ${heatmapValue.failed} failed (${total} total)`,
      "data-tooltip-id": "backup-tooltip"
    } as any;
  };

  return (
    <div className={`backup-heatmap ${className}`}>
      <div className="mb-4">
        <h4 className="mb-2 text-lg font-semibold text-gray-700">
          Backup Activity Calendar
        </h4>
        <div className="mb-2 flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-green-200"></div>
            <span>All successful</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-orange-200"></div>
            <span>Mostly successful</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-red-200"></div>
            <span>Mostly failed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm border bg-gray-100"></div>
            <span>No backups</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {Array.from(backupsByDatabase.entries()).map(
          ([database, databaseBackups]) => {
            const heatmapData = createHeatmapData(databaseBackups);
            return (
              <div key={database} className="space-y-2">
                <h5 className="text-md font-medium text-gray-600">
                  {database}
                </h5>
                <div className="overflow-x-auto">
                  <CalendarHeatmap
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                    gutterSize={3}
                    values={heatmapData}
                    classForValue={getClassForValue}
                    tooltipDataAttrs={getTooltipDataAttrs}
                  />
                </div>
              </div>
            );
          }
        )}
      </div>
      <Tooltip id="backup-tooltip" />
    </div>
  );
};
