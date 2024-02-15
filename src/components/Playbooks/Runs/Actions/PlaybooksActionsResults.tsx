import Convert from "ansi-to-html";
import { PlaybookRunAction } from "../../../../api/types/playbooks";

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
  action: Pick<PlaybookRunAction, "result" | "error">;
  className?: string;
};

export default function PlaybooksRunActionsResults({
  action,
  className = "whitespace-pre-wrap break-all"
}: Props) {
  const { result, error } = action;

  if (!result && !error) {
    return <>No result</>;
  }

  if (action.error) {
    return <pre className={className}>{action.error}</pre>;
  }

  if (result?.stderr || result?.stdout || result?.logs) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <DisplayStdout className={className} stdout={result?.stdout} />
        <DisplayStderr className={className} stderr={result?.stderr} />
        <DisplayLogs className={className} logs={result?.logs} />
      </div>
    );
  }

  const json = JSON.stringify(result, null, 2);

  return <pre className={className}>{json}</pre>;
}
