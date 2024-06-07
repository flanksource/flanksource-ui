import { Diff, Hunk, parseDiff } from "react-diff-view";

import "react-diff-view/style/index.css";

type DiffRendererProps = React.HTMLProps<HTMLDivElement> & {
  diffText: string;
};

export function DiffRenderer({
  diffText,
  className,
  ...props
}: DiffRendererProps) {
  const files = parseDiff(diffText);

  const renderFile = ({ oldRevision, newRevision, type, hunks }: any) => (
    <Diff
      key={oldRevision + "-" + newRevision}
      viewType="unified"
      diffType={type}
      hunks={hunks}
    >
      {(hunks) => hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)}
    </Diff>
  );

  return (
    <div className={className} {...props}>
      {files.map(renderFile)}
    </div>
  );
}
