import React from "react";
import {
  Save,
  RotateCcw,
  GitCommit,
  AlertOctagon,
  FileSearch
} from "lucide-react";
import { formatDate } from "../utils";

import { formatDistanceToNow, differenceInHours } from "date-fns";
import DataTable from "./DataTable";
import StatusBadge from "./StatusBadge";
import { BackupCalendarHeatmap } from "./BackupCalendarHeatmap";
import { Application, Backup, Incident } from "../types";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import { groupBy } from "lodash";
import { MonitoringSection } from "./sections/MonitoringSection";
import { VersionSection } from "./sections/VersionSection";
import FindingsSection from "./sections/FindingsSection";
import ApplicationDetails from "./sections/ApplicationDetailsSection";
import ApplicationAccessControl from "./sections/AccessControlSection";
import LocationsSection from "./sections/LocationsSection";
import View from "./View/View";

interface ApplicationsSectionProps {
  application: Application;
  printView: boolean;
}

// const TYPE_COLORS = {
//   security: "#ef4444", // red-500
//   compliance: "#3b82f6", // blue-500
//   performance: "#8b5cf6", // purple-500
//   reliability: "#10b981" // emerald-500
// };

const SEVERITY_COLORS = {
  critical: "#ef4444", // red-500
  high: "#f97316", // orange-500
  medium: "#eab308", // yellow-500
  low: "#3b82f6" // blue-500
};

const renderLegend = (props: any) => {
  const { payload } = props;

  return (
    <ul className="mt-2 flex flex-wrap justify-center gap-4 text-sm">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center">
          <span
            className="mr-2 h-3 w-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="capitalize">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

const successStatuses = ["successful", "completed"];

const ApplicationsSection: React.FC<ApplicationsSectionProps> = ({
  application,
  printView
}) => {
  // Calculate backup statistics
  const calculateBackupStats = (backups: Backup[]) => {
    const totalSize = backups.reduce((acc, backup) => {
      const size = parseFloat(backup.size.split(" ")[0]);
      return acc + size;
    }, 0);

    const successCount = backups.filter((b) =>
      successStatuses.includes(b.status.toLowerCase())
    ).length;
    const successRate = (successCount / backups.length) * 100;

    const latestBackupDate = new Date(backups[0].date);
    const backupAge = formatDistanceToNow(latestBackupDate);

    return {
      avgSize: (totalSize / backups.length).toFixed(1),
      successRate: successRate.toFixed(1),
      backupAge
    };
  };

  // Calculate incident statistics
  const calculateIncidentStats = (incidents: Incident[]) => {
    const openIncidents = incidents.filter((i) => !i.resolvedDate);
    const openBySeverity = groupBy(openIncidents, "severity");

    const resolutionTimes = incidents
      .filter((i) => i.resolvedDate)
      .map((i) => ({
        duration: differenceInHours(new Date(i.resolvedDate!), new Date(i.date))
      }));

    const avgResolutionTime =
      resolutionTimes.length > 0
        ? (
            resolutionTimes.reduce((acc, curr) => acc + curr.duration, 0) /
            resolutionTimes.length
          ).toFixed(1)
        : 0;

    const incidentsByType = Object.entries(groupBy(incidents, "severity")).map(
      ([severity, items]) => ({
        severity,
        value: items.length
      })
    );

    return {
      openBySeverity,
      avgResolutionTime,
      incidentsByType
    };
  };

  const backupStats = application.backups
    ? calculateBackupStats(application.backups)
    : null;
  const incidentStats = application.incidents
    ? calculateIncidentStats(application.incidents)
    : null;
  // const latestBackup = application.backups[0];
  // const latestRestore = application.restores[0];
  // const latestIncident = application.incidents[0];

  const calculateDuration = (start: string, end?: string) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const hours = differenceInHours(endDate, startDate);

    if (hours < 24) {
      return `${hours}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  };

  const changeColumns = [
    { header: "Change ID", accessor: "id" },
    {
      header: "Date",
      accessor: "date",
      render: (value: string) => formatDate(value)
    },
    { header: "User", accessor: "user" },
    { header: "Description", accessor: "description" },
    {
      header: "Status",
      accessor: "status",
      render: (value: string) => (
        <StatusBadge status={value as any} printView={printView} />
      )
    }
  ];

  const incidentColumns = [
    {
      header: "Date",
      accessor: "date",
      render: (value: string) => formatDate(value)
    },
    {
      header: "Severity",
      accessor: "severity",
      render: (value: string) => (
        <StatusBadge status={value as any} printView={printView} />
      )
    },
    { header: "Description", accessor: "description" },
    {
      header: "Status",
      accessor: "status",
      render: (value: string) => (
        <StatusBadge status={value as any} printView={printView} />
      )
    },
    {
      header: "Duration",
      accessor: "date",
      render: (value: string, incident: Incident) =>
        calculateDuration(value, incident.resolvedDate)
    },
    {
      header: "Resolved Date",
      accessor: "resolvedDate",
      render: (value: string) => (value ? formatDate(value) : "-")
    }
  ];

  const backupColumns = [
    { header: "Database", accessor: "database" },
    {
      header: "Date",
      accessor: "date",
      render: (value: string) => formatDate(value)
    },
    { header: "Size", accessor: "size" },
    {
      header: "Status",
      accessor: "status",
      render: (value: string) => (
        <StatusBadge status={value as any} printView={printView} />
      )
    },
    { header: "Source", accessor: "source" },
    {
      header: "Error",
      accessor: "error",
      render: (value: string) => value || "-"
    }
  ];

  const restoreColumns = [
    { header: "Database", accessor: "database" },
    {
      header: "Date",
      accessor: "date",
      render: (value: string) => formatDate(value)
    },
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
      render: (value: string) => (value ? formatDate(value) : "-")
    }
  ];

  const assessmentColumns = [
    { header: "Name", accessor: "name" },
    { header: "Type", accessor: "type" },
    {
      header: "Assessor",
      accessor: "assesor",
      render: (value: any) => value?.name || "-"
    },
    {
      header: "Date",
      accessor: "date",
      render: (value: string) => formatDate(value)
    },
    {
      header: "Expiry",
      accessor: "expiry",
      render: (value: string) => formatDate(value)
    },
    {
      header: "Findings",
      accessor: "findings",
      render: (value: any) => (
        <div className="space-x-2">
          <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
            {value.high} High
          </span>
          <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
            {value.medium} Medium
          </span>
          <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
            {value.low} Low
          </span>
        </div>
      )
    },
    {
      header: "Unresolved",
      accessor: "unresolved",
      render: (value: any) => (
        <div className="space-x-2">
          {value.high > 0 && (
            <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
              {value.high} High
            </span>
          )}
          {value.low > 0 && (
            <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
              {value.low} Low
            </span>
          )}
          {value.high === 0 && value.low === 0 && (
            <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
              All Resolved
            </span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="applications-section space-y-8">
      <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <ApplicationDetails application={application} />

        <ApplicationAccessControl accessControl={application.accessControl} />

        {application.changes && (
          <>
            <div>
              <h3 className="mb-4 flex items-center text-xl font-semibold">
                <GitCommit className="mr-2 text-teal-600" size={20} />
                Changes
              </h3>
              <DataTable columns={changeColumns} data={application.changes} />
            </div>
            <hr className="border-gray-200" />
          </>
        )}

        {incidentStats && application.incidents && (
          <>
            <div>
              <h3 className="mb-4 flex items-center text-xl font-semibold">
                <AlertOctagon className="mr-2 text-teal-600" size={20} />
                Incidents
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h4 className="mb-4 text-sm font-medium text-gray-600">
                      Open Incidents by Severity
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(incidentStats.openBySeverity).map(
                        ([severity, incidents]) => (
                          <div
                            key={severity}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <span
                                className="mr-2 h-3 w-3 rounded-full"
                                style={{
                                  backgroundColor:
                                    SEVERITY_COLORS[
                                      severity as keyof typeof SEVERITY_COLORS
                                    ]
                                }}
                              />
                              <span className="text-sm capitalize text-gray-600">
                                {severity}
                              </span>
                            </div>
                            <span className="text-sm font-medium">
                              {incidents.length}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h4 className="mb-2 text-sm font-medium text-gray-600">
                      Average Resolution Time
                    </h4>
                    <p className="text-2xl font-semibold text-teal-600">
                      {incidentStats.avgResolutionTime}h
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h4 className="mb-2 text-sm font-medium text-gray-600">
                      Incidents by Type
                    </h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={incidentStats.incidentsByType}
                            dataKey="value"
                            nameKey="severity"
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            label
                          >
                            {incidentStats.incidentsByType.map((entry) => (
                              <Cell
                                key={entry.severity}
                                fill={
                                  SEVERITY_COLORS[
                                    entry.severity as keyof typeof SEVERITY_COLORS
                                  ]
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend content={renderLegend} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                <DataTable
                  columns={incidentColumns}
                  data={application.incidents}
                />
              </div>
            </div>
            <hr className="border-gray-200" />
          </>
        )}

        {backupStats && application.backups && (
          <>
            <div>
              <h3 className="mb-4 flex items-center text-xl font-semibold">
                <Save className="mr-2 text-teal-600" size={20} />
                Recent Backups
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
                  <div className="max-w-[16rem] rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h4 className="mb-2 text-sm font-medium text-gray-600">
                      Average Backup Size
                    </h4>
                    <p className="text-2xl font-semibold text-teal-600">
                      {backupStats.avgSize} GB
                    </p>
                  </div>
                  <div className="max-w-[16rem] rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h4 className="mb-2 text-sm font-medium text-gray-600">
                      Backup Success Rate
                    </h4>
                    <p className="text-2xl font-semibold text-teal-600">
                      {backupStats.successRate}%
                    </p>
                  </div>
                  <div className="max-w-[16rem] rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h4 className="mb-2 text-sm font-medium text-gray-600">
                      Last Backup Age
                    </h4>
                    <p className="text-2xl font-semibold text-teal-600">
                      {backupStats.backupAge}
                    </p>
                  </div>
                </div>
                <BackupCalendarHeatmap
                  backups={application.backups}
                  className="mb-6"
                />
                <DataTable columns={backupColumns} data={application.backups} />
              </div>
            </div>
            <hr className="border-gray-200" />
          </>
        )}

        {application.restores && (
          <>
            <div>
              <h3 className="mb-4 flex items-center text-xl font-semibold">
                <RotateCcw className="mr-2 text-teal-600" size={20} />
                Recent Restores
              </h3>
              <DataTable columns={restoreColumns} data={application.restores} />
            </div>
            <hr className="border-gray-200" />
          </>
        )}

        {application.assessments && (
          <>
            <div>
              <h3 className="mb-4 flex items-center text-xl font-semibold">
                <FileSearch className="mr-2 text-teal-600" size={20} />
                Security Assessments
              </h3>
              <DataTable
                columns={assessmentColumns}
                data={application.assessments}
              />
            </div>
            <hr className="border-gray-200" />
          </>
        )}

        <FindingsSection application={application} printView={printView} />
        <MonitoringSection application={application} />
        <VersionSection application={application} />

        {application.sections?.map((section) => (
          <View
            key={section.title}
            title={section.title}
            icon={section.icon}
            view={section.result}
          />
        ))}

        <LocationsSection locations={application.locations || []} />
      </div>
    </div>
  );
};

export default ApplicationsSection;
