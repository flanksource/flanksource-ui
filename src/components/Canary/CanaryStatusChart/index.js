import dayjs from "dayjs";
import {
  ScatterChart,
  Scatter,
  Tooltip,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";
import { useEffect, useState } from "react";
import { getCanaryGraph } from "../../../api/services/topology";
import { Loading } from "../../Loading";
import { getParamsFromURL } from "../utils";

// @TODO: duration should be formatted properly, not just by ms
const formatDuration = (duration) => `${duration}ms`;

const getFill = (entry) => (entry.status ? "#2cbd27" : "#df1a1a");

export function CanaryStatusChart({ check, timeRange, ...rest }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line no-restricted-globals
    const searchParams = getParamsFromURL(location.search);
    const payload = {
      check: check.id,
      count: 300,
      start: searchParams.timeRange
    };
    getCanaryGraph(payload).then((results) => {
      setData(results.data.status);
    });
  }, [check]);

  if (!data?.length) {
    return <Loading />;
  }

  let time = 0;
  if (data.length > 0) {
    time =
      (new Date(data[0].time) - new Date(data[data.length - 1].time)) /
      1000 /
      60;
  }

  // @TODO: date should be formatted properly depending on selection, not just by DD/MM
  let formatDate = (date) => dayjs(date).format("HH:mm");
  if (time > 60 * 24 * 30) {
    formatDate = (date) => dayjs(date).format("MMM DD");
  } else if (time > 60 * 24) {
    formatDate = (date) => dayjs(date).format("MMM DD HH:mm");
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

function CustomXTick({ tickFormatter = (value) => value, ...rest }) {
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

function CustomYTick({ tickFormatter = (value) => value, ...rest }) {
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

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="flex flex-col bg-white p-3 border rounded-sm text-xs">
        <p className="">
          <span className="text-gray-500">{payload[0].name}: </span>
          <span className="ml-1 text-gray-700">{payload[0].value}</span>
        </p>
        <p className="">
          <span className="text-gray-500">{payload[1].name}: </span>
          <span className="ml-1 text-gray-700">
            {formatDuration(payload[1].value)}
          </span>
        </p>
      </div>
    );
  }

  return null;
};
