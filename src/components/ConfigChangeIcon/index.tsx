import { BsInfoCircle } from "react-icons/bs";
import { GoDiff } from "react-icons/go";

type Props = {
  changeType: string;
  className?: string;
};

export default function ConfigChangeIcon({
  changeType,
  className = "inline + mr-2"
}: Props) {
  if (changeType === "diff") {
    return <GoDiff className={"text-gray-600 " + className} size="20" />;
  }
  return <BsInfoCircle className={className} size="20" />;
}
