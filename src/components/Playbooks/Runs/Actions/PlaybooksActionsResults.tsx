import Convert from "ansi-to-html";
import linkifyHtml from "linkify-html";
import Linkify from "linkify-react";
import { Opts } from "linkifyjs";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { formatBytes } from "@flanksource-ui/utils/common";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { IoMdDownload } from "react-icons/io";

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
  isArtifact?: boolean;
  content: any;
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
        content: result[key]
      }));

    if (artifacts && artifacts.length > 0) {
      for (const artifact of artifacts) {
        tabs.push({
          label: `${artifact.filename} (${formatBytes(artifact.size)})`,
          value: artifact.id,
          isArtifact: true,
          content: artifact
        });
      }
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
              icon={
                tab.isArtifact ? (
                  <TbFileDescription className="text-lg" />
                ) : undefined
              }
            >
              {tab.isArtifact
                ? renderTabContent("artifacts", tab.content, className)
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
      const artifact = content as PlaybookArtifact;
      return <ArtifactContent artifact={artifact} className={className} />;
    default:
      return <DisplayMarkdown className={className} md={content} />;
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

  const maxFileSize = 1048576; // 1MB
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
          <p className="mb-4">File is too large to preview</p>
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
      return <DisplayMarkdown className={className} md={artifactContent} />;
    }

    return (
      <div className="py-8 text-center text-gray-500">
        Loading file content...
      </div>
    );
  }
}
