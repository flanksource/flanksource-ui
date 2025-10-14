import { FaRegCopy } from "react-icons/fa";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { Button } from "../../ui/Buttons/Button";
import { getConnectionURL } from "./utils";

type CopyConnectionURLButtonProps = {
  namespace?: string | null;
  name: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export function CopyConnectionURLButton({
  namespace,
  name,
  onClick
}: CopyConnectionURLButtonProps) {
  const copyToClipboard = useCopyToClipboard("Connection URL copied!");
  const connectionURL = getConnectionURL({ namespace, name });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    copyToClipboard(connectionURL);
  };

  return (
    <Button
      icon={<FaRegCopy />}
      title="Copy connection URL"
      className="border-0 bg-transparent text-gray-500 hover:bg-gray-100"
      size="xs"
      onClick={handleClick}
    />
  );
}
