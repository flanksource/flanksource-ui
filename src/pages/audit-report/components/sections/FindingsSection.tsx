import React from "react";
import {
  AlertCircle,
  Shield,
  FileSearch,
  Activity,
  HardDrive
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import Section from "../Section";
import DataTable from "../DataTable";
import StatusBadge from "../StatusBadge";
import { formatDate } from "../../utils";
import { Application } from "../../types";
import { groupBy } from "lodash";

const TYPE_COLORS = {
  security: "#ef4444", // red-500
  compliance: "#3b82f6", // blue-500
  performance: "#8b5cf6", // purple-500
  reliability: "#10b981" // emerald-500
};

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

interface FindingsSectionProps {
  application: Application;
  printView: boolean;
}

const FindingsSection: React.FC<FindingsSectionProps> = ({
  application,
  printView
}) => {
  if (!application.findings) return null;
  const findingColumns = [
    {
      header: "Type",
      accessor: "type",
      render: (value: string) => {
        const getTypeIcon = (type: string) => {
          switch (type) {
            case "security":
              return <Shield size={16} className="text-gray-500" />;
            case "compliance":
              return <FileSearch size={16} className="text-gray-500" />;
            case "performance":
              return <Activity size={16} className="text-gray-500" />;
            case "reliability":
              return <HardDrive size={16} className="text-gray-500" />;
            default:
              return <AlertCircle size={16} className="text-gray-500" />;
          }
        };

        return (
          <span className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
            {getTypeIcon(value)}
            <span className="capitalize">{value}</span>
          </span>
        );
      }
    },
    {
      header: "Severity",
      accessor: "severity",
      render: (value: string) => (
        <StatusBadge status={value as any} printView={printView} />
      )
    },
    { header: "Title", accessor: "title" },
    { header: "Description", accessor: "description" },
    {
      header: "First Observed",
      accessor: "date",
      render: (value: string) => formatDate(value)
    },
    {
      header: "Last Observed",
      accessor: "lastObserved",
      render: (value: string) => formatDate(value)
    },
    {
      header: "Status",
      accessor: "status",
      render: (value: string) => (
        <span
          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
            value === "open"
              ? "bg-red-100 text-red-800"
              : value === "resolved"
                ? "bg-green-100 text-green-800"
                : value === "in-progress"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
          }`}
        >
          <span className="capitalize">{value}</span>
        </span>
      )
    }
  ];

  return (
    <Section title="Security Findings" icon={AlertCircle}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-4 text-sm font-medium text-gray-600">
              Findings by Type
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(
                      groupBy(application.findings, "type")
                    ).map(([type, items]) => ({
                      type,
                      value: items.length
                    }))}
                    dataKey="value"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label
                  >
                    {Object.entries(TYPE_COLORS).map(([type, color]) => (
                      <Cell key={type} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend content={renderLegend} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-4 text-sm font-medium text-gray-600">
              Findings by Severity
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(
                      groupBy(application.findings, "severity")
                    ).map(([severity, items]) => ({
                      severity,
                      value: items.length
                    }))}
                    dataKey="value"
                    nameKey="severity"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label
                  >
                    {Object.entries(SEVERITY_COLORS).map(
                      ([severity, color]) => (
                        <Cell key={severity} fill={color} />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                  <Legend content={renderLegend} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <DataTable columns={findingColumns} data={application.findings} />
      </div>
      <hr className="border-gray-200" />
    </Section>
  );
};

export default FindingsSection;
