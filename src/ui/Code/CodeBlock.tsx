import clsx from "clsx";
import { FaCopy } from "react-icons/fa";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { Button } from "../Buttons/Button";

type Props = {
  code: string;
  codeBlockClassName?: string;
  className?: string;
};

export default function CodeBlock({
  code,
  codeBlockClassName = "whitespace-pre-wrap break-all",
  className = "flex flex-col flex-1 text-sm text-left gap-2 bg-gray-800 text-white rounded-lg p-4 pl-6"
}: Props) {
  const copyFn = useCopyToClipboard();

  return (
    <div className="flex flex-row w-full gap-4 relative">
      <code className={className}>
        <pre className={codeBlockClassName}>{code}</pre>
      </code>
      <Button
        icon={<FaCopy />}
        title="Copy to clipboard"
        className={clsx(
          "bg-white  absolute right-4 top-4 whitespace-pre-line",
          "text-black"
        )}
        onClick={() => {
          copyFn(`${code}`);
        }}
      />
    </div>
  );
}
