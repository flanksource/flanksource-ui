import Convert from "ansi-to-html";
import linkifyHtml from "linkify-html";
import Linkify from "linkify-react";
import { Opts } from "linkifyjs";
import { useMemo, useState } from "react";
import {
  PlaybookRunAction,
  PlaybookSpec,
  PlaybookArtifact
} from "../../../../api/types/playbooks";
import PlaybookResultsDropdownButton from "./PlaybookResultsDropdownButton";
import { Tab, Tabs } from "../../../../ui/Tabs/Tabs";
import blockKitToMarkdown from "@flanksource-ui/utils/slack";
import { DisplayMarkdown } from "@flanksource-ui/components/Utils/Markdown";
import { downloadArtifact } from "../../../../api/services/artifacts";
import { TbFileDescription } from "react-icons/tb";

const options = {
  className: "text-blue-500 hover:underline pointer",
  target: "_blank",
  validate: {
    // we want to linkify only urls that start with http or https
    url: (value) => /^https?:\/\//.test(value)
  }
} satisfies Opts;

const convert = new Convert();

function DisplayStdout({
  stdout,
  className
}: {
  stdout?: string;
  className?: string;
}) {
  const html = useMemo(() => {
    if (!stdout) {
      return null;
    }
    return linkifyHtml(convert.toHtml(stdout), options);
  }, [stdout]);

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

function DisplayStderr({
  stderr,
  className
}: {
  stderr?: string;
  className?: string;
}) {
  const html = useMemo(() => {
    if (!stderr) {
      return null;
    }
    return linkifyHtml(convert.toHtml(stderr), options);
  }, [stderr]);

  if (!html) {
    return null;
  }

  return (
    <pre
      className={` ${className}`}
      dangerouslySetInnerHTML={{
        __html: html
      }}
    />
  );
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
  action: Pick<
    PlaybookRunAction,
    "result" | "error" | "id" | "playbook_run_id" | "start_time" | "artifacts"
  >;
  className?: string;
  playbook: Pick<PlaybookSpec, "name">;
};

type PlaybookActionTab = {
  label: string;
  value: string;
  hasContent: boolean;
  icon?: React.ReactNode;
};

export default function PlaybooksRunActionsResults({
  action,
  className = "whitespace-pre-wrap break-all",
  playbook
}: Props) {
  const { result, error, artifacts } = action;
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const availableTabs = useMemo(() => {
    if (!result) return [];

    const tabs: PlaybookActionTab[] = Object.keys(result)
      .filter((key) => result[key])
      .map((key) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: key,
        hasContent: !!result[key]
      }));

    if (artifacts && artifacts.length > 0) {
      tabs.push({
        label: "Artifacts",
        value: "artifacts",
        hasContent: true,
        icon: <TbFileDescription className="text-lg" />
      });
    }

    const priorityOrder: Record<string, number> = {
      stdout: 0, // always the first tab (if present)
      stderr: 1,
      artifacts: 1000 // artifacts at the end
    };

    tabs.sort((a, b) => {
      const priorityA = priorityOrder[a.value.toLowerCase()] ?? 999;
      const priorityB = priorityOrder[b.value.toLowerCase()] ?? 999;
      return priorityA - priorityB;
    });

    return tabs;
  }, [result, artifacts]);

  useMemo(() => {
    if (availableTabs.length > 0 && !activeTab) {
      setActiveTab(availableTabs[0].value);
    }
  }, [availableTabs, activeTab]);

  if (!result && !error) {
    return <>No result</>;
  }

  if (error) {
    return (
      <div className="relative flex h-full w-full flex-col">
        <pre className={className}>{error}</pre>
        <PlaybookResultsDropdownButton action={action} playbook={playbook} />
      </div>
    );
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
          const label = tab.label === "Args" ? "Script" : tab.label;
          return (
            <Tab
              key={tab.value}
              label={label}
              value={tab.value}
              icon={tab.icon}
            >
              {tab.value === "artifacts"
                ? renderTabContent(tab.value, artifacts, className)
                : renderTabContent(tab.value, result?.[tab.value], className)}
            </Tab>
          );
        })}
      </Tabs>
      <PlaybookResultsDropdownButton action={action} playbook={playbook} />
    </div>
  );
}

// Helper function to render the appropriate content based on the key
function renderTabContent(key: string, content: any, className: string) {
  if (!content) return null;

  switch (key.toLowerCase()) {
    case "stdout":
      return <DisplayStdout className={className} stdout={content} />;
    case "stderr":
      return <DisplayStderr className={className} stderr={content} />;
    case "logs":
      return <DisplayLogs className={className} logs={content} />;
    case "recommendedplaybooks":
    case "slack":
      return (
        <DisplayMarkdown
          className={className}
          md={blockKitToMarkdown(JSON.parse(content))}
        />
      );
    case "json":
      return (
        <pre className={className}>
          <Linkify as="p" options={options}>
            {JSON.stringify(JSON.parse(content), null, 2)}
          </Linkify>
        </pre>
      );
    case "args":
      var args = content as string[];
      return (
        <pre className={className}>
          <Linkify as="p" options={options}>
            {args.join(" ").replace(/^bash -c /, "$ ")}
          </Linkify>
        </pre>
      );
    case "headers":
      return (
        <pre className={className}>
          <Linkify as="p" options={options}>
            {JSON.stringify(content, null, 2)}
          </Linkify>
        </pre>
      );
    case "artifacts":
      const artifacts = content as PlaybookArtifact[];
      return <ArtifactContent artifacts={artifacts} className={className} />;
    default:
      return <DisplayMarkdown className={className} md={content} />;
  }
}

function ArtifactContent({
  artifacts,
  className
}: {
  artifacts: PlaybookArtifact[];
  className?: string;
}) {
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(
    null
  );
  const [artifactContent, setArtifactContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleViewContent = async (artifactId: string) => {
    if (selectedArtifactId === artifactId && artifactContent) {
      return;
    }

    setSelectedArtifactId(artifactId);
    setIsLoading(true);
    setError(null);

    try {
      const content = await downloadArtifact(artifactId);
      setArtifactContent(content);
    } catch (err) {
      console.error("Error fetching artifact content:", err);
      setError("Failed to load artifact content");
      setArtifactContent(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full">
      {/* Left sidebar with artifact list */}
      <div className="w-1/6 overflow-y-auto border-r border-gray-200 pr-4">
        <div className="flex flex-col space-y-2">
          {artifacts.map((artifact) => (
            <button
              key={artifact.id}
              onClick={() => handleViewContent(artifact.id)}
              className={`rounded p-3 text-left text-sm`}
            >
              <div
                className={`truncate font-medium ${
                  selectedArtifactId === artifact.id
                    ? "text-blue-500"
                    : "text-white-800"
                }`}
              >
                {artifact.filename}
                <div className="text-xs">{artifact.content_type}</div>
                <div className="text-xs">
                  {(artifact.size / 1024).toFixed(2)} KB
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right content area */}
      <div className="w-5/6 overflow-y-auto pl-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-500"></div>
            <span className="ml-2">Loading...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : artifactContent && selectedArtifactId ? (
          <DisplayMarkdown className={className} md={artifactContent} />
        ) : (
          <div className="py-8 text-center text-gray-500">
            Click on an artifact to view its content
          </div>
        )}
      </div>
    </div>
  );
}
