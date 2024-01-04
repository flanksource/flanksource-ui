import Convert from "ansi-to-html";
import { PlaybookRunAction } from "../../../../api/types/playbooks";

const convert = new Convert();

function DisplayStdout({ stdout }: { stdout?: string }) {
  if (!stdout) {
    return null;
  }
  const html = convert.toHtml(stdout);
  return <pre dangerouslySetInnerHTML={{ __html: html }} />;
}

function DisplayStderr({ stderr }: { stderr?: string }) {
  if (!stderr) {
    return null;
  }
  const html = convert.toHtml(stderr);
  return (
    <pre className="text-red-500" dangerouslySetInnerHTML={{ __html: html }} />
  );
}

function DisplayLogs({ logs }: { logs?: string }) {
  if (!logs) {
    return null;
  }
  const html = convert.toHtml(logs);
  return <pre dangerouslySetInnerHTML={{ __html: html }} />;
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
        <DisplayStdout stdout={result?.stdout} />
        <DisplayStderr stderr={result?.stderr} />
        <DisplayLogs logs={result?.logs} />
      </div>
    );
  }

  const json = JSON.stringify(result, null, 2);

  return <pre className={className}>{json}</pre>;
}
