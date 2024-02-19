import clsx from "clsx";
import { FaCopy } from "react-icons/fa";
import { useCopyToClipboard } from "../../components/Hooks/useCopyToClipboard";
import { Button } from "../Button";

type Props = {
  code: string;
  codeBlockClassName?: string;
};

export default function CodeBlock({
  code,
  codeBlockClassName = "whitespace-pre-wrap break-all"
}: Props) {
  const copyFn = useCopyToClipboard();

  return (
    <div className="flex flex-row w-full gap-4 relative">
      <code className="flex flex-col flex-1 text-sm text-left gap-2 bg-gray-800 text-white rounded-lg p-4 pl-6">
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