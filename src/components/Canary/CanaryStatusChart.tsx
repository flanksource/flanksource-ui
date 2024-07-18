import { useCanaryGraphQuery } from "@flanksource-ui/api/query-hooks/health";
import { HealthCheck } from "@flanksource-ui/api/types/health";
import { Loading } from "@flanksource-ui/ui/Loading";
import {
  formatDateToMonthDay,
  formatDateToMonthDayTime,
  formatDateToTime,
  formatDateToYear
} from "@flanksource-ui/utils/date";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

// @TODO: duration should be formatted properly, not just by ms
const formatDuration = (duration: number) => `${duration}ms`;

const getFill = (entry: { status?: any }) =>
  entry.status ? "#2cbd27" : "#df1a1a";

function getUpdatedFormat(start: string) {
  switch (start) {
    case "2d":
    case "3d":
    case "1w":
    case "2w":
    case "3w":
    case "1mo": {
      return formatDateToMonthDayTime;
    }
    case "2mo":
    case "3mo":
    case "6mo":
    case "1y": {
      return formatDateToMonthDay;
    }
    case "2y":
    case "3y":
    case "5y": {
      return formatDateToYear;
    }
    default:
  }
  return formatDateToTime;
}

// const getStartValue = (start: string) => {
//   if (!start.includes("mo")) {
//     return start;
//   }

//   return formatISODate(
//     subtractDateFromNow(+(start.match(/\d/g)?.[0] ?? "1"), "month")
//   );
// };

type CanaryStatusChartProps = {
  check: Partial<HealthCheck>;
  timeRange: string;
} & Omit<React.ComponentProps<typeof ResponsiveContainer>, "children">;

export function CanaryStatusChart({
  check,
  timeRange,
  ...rest
}: CanaryStatusChartProps) {
  const [dateFormatFn, setDateFormatFn] = useState(
    () => (date: string | Date) => formatDateToTime(date)
  );

  const tickFormatter = useCallback(
    (date: Date | string) => {
      return dateFormatFn(date);
    },
    [dateFormatFn]
  );

  // we need to lift this up
  const { data: graphData, isLoading } = useCanaryGraphQuery(timeRange, check);

  const data = useMemo(() => (graphData?.status ?? []).reverse(), [graphData]);

  useEffect(() => {
    const updatedFormat = getUpdatedFormat(timeRange);
    setDateFormatFn(() => (date: string | Date) => updatedFormat(date));
  }, [timeRange]);

  if (isLoading) {
    return (
      <Loading className="flex h-full flex-1 items-center justify-center" />
    );
  }

  if (!data?.length) {
    return (
      <div className="flex h-full flex-1 items-center justify-center text-sm text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%" {...rest}>
      <ScatterChart
        margin={{ top: 12, right: 0, bottom: 0, left: -20 }}
        data={data}
      >
        <YAxis
          tickSize={0}
          tick={<CustomYTick tickFormatter={formatDuration} />}
          stroke="rgba(200, 200, 200, 1)"
          tickMargin={4}
          tickFormatter={formatDuration}
          fontSize={12}
          padding={{}}
          dataKey="duration"
          name="Latency"
        />
        <XAxis
          tickSize={0}
          tick={<CustomXTick tickFormatter={tickFormatter} />}
          stroke="rgba(200, 200, 200, 1)"
          tickMargin={4}
          tickFormatter={tickFormatter}
          fontSize={12}
          reversed
          // type="number"
          allowDuplicatedCategory={false}
          // scale="time"
          dataKey="time"
          name="Time"
        />
        <CartesianGrid
          stroke="rgba(230, 230, 230, 1)"
          strokeWidth={1}
          strokeDasharray="8 8"
        />
        <Tooltip
          animationDuration={0}
          cursor={{ stroke: "rgba(0, 0, 0, 0.12)" }}
          content={<CustomTooltip />}
        />
        <Scatter name="Check Statuses" data={data} fill="rgba(0, 255, 0, 1)">
          {data.map((entry) => (
            <Cell key={`cell-${entry.time}`} fill={getFill(entry)} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}

function CustomXTick({ tickFormatter = (value: string) => value, ...rest }) {
  const { x, y, payload, fontSize = 12 } = rest;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="#666"
        fontSize={fontSize}
      >
        {tickFormatter(payload.value)}
      </text>
    </g>
  );
}

type CustomYTickProps = {
  tickFormatter?: (value: number) => string | number | undefined;
  x?: number;
  y?: number;
  payload?: { value?: number };
  fontSize?: number;
};

function CustomYTick({
  tickFormatter = (value?: number) => value,
  x,
  y,
  payload,
  fontSize = 12
}: CustomYTickProps) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-36}
        y={0}
        dy={3}
        textAnchor="start"
        fill="#666"
        fontSize={fontSize}
      >
        {tickFormatter(payload?.value!)}
      </text>
    </g>
  );
}

const CustomTooltip = ({
  active,
  payload
}: {
  active?: boolean;
  payload?: { name?: string; value?: number }[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="flex flex-col rounded-sm border bg-white p-3 text-xs">
        <p className="">
          <span className="text-gray-500">{payload[0].name}: </span>
          <span className="ml-1 text-gray-700">{payload[0].value}</span>
        </p>
        <p className="">
          <span className="text-gray-500">{payload[1].name}: </span>
          <span className="ml-1 text-gray-700">
            {formatDuration(payload?.[1]?.value ?? 0)}
          </span>
        </p>
      </div>
    );
  }

  return null;
};
