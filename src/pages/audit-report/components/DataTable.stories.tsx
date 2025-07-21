import type { Meta, StoryObj } from "@storybook/react";
import DataTable from "./DataTable";
import StatusBadge from "./StatusBadge";

const meta: Meta<typeof DataTable> = {
  title: "Audit Report/Components/DataTable",
  component: DataTable,
  parameters: {
    layout: "padded"
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Admin",
    created: "2023-01-15",
    lastLogin: "2024-01-15",
    lastAccessReview: "2023-12-01"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    role: "Developer",
    created: "2023-03-20",
    lastLogin: "2024-01-14",
    lastAccessReview: "2023-11-15"
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@company.com",
    role: "Viewer",
    created: "2023-06-10",
    lastLogin: "2024-01-10",
    lastAccessReview: "2023-12-20"
  }
];

const userColumns = [
  { header: "Name", accessor: "name" },
  { header: "Email", accessor: "email" },
  { header: "Role", accessor: "role" },
  { header: "Created", accessor: "created" },
  { header: "Last Login", accessor: "lastLogin" },
  { header: "Last Access Review", accessor: "lastAccessReview" }
];

const sampleIncidents = [
  {
    id: "INC-001",
    date: "2024-01-10",
    severity: "high",
    description: "Payment processing service outage",
    status: "resolved",
    resolvedDate: "2024-01-10"
  },
  {
    id: "INC-002",
    date: "2024-01-12",
    severity: "medium",
    description: "Slow database queries affecting performance",
    status: "investigating",
    resolvedDate: null
  },
  {
    id: "INC-003",
    date: "2024-01-08",
    severity: "low",
    description: "Minor UI glitch in user dashboard",
    status: "resolved",
    resolvedDate: "2024-01-09"
  }
];

const incidentColumns = [
  { header: "ID", accessor: "id" },
  { header: "Date", accessor: "date" },
  {
    header: "Severity",
    accessor: "severity",
    render: (value: string) => (
      <StatusBadge status={value as any} printView={false} />
    )
  },
  { header: "Description", accessor: "description" },
  {
    header: "Status",
    accessor: "status",
    render: (value: string) => (
      <StatusBadge status={value as any} printView={false} />
    )
  },
  {
    header: "Resolved Date",
    accessor: "resolvedDate",
    render: (value: string) => value || "-"
  }
];

const sampleBackups = [
  {
    id: "BKP-001",
    database: "ecommerce_prod",
    date: "2024-01-15",
    size: "15.2 GB",
    status: "Successful",
    source: "Automated",
    error: null
  },
  {
    id: "BKP-002",
    database: "ecommerce_analytics",
    date: "2024-01-15",
    size: "8.7 GB",
    status: "Completed",
    source: "Automated",
    error: null
  },
  {
    id: "BKP-003",
    database: "ecommerce_logs",
    date: "2024-01-14",
    size: "3.1 GB",
    status: "Failed",
    source: "Manual",
    error: "Disk space insufficient"
  }
];

const backupColumns = [
  { header: "Database", accessor: "database" },
  { header: "Date", accessor: "date" },
  { header: "Size", accessor: "size" },
  {
    header: "Status",
    accessor: "status",
    render: (value: string) => (
      <StatusBadge status={value as any} printView={false} />
    )
  },
  { header: "Source", accessor: "source" },
  {
    header: "Error",
    accessor: "error",
    render: (value: string) => value || "-"
  }
];

export const UsersTable: Story = {
  args: {
    columns: userColumns,
    data: sampleUsers,
    title: "User Management"
  }
};

export const IncidentsTable: Story = {
  args: {
    columns: incidentColumns,
    data: sampleIncidents,
    title: "Recent Incidents"
  }
};

export const BackupsTable: Story = {
  args: {
    columns: backupColumns,
    data: sampleBackups,
    title: "Backup History"
  }
};

export const EmptyTable: Story = {
  args: {
    columns: userColumns,
    data: [],
    title: "Empty Data Table"
  }
};

export const SimpleTable: Story = {
  args: {
    columns: [
      { header: "Name", accessor: "name" },
      { header: "Value", accessor: "value" }
    ],
    data: [
      { name: "CPU Usage", value: "45%" },
      { name: "Memory Usage", value: "67%" },
      { name: "Disk Usage", value: "23%" },
      { name: "Network I/O", value: "12 MB/s" }
    ]
  }
};

export const LargeDataset: Story = {
  args: {
    columns: userColumns,
    data: Array.from({ length: 50 }, (_, i) => ({
      id: `${i + 1}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@company.com`,
      role: ["Admin", "Developer", "Viewer"][i % 3],
      created: `2023-${String(Math.floor(i / 12) + 1).padStart(2, "0")}-${String((i % 12) + 1).padStart(2, "0")}`,
      lastLogin: `2024-01-${String((i % 30) + 1).padStart(2, "0")}`,
      lastAccessReview: `2023-${String(Math.floor(i / 12) + 1).padStart(2, "0")}-15`
    })),
    title: "Large User Dataset"
  }
};
