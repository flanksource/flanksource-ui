import type { Meta, StoryObj } from "@storybook/react";
import DynamicDataTable from "./DynamicDataTable";
import { ViewColumnDef } from "../types";

const meta: Meta<typeof DynamicDataTable> = {
  title: "Audit Report/Components/DynamicDataTable",
  component: DynamicDataTable,
  parameters: {
    layout: "padded"
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicColumns: ViewColumnDef[] = [
  { name: "Name", type: "string" },
  { name: "Age", type: "number" },
  { name: "Active", type: "boolean" },
  { name: "Created", type: "datetime" }
];

const basicRows = [
  ["John Doe", 30, true, "2023-01-15T10:00:00Z"],
  ["Jane Smith", 25, false, "2023-02-20T14:30:00Z"],
  ["Bob Johnson", 35, true, "2023-03-10T09:15:00Z"]
];

export const BasicTable: Story = {
  args: {
    columns: basicColumns,
    rows: basicRows,
    title: "User Information"
  }
};

const performanceColumns: ViewColumnDef[] = [
  { name: "Service", type: "string" },
  { name: "Response Time", type: "duration" },
  { name: "CPU Usage", type: "gauge", gauge: { min: 0, max: 100, unit: "%" } },
  { name: "Status", type: "status" },
  { name: "Health", type: "health" }
];

const performanceRows = [
  ["API Gateway", 250000000, 45, "healthy", "healthy"],
  ["Database", 150000000, 78, "warning", "warning"],
  ["Cache Service", 50000000, 23, "healthy", "healthy"],
  ["Message Queue", 300000000, 92, "critical", "unhealthy"]
];

export const PerformanceMetrics: Story = {
  args: {
    columns: performanceColumns,
    rows: performanceRows,
    title: "System Performance"
  }
};

const gaugeColumns: ViewColumnDef[] = [
  { name: "Metric", type: "string" },
  {
    name: "CPU Usage",
    type: "gauge",
    gauge: {
      min: 0,
      max: 100,
      unit: "%",
      thresholds: [
        { percent: 70, color: "orange" },
        { percent: 90, color: "red" }
      ]
    }
  },
  {
    name: "Memory",
    type: "gauge",
    gauge: {
      min: 0,
      max: 16,
      unit: "GB",
      thresholds: [
        { percent: 75, color: "orange" },
        { percent: 94, color: "red" }
      ]
    }
  },
  {
    name: "Disk Usage",
    type: "gauge",
    gauge: {
      min: 0,
      max: 1000,
      unit: "GB",
      thresholds: [
        { percent: 80, color: "orange" },
        { percent: 95, color: "red" }
      ]
    }
  }
];

const gaugeRows = [
  ["Server 1", 45, 8.2, 450],
  ["Server 2", 78, 12.5, 720],
  ["Server 3", 23, 4.1, 280],
  ["Server 4", 92, 15.8, 980]
];

export const GaugeMetrics: Story = {
  args: {
    columns: gaugeColumns,
    rows: gaugeRows,
    title: "Resource Usage"
  }
};

const mixedColumns: ViewColumnDef[] = [
  { name: "Service", type: "string" },
  { name: "Uptime", type: "duration" },
  { name: "Last Check", type: "datetime" },
  { name: "Enabled", type: "boolean" },
  { name: "Requests", type: "number" },
  { name: "Status", type: "status" }
];

const mixedRows = [
  [
    "Web Server",
    86400000000000,
    "2024-01-15T10:00:00Z",
    true,
    1234567,
    "healthy"
  ],
  ["Database", 172800000000000, "2024-01-15T09:45:00Z", true, 89012, "warning"],
  ["Cache", 43200000000000, "2024-01-15T10:15:00Z", false, 345678, "unhealthy"],
  ["API", 259200000000000, "2024-01-15T08:30:00Z", true, 567890, "healthy"]
];

export const MixedDataTypes: Story = {
  args: {
    columns: mixedColumns,
    rows: mixedRows,
    title: "Service Overview"
  }
};

const emptyColumns: ViewColumnDef[] = [
  { name: "Name", type: "string" },
  { name: "Value", type: "number" },
  { name: "Status", type: "status" }
];

export const EmptyTable: Story = {
  args: {
    columns: emptyColumns,
    rows: [],
    title: "No Data Available"
  }
};

const healthColumns: ViewColumnDef[] = [
  { name: "Component", type: "string" },
  { name: "Health Status", type: "health" },
  { name: "Last Updated", type: "datetime" },
  { name: "Auto Restart", type: "boolean" }
];

const healthRows = [
  ["Frontend", "healthy", "2024-01-15T10:00:00Z", true],
  ["Backend API", "warning", "2024-01-15T09:55:00Z", true],
  ["Database", "unhealthy", "2024-01-15T09:30:00Z", false],
  ["Message Queue", "healthy", "2024-01-15T10:05:00Z", true]
];

export const HealthMonitoring: Story = {
  args: {
    columns: healthColumns,
    rows: healthRows,
    title: "Component Health"
  }
};

const largeDataColumns: ViewColumnDef[] = [
  { name: "ID", type: "string" },
  { name: "Name", type: "string" },
  { name: "Value", type: "number" },
  { name: "Active", type: "boolean" },
  { name: "Created", type: "datetime" }
];

const largeDataRows = Array.from({ length: 50 }, (_, i) => [
  `ID-${String(i + 1).padStart(3, "0")}`,
  `Item ${i + 1}`,
  Math.floor(Math.random() * 1000),
  Math.random() > 0.5,
  new Date(2024, 0, 1 + (i % 30)).toISOString()
]);

export const LargeDataset: Story = {
  args: {
    columns: largeDataColumns,
    rows: largeDataRows,
    title: "Large Dataset (50 rows)"
  }
};
