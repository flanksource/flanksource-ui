import type { Meta, StoryObj } from "@storybook/react";
import { BackupCalendarHeatmap } from "./BackupCalendarHeatmap";
import { Backup } from "../types";

const meta: Meta<typeof BackupCalendarHeatmap> = {
  title: "Audit Report/Components/BackupCalendarHeatmap",
  component: BackupCalendarHeatmap,
  parameters: {
    layout: "padded"
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const generateBackupData = (
  databases: string[],
  daysBack: number = 365,
  successRate: number = 0.9
): Backup[] => {
  const backups: Backup[] = [];
  const today = new Date();

  for (let i = 0; i < daysBack; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    databases.forEach((database, dbIndex) => {
      if (Math.random() > 0.3) {
        const isSuccessful = Math.random() < successRate;
        backups.push({
          id: `BKP-${i}-${dbIndex}`,
          database,
          date: date.toISOString(),
          size: `${(Math.random() * 20 + 1).toFixed(1)} GB`,
          status: isSuccessful
            ? Math.random() > 0.5
              ? "Successful"
              : "Completed"
            : "Failed",
          error: isSuccessful ? undefined : "Backup failed due to timeout"
        });
      }
    });
  }

  return backups;
};

const sampleBackups: Backup[] = [
  {
    id: "BKP-001",
    database: "ecommerce_prod",
    date: "2024-01-15T02:00:00Z",
    size: "15.2 GB",
    status: "Successful"
  },
  {
    id: "BKP-002",
    database: "ecommerce_analytics",
    date: "2024-01-15T02:30:00Z",
    size: "8.7 GB",
    status: "Completed"
  },
  {
    id: "BKP-003",
    database: "ecommerce_logs",
    date: "2024-01-14T02:00:00Z",
    size: "3.1 GB",
    status: "Failed",
    error: "Disk space insufficient"
  },
  {
    id: "BKP-004",
    database: "ecommerce_prod",
    date: "2024-01-14T02:00:00Z",
    size: "15.0 GB",
    status: "Successful"
  },
  {
    id: "BKP-005",
    database: "ecommerce_analytics",
    date: "2024-01-13T02:30:00Z",
    size: "8.5 GB",
    status: "Completed"
  },
  {
    id: "BKP-006",
    database: "ecommerce_prod",
    date: "2024-01-13T02:00:00Z",
    size: "14.8 GB",
    status: "Failed",
    error: "Network timeout"
  }
];

export const Default: Story = {
  args: {
    backups: sampleBackups
  }
};

export const SingleDatabase: Story = {
  args: {
    backups: generateBackupData(["production_db"], 90, 0.95)
  }
};

export const MultipleDatabases: Story = {
  args: {
    backups: generateBackupData(
      ["ecommerce_prod", "ecommerce_analytics", "ecommerce_logs", "user_data"],
      180,
      0.85
    )
  }
};

export const HighFailureRate: Story = {
  args: {
    backups: generateBackupData(["unstable_db"], 60, 0.4)
  }
};

export const PerfectBackups: Story = {
  args: {
    backups: generateBackupData(["reliable_db"], 90, 1.0)
  }
};

export const SparseBackups: Story = {
  args: {
    backups: [
      {
        id: "BKP-001",
        database: "occasional_db",
        date: "2024-01-01T02:00:00Z",
        size: "5.0 GB",
        status: "Successful"
      },
      {
        id: "BKP-002",
        database: "occasional_db",
        date: "2024-01-07T02:00:00Z",
        size: "5.2 GB",
        status: "Failed",
        error: "Connection lost"
      },
      {
        id: "BKP-003",
        database: "occasional_db",
        date: "2024-01-14T02:00:00Z",
        size: "5.1 GB",
        status: "Successful"
      }
    ]
  }
};

export const EmptyBackups: Story = {
  args: {
    backups: []
  }
};

export const YearLongHistory: Story = {
  args: {
    backups: generateBackupData(["main_db", "analytics_db"], 365, 0.92)
  }
};
