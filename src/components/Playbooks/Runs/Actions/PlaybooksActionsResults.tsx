import Convert from "ansi-to-html";
import { PlaybookRunAction } from "../../../../api/types/playbooks";

const convert = new Convert();

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

  if (result?.stdout) {
    return <pre className={className}>{result.stdout}</pre>;
  }

  if (result?.logs) {
    const html = convert.toHtml(result.logs);

    return (
      <pre className={className} dangerouslySetInnerHTML={{ __html: html }} />
    );
  }

  const json = JSON.stringify(result, null, 2);

  return <pre className={className}>{json}</pre>;
}
