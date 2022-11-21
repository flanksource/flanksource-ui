import { Link } from "react-router-dom";
import { Icon } from "../Icon";

type ConfigLinkProps = {
  configId: string;
  configName: string;
  configType: string;
  configTypeSecondary?: string;
};

export default function ConfigLink({
  configId,
  configName,
  configType,
  configTypeSecondary
}: ConfigLinkProps) {
  return (
    <Link
      to={{
        pathname: `/configs/${configId}`
      }}
    >
      <Icon
        name={configType}
        secondary={configTypeSecondary}
        size="lg"
        className="w-5 mr-1"
      />
      {configName}
    </Link>
  );
}
