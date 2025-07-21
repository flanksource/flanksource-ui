import React from "react";
import { Database } from "lucide-react";
import DataTable from "./DataTable";
import StatusBadge from "./StatusBadge";
import { databaseUsers, backups, restores } from "../data/mockData";

interface DatabasesSectionProps {
  printView: boolean;
}

const DatabasesSection: React.FC<DatabasesSectionProps> = ({ printView }) => {
  const dbUserColumns = [
    { header: "Name", accessor: "name" },
    { header: "Database", accessor: "database" },
    { header: "Role", accessor: "role" },
    { header: "Created", accessor: "created" },
    { header: "Last Login", accessor: "lastLogin" },
    { header: "Last Access Review", accessor: "lastAccessReview" }
  ];

  const backupColumns = [
    { header: "Database", accessor: "database" },
    { header: "Date", accessor: "date" },
    { header: "Size", accessor: "size" },
    {
      header: "Status",
      accessor: "status",
      render: (value: string) => (
        <StatusBadge status={value as any} printView={printView} />
      )
    },
    {
      header: "Error",
      accessor: "error",
      render: (value: string) => value || "-"
    }
  ];

  const restoreColumns = [
    { header: "Database", accessor: "database" },
    { header: "Date", accessor: "date" },
    { header: "Source", accessor: "source" },
    {
      header: "Status",
      accessor: "status",
      render: (value: string) => (
        <StatusBadge status={value as any} printView={printView} />
      )
    },
    {
      header: "Completed Date",
      accessor: "completedDate",
      render: (value: string) => value || "-"
    }
  ];

  return (
    <div className="databases-section space-y-8">
      <h2 className="mb-6 flex items-center text-2xl font-semibold">
        <Database className="mr-2 text-teal-600" size={24} />
        Databases
      </h2>

      <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold">Database Security Overview</h3>

        <div>
          <h4 className="mb-3 text-lg font-medium">Database Users & Roles</h4>
          <DataTable columns={dbUserColumns} data={databaseUsers} />
        </div>

        <hr className="border-gray-200" />

        <div>
          <h4 className="mb-3 text-lg font-medium">Recent Backups</h4>
          <DataTable columns={backupColumns} data={backups} />
        </div>

        <hr className="border-gray-200" />

        <div>
          <h4 className="mb-3 text-lg font-medium">Recent Restores</h4>
          <DataTable columns={restoreColumns} data={restores} />
        </div>
      </div>
    </div>
  );
};

export default DatabasesSection;
