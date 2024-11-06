import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { Link } from "react-router-dom";

type CanaryLinkProps = {
  canary: {
    id: string;
    name: string;
    icon?: string;
  };
};

export default function CanaryLink({ canary }: CanaryLinkProps) {
  return (
    <Link
      className="flex flex-row items-center gap-1"
      to={{
        pathname: `/settings/canaries/${canary.id}`
      }}
    >
      {canary.icon && <Icon name={canary.icon} className="h-5" />}
      <span>{canary.name}</span>
    </Link>
  );
}
