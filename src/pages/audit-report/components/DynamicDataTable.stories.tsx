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
  {
    Name: "John Doe",
    Age: 30,
    Active: true,
    Created: "2023-01-15T10:00:00Z"
  },
  {
    Name: "Jane Smith",
    Age: 25,
    Active: false,
    Created: "2023-02-20T14:30:00Z"
  },
  {
    Name: "Bob Johnson",
    Age: 35,
    Active: true,
    Created: "2023-03-10T09:15:00Z"
  }
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
  {
    Service: "API Gateway",
    "Response Time": 250000000,
    "CPU Usage": 45,
    Status: "healthy",
    Health: "healthy"
  },
  {
    Service: "Database",
    "Response Time": 150000000,
    "CPU Usage": 78,
    Status: "warning",
    Health: "warning"
  },
  {
    Service: "Cache Service",
    "Response Time": 50000000,
    "CPU Usage": 23,
    Status: "healthy",
    Health: "healthy"
  },
  {
    Service: "Message Queue",
    "Response Time": 300000000,
    "CPU Usage": 92,
    Status: "critical",
    Health: "unhealthy"
  }
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
  {
    Metric: "Server 1",
    "CPU Usage": 45,
    Memory: 8.2,
    "Disk Usage": 450
  },
  {
    Metric: "Server 2",
    "CPU Usage": 78,
    Memory: 12.5,
    "Disk Usage": 720
  },
  {
    Metric: "Server 3",
    "CPU Usage": 23,
    Memory: 4.1,
    "Disk Usage": 280
  },
  {
    Metric: "Server 4",
    "CPU Usage": 92,
    Memory: 15.8,
    "Disk Usage": 980
  }
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
  {
    Service: "Web Server",
    Uptime: 86400000000000,
    "Last Check": "2024-01-15T10:00:00Z",
    Enabled: true,
    Requests: 1234567,
    Status: "healthy"
  },
  {
    Service: "Database",
    Uptime: 172800000000000,
    "Last Check": "2024-01-15T09:45:00Z",
    Enabled: true,
    Requests: 89012,
    Status: "warning"
  },
  {
    Service: "Cache",
    Uptime: 43200000000000,
    "Last Check": "2024-01-15T10:15:00Z",
    Enabled: false,
    Requests: 345678,
    Status: "unhealthy"
  },
  {
    Service: "API",
    Uptime: 259200000000000,
    "Last Check": "2024-01-15T08:30:00Z",
    Enabled: true,
    Requests: 567890,
    Status: "healthy"
  }
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
  {
    Component: "Frontend",
    "Health Status": "healthy",
    "Last Updated": "2024-01-15T10:00:00Z",
    "Auto Restart": true
  },
  {
    Component: "Backend API",
    "Health Status": "warning",
    "Last Updated": "2024-01-15T09:55:00Z",
    "Auto Restart": true
  },
  {
    Component: "Database",
    "Health Status": "unhealthy",
    "Last Updated": "2024-01-15T09:30:00Z",
    "Auto Restart": false
  },
  {
    Component: "Message Queue",
    "Health Status": "healthy",
    "Last Updated": "2024-01-15T10:05:00Z",
    "Auto Restart": true
  }
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

const largeDataRows = Array.from({ length: 50 }, (_, i) => ({
  ID: `ID-${String(i + 1).padStart(3, "0")}`,
  Name: `Item ${i + 1}`,
  Value: Math.floor(Math.random() * 1000),
  Active: Math.random() > 0.5,
  Created: new Date(2024, 0, 1 + (i % 30)).toISOString()
}));

export const LargeDataset: Story = {
  args: {
    columns: largeDataColumns,
    rows: largeDataRows,
    title: "Large Dataset (50 rows)"
  }
};
