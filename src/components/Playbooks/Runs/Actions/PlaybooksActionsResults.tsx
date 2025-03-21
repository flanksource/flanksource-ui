import Convert from "ansi-to-html";
import linkifyHtml from "linkify-html";
import Linkify from "linkify-react";
import markdownit from "markdown-it";
import { Opts } from "linkifyjs";
import { useMemo, useState } from "react";
import {
  PlaybookRunAction,
  PlaybookSpec
} from "../../../../api/types/playbooks";
import PlaybookResultsDropdownButton from "./PlaybookResultsDropdownButton";
import { Tab, Tabs } from "../../../../ui/Tabs/Tabs";

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

function DisplayMarkdown({
  md,
  className
}: {
  md?: string;
  className?: string;
}) {
  const html = useMemo(() => {
    if (!md) {
      return null;
    }

    const renderer = markdownit({
      html: true,
      linkify: true
    });
    return renderer.render(md);
  }, [md]);

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
    "result" | "error" | "id" | "playbook_run_id" | "start_time"
  >;
  className?: string;
  playbook: Pick<PlaybookSpec, "name">;
};

export default function PlaybooksRunActionsResults({
  action,
  className = "whitespace-pre-wrap break-all",
  playbook
}: Props) {
  const { result, error } = action;
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const availableTabs = useMemo(() => {
    if (!result) return [];

    const tabs = Object.keys(result)
      .filter((key) => result[key])
      .map((key) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: key,
        hasContent: !!result[key]
      }));

    const priorityOrder: Record<string, number> = {
      stdout: 0, // always the first tab (if present)
      stderr: 1
    };

    tabs.sort((a, b) => {
      const priorityA = priorityOrder[a.value.toLowerCase()] ?? 999;
      const priorityB = priorityOrder[b.value.toLowerCase()] ?? 999;
      return priorityA - priorityB;
    });

    return tabs;
  }, [result]);

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
        contentClassName="flex-1 overflow-y-auto border border-t-0 border-gray-300 p-4"
      >
        {availableTabs.map((tab) => {
          const label = tab.label === "Args" ? "Script" : tab.label;
          return (
            <Tab key={tab.value} label={label} value={tab.value}>
              {renderTabContent(tab.value, result?.[tab.value], className)}
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
    default:
      return <DisplayMarkdown className={className} md={content} />;
  }
}
