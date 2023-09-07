import { PlaybookRunAction } from "./PlaybookRunsSidePanel";

type Props = {
  action: Pick<PlaybookRunAction, "result">;
};

export default function PlaybooksRunActionsResults({ action }: Props) {
  const { result } = action;

  if (!result) {
    return <>No result</>;
  }

  if (result.stdout) {
    return <pre>{result.stdout}</pre>;
  }

  const json = JSON.stringify(result, null, 2);

  return <pre className="overflow-auto">{json}</pre>;
}
