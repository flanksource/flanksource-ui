import Convert from "ansi-to-html";
import linkifyHtml from "linkify-html";
import Linkify from "linkify-react";
import { Opts } from "linkifyjs";
import { useMemo } from "react";
import {
  PlaybookRunAction,
  PlaybookSpec
} from "../../../../api/types/playbooks";
import PlaybookResultsDropdownButton from "./PlaybookResultsDropdownButton";

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

  if (!result && !error) {
    return <>No result</>;
  }

  return (
    <div className="relative flex h-full w-full flex-col">
      {action.error && <pre className={className}>{action.error}</pre>}
      {result?.stderr || result?.stdout || result?.logs ? (
        <div className={`flex flex-col gap-2 ${className}`}>
          <DisplayStdout className={className} stdout={result?.stdout} />
          <DisplayStderr className={className} stderr={result?.stderr} />
          <DisplayLogs className={className} logs={result?.logs} />
        </div>
      ) : (
        <pre className={className}>
          <Linkify as="p" options={options}>
            {JSON.stringify(result, null, 2)}
          </Linkify>
        </pre>
      )}

      <PlaybookResultsDropdownButton action={action} playbook={playbook} />
    </div>
  );
}
