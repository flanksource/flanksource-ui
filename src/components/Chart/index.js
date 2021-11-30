import {
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";

const data = [
  { name: "12/4", uv: 400, pv: 2400, amt: 2400 },
  { name: "13/4", uv: 300, pv: 2700, amt: 2400 },
  { name: "14/4", uv: 500, pv: 2200, amt: 2400 },
  { name: "15/4", uv: 100, pv: 2100, amt: 2400 },
  { name: "16/4", uv: 140, pv: 2100, amt: 2400 },
  { name: "17/4", uv: 500, pv: 2100, amt: 2400 },
  { name: "18/4", uv: 320, pv: 2100, amt: 2400 },
  { name: "19/4", uv: 520, pv: 2100, amt: 2400 }
];

export function Chart({ ...rest }) {
  return (
    <ResponsiveContainer width="100%" height="100%" {...rest}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" />
        <YAxis />
      </LineChart>
    </ResponsiveContainer>
  );
}
