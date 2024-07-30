import Convert from "ansi-to-html";
import {
  PlaybookRunAction,
  PlaybookSpec
} from "../../../../api/types/playbooks";
import PlaybookResultsDropdownButton from "./PlaybookResultsDropdownButton";

const convert = new Convert();

function DisplayStdout({
  stdout,
  className
}: {
  stdout?: string;
  className?: string;
}) {
  if (!stdout) {
    return null;
  }
  const html = convert.toHtml(stdout);
  return (
    <pre className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

function DisplayStderr({
  stderr,
  className
}: {
  stderr?: string;
  className?: string;
}) {
  if (!stderr) {
    return null;
  }
  const html = convert.toHtml(stderr);
  return (
    <pre
      className={`text-red-500 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
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
  if (!logs) {
    return null;
  }
  const html = convert.toHtml(logs);
  return (
    <pre className={className} dangerouslySetInnerHTML={{ __html: html }} />
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
        <pre className={className}>{JSON.stringify(result, null, 2)}</pre>
      )}

      <PlaybookResultsDropdownButton action={action} playbook={playbook} />
    </div>
  );
}
