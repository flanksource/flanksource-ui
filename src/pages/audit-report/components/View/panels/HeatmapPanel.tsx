import React, { useMemo } from "react";
import CalendarHeatmap, {
  ReactCalendarHeatmapValue
} from "react-calendar-heatmap";
import { PanelResult } from "../../../types";
import PanelHeader from "./PanelHeader";

type HeatmapValue = ReactCalendarHeatmapValue<string> & {
  date: string;
  successful?: number;
  failed?: number;
  count?: number;
};

interface HeatmapPanelProps {
  summary: PanelResult;
}

const HeatmapPanel: React.FC<HeatmapPanelProps> = ({ summary }) => {
  const values = useMemo<HeatmapValue[]>(() => {
    return (summary.rows ?? [])
      .map((row) => {
        const date = String(row.date ?? "");
        if (!date) {
          return null;
        }

        return {
          date,
          successful: Number(row.successful ?? 0),
          failed: Number(row.failed ?? 0),
          count: Number(row.count ?? 0)
        } as HeatmapValue;
      })
      .filter(Boolean) as HeatmapValue[];
  }, [summary.rows]);

  const { startDate, endDate } = useMemo(() => {
    if (values.length === 0) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 120);
      return { startDate: start, endDate: end };
    }

    const sorted = [...values].sort((a, b) => a.date.localeCompare(b.date));
    return {
      startDate: new Date(sorted[0].date),
      endDate: new Date(sorted[sorted.length - 1].date)
    };
  }, [values]);

  const classForValue = (
    value: ReactCalendarHeatmapValue<string> | undefined
  ) => {
    if (!value?.date) return "fill-gray-100";

    const v = value as HeatmapValue;
    const successful = Number(v.successful ?? 0);
    const failed = Number(v.failed ?? 0);
    const total = Number(v.count ?? successful + failed);

    if (total <= 0) return "fill-gray-100";
    const successRatio = successful / total;

    if (successRatio === 1) return "fill-green-200";
    if (successRatio >= 0.5) return "fill-orange-200";
    return "fill-red-200";
  };

  const titleForValue = (
    value: ReactCalendarHeatmapValue<string> | undefined
  ) => {
    if (!value?.date) return "No data";
    const v = value as HeatmapValue;
    const successful = Number(v.successful ?? 0);
    const failed = Number(v.failed ?? 0);
    const total = Number(v.count ?? successful + failed);

    return `${value.date}: ${successful} successful, ${failed} failed (${total} total)`;
  };

  return (
    <div className="flex h-full min-h-[250px] w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-4">
      <PanelHeader
        title={summary.name}
        description={summary.description}
        titleClassName="capitalize"
      />

      <div className="view-heatmap-chart flex-1 overflow-hidden">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={values}
          gutterSize={2}
          classForValue={classForValue}
          titleForValue={titleForValue}
        />
      </div>

      <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-green-200" />
          Success
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-orange-200" />
          Mixed
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-red-200" />
          Failed
        </span>
      </div>

      <style jsx global>{`
        .view-heatmap-chart .react-calendar-heatmap {
          width: 100%;
          height: 150px;
        }
      `}</style>
    </div>
  );
};

export default HeatmapPanel;
