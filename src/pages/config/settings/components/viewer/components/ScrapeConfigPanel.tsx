import { useState, useMemo } from "react";
import { JsonView } from "./JsonView";
import type { PropertyInfo, LogLevelInfo } from "../types";

interface Props {
  spec: any;
  properties?: Record<string, PropertyInfo>;
  logLevel?: LogLevelInfo;
}

function formatDecimal(value: number): string {
  return value
    .toFixed(2)
    .replace(/\.0+$/, "")
    .replace(/(\.\d*[1-9])0+$/, "$1");
}

function formatValue(val: any, type?: string): string {
  if (val === null || val === undefined) return "";
  if (type === "duration" && typeof val === "number") {
    // Go's time.Duration serializes as nanoseconds
    const ms = val / 1e6;
    if (ms < 1000) return `${formatDecimal(ms)}ms`;
    const secs = ms / 1000;
    if (secs < 60) return `${formatDecimal(secs)}s`;
    const mins = secs / 60;
    if (mins < 60) return `${formatDecimal(mins)}m`;
    return `${formatDecimal(mins / 60)}h`;
  }
  if (type === "bool") return val ? "on" : "off";
  return String(val);
}

function isOverridden(prop: PropertyInfo): boolean {
  if (prop.value === null || prop.value === undefined) return false;
  return String(prop.value) !== String(prop.default);
}

const typeBadgeColors: Record<string, string> = {
  bool: "bg-purple-100 text-purple-700",
  int: "bg-blue-100 text-blue-700",
  duration: "bg-teal-100 text-teal-700",
  string: "bg-gray-100 text-gray-600"
};

export function ScrapeConfigPanel({ spec, properties, logLevel }: Props) {
  const [propFilter, setPropFilter] = useState("");

  const sortedProps = useMemo(() => {
    if (!properties) return [];
    return Object.entries(properties)
      .map(([key, info]) => ({ key, ...info }))
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [properties]);

  const filteredProps = useMemo(() => {
    if (!propFilter) return sortedProps;
    const q = propFilter.toLowerCase();
    return sortedProps.filter(
      (p) =>
        p.key.toLowerCase().includes(q) ||
        formatValue(p.value, p.type).toLowerCase().includes(q)
    );
  }, [sortedProps, propFilter]);

  const hasLogLevel = !!(logLevel?.scraper || logLevel?.global);
  const hasContent = !!spec || sortedProps.length > 0 || hasLogLevel;
  if (!hasContent) {
    return (
      <div className="p-8 text-center text-sm text-gray-400">
        No scrape configuration available
      </div>
    );
  }

  return (
    <div className="h-full space-y-4 overflow-auto p-4">
      {/* Log Levels */}
      {hasLogLevel && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-700">
            Log Level
          </h3>
          <div className="flex items-center gap-3">
            {logLevel.scraper && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-sm text-amber-800">
                <iconify-icon icon="codicon:file-code" className="text-xs" />
                Scraper: <span className="font-medium">{logLevel.scraper}</span>
              </span>
            )}
            {logLevel.global && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-sm text-blue-800">
                <iconify-icon icon="codicon:globe" className="text-xs" />
                Global: <span className="font-medium">{logLevel.global}</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Properties Table */}
      {sortedProps.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">
              Properties
              <span className="ml-1.5 text-xs font-normal text-gray-400">
                ({sortedProps.length})
              </span>
            </h3>
            <div className="relative">
              <iconify-icon
                icon="codicon:search"
                className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400"
              />
              <input
                type="text"
                placeholder="Filter properties..."
                value={propFilter}
                onInput={(e) =>
                  setPropFilter((e.target as HTMLInputElement).value)
                }
                className="w-48 rounded border border-gray-300 py-1 pl-6 pr-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="overflow-hidden rounded border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-gray-500">
                  <th className="px-3 py-1.5 font-medium">Key</th>
                  <th className="px-3 py-1.5 font-medium">Value</th>
                  <th className="px-3 py-1.5 font-medium">Default</th>
                  <th className="w-16 px-3 py-1.5 font-medium">Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredProps.map((prop) => {
                  const overridden = isOverridden(prop);
                  return (
                    <tr
                      key={prop.key}
                      className={`border-b last:border-0 ${overridden ? "bg-green-50" : ""}`}
                    >
                      <td className="px-3 py-1.5 font-mono text-gray-800">
                        {prop.key}
                      </td>
                      <td
                        className={`px-3 py-1.5 font-mono ${overridden ? "font-medium text-green-700" : "text-gray-500"}`}
                      >
                        {formatValue(prop.value, prop.type) || (
                          <span className="italic text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-3 py-1.5 font-mono text-gray-400">
                        {formatValue(prop.default, prop.type)}
                      </td>
                      <td className="px-3 py-1.5">
                        {prop.type && (
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${typeBadgeColors[prop.type] || "bg-gray-100 text-gray-600"}`}
                          >
                            {prop.type}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredProps.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-4 text-center text-gray-400"
                    >
                      No matching properties
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Scrape Configuration */}
      {spec && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-700">
            Scrape Configuration
          </h3>
          <div className="overflow-x-auto rounded border bg-gray-50 p-3">
            <JsonView data={spec} />
          </div>
        </div>
      )}
    </div>
  );
}
