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

const sampleCheckData = [
  { time: "2021-12-01T07:27:00Z", duration: 400, status: true },
  { time: "2021-12-02T07:27:00Z", duration: 300, status: true },
  { time: "2021-12-03T07:27:00Z", duration: 500, status: false },
  { time: "2021-12-04T07:27:00Z", duration: 100, status: true },
  { time: "2021-12-05T07:27:00Z", duration: 140, status: true },
  { time: "2021-12-06T07:27:00Z", duration: 500, status: false },
  { time: "2021-12-07T07:27:00Z", duration: 320, status: true },
  { time: "2021-12-08T07:27:00Z", duration: 520, status: false }
];

// @TODO: date should be formatted properly depending on selection, not just by DD/MM
const formatDate = (date) => dayjs(date).format("DD/MM");
// @TODO: duration should be formatted properly, not just by ms
const formatDuration = (duration) => `${duration}ms`;

// @TODO: color should depend on a pass/fail boolean rather than avgduration
const getFillByDuration = (duration, avgDuration) =>
  duration > avgDuration ? "#df1a1a" : "#2cbd27";

export function CanaryStatusChart({ data = sampleCheckData, ...rest }) {
  // @TODO: color should depend on a pass/fail boolean rather than avgduration
  const averageDuration =
    data && data.length > 0
      ? Object.values(data).reduce(
          (acc, current) => acc + current.duration,
          0
        ) / data.length
      : null;

  return (
    <ResponsiveContainer width="100%" height="100%" {...rest}>
      <ScatterChart
        margin={{ top: 12, right: 0, bottom: 0, left: 0 }}
        data={data}
      >
        <YAxis
          tickSize={0}
          tick={<CustomYTick tickFormatter={formatDuration} />}
          stroke="rgba(200, 200, 200, 1)"
          tickMargin={6}
          tickFormatter={formatDuration}
          fontSize={12}
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
            <Cell
              key={`cell-${entry.time}`}
              fill={getFillByDuration(entry.duration, averageDuration)}
            />
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
      <text x={0} y={0} dy={6} textAnchor="end" fill="#666" fontSize={fontSize}>
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
          <span className="ml-1 text-gray-700">
            {formatDate(payload[0].value)}
          </span>
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
