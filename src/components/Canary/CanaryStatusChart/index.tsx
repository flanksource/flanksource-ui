import { useEffect, useState } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";

import dayjs from "dayjs";
import history from "history/browser";
import {
  Cell,
  XAxis,
  YAxis,
  Scatter,
  Tooltip,
  ScatterChart,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import { Loading } from "../../Loading";

import { getParamsFromURL } from "../utils";
import { getCanaryGraph } from "../../../api/services/topology";

type StatusType = {
  time: string;
  duration: number;
};

// @TODO: duration should be formatted properly, not just by ms
const formatDuration = (duration: number) => `${duration}ms`;

const getFill = (entry: StatusType) => (entry ? "#df1a1a" : "#2cbd27");

function updateDataKeyValue(key: number, a: {}, b: StatusType) {
  a[key] = {
    time: b.time,
    duration: a[key] ? a[key].duration + b.duration : b.duration
  };
  return a;
}

function getUpdatedDataAndFormat(start: string, currentData: StatusType[]) {
  let format = "HH:mm";
  let newData = {};

  switch (start) {
    case "2h":
    case "3h":
    case "6h":
    case "12h":
    case "1d": {
      format = "HH:00";
      newData = currentData.reduce(
        (a, b) => updateDataKeyValue(dayjs(b.time).hour(), a, b),
        {}
      );
      break;
    }
    case "2d":
    case "3d":
    case "1w": {
      format = "dddd";
      newData = currentData.reduce(
        (a, b) => updateDataKeyValue(dayjs(b.time).day(), a, b),
        {}
      );
      break;
    }
    case "2w":
    case "3w":
    case "1mo": {
      format = "MMMM D";
      newData = currentData.reduce(
        (a, b) => updateDataKeyValue(dayjs(b.time).date(), a, b),
        {}
      );
      break;
    }
    case "2mo":
    case "3mo":
    case "6mo":
    case "1y": {
      format = "MMMM";
      newData = currentData.reduce(
        (a, b) => updateDataKeyValue(dayjs(b.time).month(), a, b),
        {}
      );
      break;
    }
    case "2y":
    case "3y":
    case "5y": {
      format = "YYYY";
      newData = currentData.reduce(
        (a, b) => updateDataKeyValue(dayjs(b.time).year(), a, b),
        {}
      );
      break;
    }
    default: {
      newData = currentData.reduce(
        (a, b) => updateDataKeyValue(dayjs(b.time).minute(), a, b),
        {}
      );
    }
  }

  return {
    format,
    data: Object.keys(newData).map((i) => newData[i]) as StatusType[]
  };
}

export const getStartValue = (start: string) => {
  if (!start.includes("mo")) {
    return start;
  }

  return dayjs()
    .subtract(+(start.match(/\d/g)?.[0] ?? "1"), "month")
    .toISOString();
};

export function CanaryStatusChart({ check, ...rest }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState<StatusType[]>([]);
  const [currentFormat, setCurrentFormat] = useState("HH:mm");

  useEffect(() => {
    history.listen(({ location }) => {
      setSearchParams(getParamsFromURL(location.search) as URLSearchParamsInit);
    });
  }, []);

  useEffect(() => {
    const payload = {
      count: 300,
      check: check.id,
      start: getStartValue(searchParams.get("timeRange") ?? "1h")
    };

    getCanaryGraph(payload).then((results) => {
      const { format: updatedFormat, data: updatedData } =
        getUpdatedDataAndFormat(
          searchParams.get("timeRange") ?? "",
          results.data.status
        );

      setData(updatedData);
      setCurrentFormat(updatedFormat);
    });
  }, [check, searchParams]);

  if (!data?.length) {
    return <Loading />;
  }

  const formatDate = (date: string) => dayjs(date).format(currentFormat);

  return (
    <ResponsiveContainer width="100%" height="100%" {...rest}>
      <ScatterChart
        data={data}
        margin={{ top: 12, right: 0, bottom: 0, left: -20 }}
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
          tick={<CustomXTick tickFormatter={formatDate} />}
          stroke="rgba(200, 200, 200, 1)"
          tickMargin={4}
          tickFormatter={formatDate}
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

function CustomYTick({ tickFormatter = (value: string) => value, ...rest }) {
  const { x, y, payload, fontSize = 12 } = rest;

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
        {tickFormatter(payload.value)}
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
      <div className="flex flex-col p-3 text-xs bg-white border rounded-sm">
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
