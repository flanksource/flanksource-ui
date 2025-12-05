import Convert from "ansi-to-html";
import linkifyHtml from "linkify-html";
import { Opts } from "linkifyjs";
import { useMemo, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PlaybookArtifact,
  CategorizedPlaybookRunAction
} from "../../../../api/types/playbooks";
import TabContentDownloadButton from "./PlaybookResultsDropdownButton";
import { Tab, Tabs } from "../../../../ui/Tabs/Tabs";
import blockKitToMarkdown from "@flanksource-ui/utils/slack";
import { DisplayMarkdown } from "@flanksource-ui/components/Utils/Markdown";
import { downloadArtifact } from "../../../../api/services/artifacts";
import { TbAlertCircle, TbFileDescription } from "react-icons/tb";
import { formatBytes } from "@flanksource-ui/utils/common";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { IoMdDownload } from "react-icons/io";
import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
import { darkTheme } from "@flanksource-ui/ui/Code/JSONViewerTheme";
import path from "path";
import { LogsTable } from "@flanksource-ui/components/Logs/Table/LogsTable";

const options = {
  className: "text-blue-500 hover:underline pointer",
  target: "_blank",
  validate: {
    // we want to linkify only urls that start with http or https
    url: (value) => /^https?:\/\//.test(value)
  }
} satisfies Opts;

const convert = new Convert();

function formatSqlRowsToMarkdown(rows: any[]): string | null {
  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  const headers: string[] = Array.from(
    rows.reduce((acc, row) => {
      if (row && typeof row === "object") {
        Object.keys(row).forEach((key) => acc.add(key));
      }
      return acc;
    }, new Set<string>())
  );

  if (headers.length === 0) {
    return null;
  }

  const headerRow = `| ${headers.join(" | ")} |`;
  const separatorRow = `|${headers.map(() => "--").join("|")}|`;

  const dataRows = rows.map((row) => {
    const values = headers.map((header) => {
      const value = row?.[header];
      if (value === null || value === undefined) {
        return "";
      }
      if (typeof value === "object") {
        return JSON.stringify(value);
      }
      return String(value);
    });
    return `| ${values.join(" | ")} |`;
  });

  return [headerRow, separatorRow, ...dataRows].join("\n");
}

function DisplayLogs({
  logs,
  className
}: {
  logs?: string;
  className?: string;
}) {
  const html = useMemo(() => {
    if (!logs) {
      return null;
    }
    return linkifyHtml(convert.toHtml(logs), options);
  }, [logs]);

  if (!html) {
    return null;
  }

  return (
    <pre
      className={className}
      dangerouslySetInnerHTML={{
        __html: html
      }}
    />
  );
}

type Props = {
  action: CategorizedPlaybookRunAction;
  className?: string;
};

type PlaybookActionTab = {
  label: string;
  type?: "artifact" | "error";
  contentSize?: string;
  content: any;
  artifactID?: string;
  className?: string;
  displayContentType:
    | "text/markdown"
    | "text/x-shellscript"
    | "text/plain"
    | "application/yaml"
    | "application/log+json"
    | "application/json";
};

export default function PlaybooksRunActionsResults({
  action,
  className = "whitespace-pre-wrap break-all"
}: Props) {
  const { result, error, artifacts } = action;
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const activeTabContentRef = useRef<HTMLDivElement>(null);

  const availableTabs = useMemo(() => {
    const tabs: PlaybookActionTab[] = [];
    if (result) {
      // AI action can have a cost
      let actionCost = 0;
      if (action.type === "ai" && result["generationInfo"]) {
        actionCost = (result["generationInfo"] as { cost: number }[]).reduce(
          (acc, info) => acc + info.cost,
          0
        );
      }

      // Result pre-processing based on action type
      switch (action.type) {
        case "notification":
          delete result["title"];
          break;

        case "http":
          result["response"] = {
            code: result["code"],
            headers: result["headers"]
          };
          delete result["code"];
          delete result["headers"];

          break;

        case "exec":
          delete result["path"];

          // Rename args to script
          result["script"] = result["args"];
          delete result["args"];
          break;

        case "ai":
          result["AI"] = result["json"];
          delete result["json"];
          delete result["recommendedPlaybooks"];
          delete result["generationInfo"];

          break;

        case "sql":
          break;

        default:
          break;
      }

      for (const key of Object.keys(result)) {
        if (result[key]) {
          const tab: PlaybookActionTab = {
            label: key.charAt(0).toUpperCase() + key.slice(1),
            content: result[key],
            displayContentType: "text/plain"
          };

          if (actionCost) {
            tab.label = `${tab.label} ($${actionCost.toFixed(2)})`;
          }

          // Pre-process the content for certain types
          switch (key.toLowerCase()) {
            case "slack":
            case "recommendedplaybooks":
              tab.content = blockKitToMarkdown(JSON.parse(tab.content));
              tab.displayContentType = "text/markdown";
              break;

            case "script":
              tab.content = tab.content.join(" ").replace(/^bash -c /, "$ ");
              tab.displayContentType = "text/x-shellscript";
              break;

            case "headers":
              tab.content = JSON.stringify(tab.content, null, 2);
              tab.displayContentType = "application/yaml";
              break;

            case "json":
            case "ai":
              tab.displayContentType = "application/yaml";
              break;

            case "rows":
              if (action.type === "sql") {
                tab.content =
                  formatSqlRowsToMarkdown(result[key]) || "No rows returned";
                tab.displayContentType = "text/markdown";
                tab.className = "overflow-auto whitespace-pre";
              } else if (typeof result[key] === "object") {
                tab.content = JSON.stringify(result[key], null, 2);
                tab.displayContentType = "application/yaml";
              }
              break;

            default:
              if (typeof result[key] === "object") {
                tab.content = JSON.stringify(result[key], null, 2);
                tab.displayContentType = "application/yaml";
              }
          }

          if (key === "error") {
            tab.type = "error";
          }

          tabs.push(tab);
        }
      }
    }

    if (error) {
      const hasErrorTab = tabs.some((tab) => tab.label === "Error");
      if (!hasErrorTab) {
        tabs.push({
          label: "Error",
          type: "error",
          content: error,
          displayContentType: "text/plain"
        });
      }
    }

    if (artifacts && artifacts.length > 0) {
      for (const artifact of artifacts) {
        const filename = path.basename(artifact.path);
        tabs.push({
          label: filename,
          contentSize: formatBytes(artifact.size),
          artifactID: artifact.id,
          type: "artifact",
          content: artifact,
          displayContentType: artifact.content_type as
            | "text/markdown"
            | "text/x-shellscript"
            | "text/plain"
            | "application/yaml"
            | "application/log+json"
            | "application/json"
        });
      }
    }

    const priorityOrder: Record<string, number> = {
      error: 0,
      logs: 1,
      stdout: 1,
      stderr: 2,
      artifacts: 1000, // artifacts at the end,
      metadata: 1001 // logs metadata
    };

    tabs.sort((a, b) => {
      const priorityA = priorityOrder[a.label.toLowerCase()] ?? 999;
      const priorityB = priorityOrder[b.label.toLowerCase()] ?? 999;
      return priorityA - priorityB;
    });

    return tabs;
  }, [result, error, artifacts, action.type]);

  useMemo(() => {
    if (availableTabs.length > 0 && !activeTab) {
      setActiveTab(availableTabs[0].label);
    }
  }, [availableTabs, activeTab]);

  if (availableTabs.length === 0) {
    return <>No result</>;
  }

  return (
    <div className="relative flex h-full w-full flex-col">
      <Tabs
        activeTab={activeTab || "empty"}
        onSelectTab={(tab) => setActiveTab(tab as string)}
        hoverable={false}
        contentClassName="flex-1 overflow-y-auto border border-t-0 border-gray-300 p-4"
      >
        {availableTabs.map((tab) => {
          let label = tab.label;
          if (tab.contentSize) {
            label = `${label} (${tab.contentSize})`;
          }

          return (
            <Tab
              key={tab.label}
              label={label}
              value={tab.label}
              icon={
                tab.type === "artifact" ? (
                  <TbFileDescription className="text-lg" />
                ) : tab.type === "error" ? (
                  <TbAlertCircle className="text-lg" />
                ) : undefined
              }
            >
              <div ref={activeTabContentRef}>
                {renderTabContent(tab, tab.className || className)}
              </div>
            </Tab>
          );
        })}
      </Tabs>

      <TabContentDownloadButton
        activeTab={activeTab || ""}
        artifactID={
          availableTabs.find((tab) => tab.label === activeTab)?.artifactID
        }
        contentType={
          availableTabs.find((tab) => tab.label === activeTab)
            ?.displayContentType
        }
        activeTabContentRef={activeTabContentRef}
      />
    </div>
  );
}

// Helper function to render the appropriate content based on the key
function renderTabContent(tab: PlaybookActionTab, className: string) {
  const { content } = tab;
  if (!content) return null;

  if (tab.type === "artifact") {
    const artifact = content as PlaybookArtifact;
    return <ArtifactContent artifact={artifact} className={className} />;
  }

  return renderContent(tab.label, tab.displayContentType, content, className);
}

function renderContent(
  title: string,
  contentType: string,
  content: any,
  className?: string
) {
  switch (contentType) {
    case "text/plain":
    case "text/x-shellscript":
      return <DisplayLogs className={className} logs={String(content)} />;

    case "text/markdown":
    case "markdown": // for backwards compatibility
      return <DisplayMarkdown className={className} md={content} />;

    case "application/yaml":
    case "application/json":
      return (
        <pre className={className}>
          <JSONViewer
            format="json"
            code={content}
            convertToYaml
            theme={darkTheme}
          />
        </pre>
      );

    case "application/log+json":
      return (
        <LogsTable
          variant="comfortable"
          logs={JSON.parse(content) || []}
          componentId={""}
          theme="dark"
          hideCheckbox
        />
      );

    default:
      throw new Error(
        `Unknown display content type for tab ${title}: ${contentType}`
      );
  }
}

function ArtifactContent({
  artifact,
  className
}: {
  artifact: PlaybookArtifact;
  className?: string;
}) {
  const [error, setError] = useState<string | null>(null);

  const maxFileSize = 50 * 1024 * 1024; // 50MB
  const isSmallFile = artifact.size < maxFileSize;

  const {
    data: artifactContent,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["artifact", artifact.id],
    queryFn: () => downloadArtifact(artifact.id),
    enabled: isSmallFile, // Only fetch if it's a small file
    staleTime: Infinity, // Artifacts don't change once created
    cacheTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
    retry: 1, // Only retry once on failure
    onError: (err) => {
      console.error("Error downloading artifact:", err);
      setError("Failed to download artifact");
    }
  });

  const downloadURL = `/api/artifacts/download/${artifact.id}`;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 overflow-y-auto">{renderArtifactContent()}</div>
    </div>
  );

  function renderArtifactContent() {
    if (!isSmallFile) {
      return (
        <div className="py-8 text-center text-gray-500">
          <p className="mb-4">
            File is too large to preview. Maximum file size is 50MB.
          </p>
          <Button
            onClick={() => {
              window.open(downloadURL, "_blank");
            }}
          >
            <IoMdDownload className="mr-2" />
            Download
          </Button>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading... </span>
        </div>
      );
    }

    if (error || isError) {
      return (
        <div className="text-center text-red-500">
          {error || "Failed to download artifact"}
        </div>
      );
    }

    if (artifactContent) {
      return renderContent(
        artifact.filename,
        artifact.content_type,
        artifactContent,
        className
      );
    }

    return (
      <div className="py-8 text-center text-gray-500">
        Loading file content...
      </div>
    );
  }
}
