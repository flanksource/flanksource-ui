import { Link } from "react-router-dom";
import CRDSource from "./CRDSource";

type CanEditResourceProps = {
  source?: string;
  agentId?: string;
  agentName?: string;
  children: React.ReactNode;
  id: string;
  namespace: string;
  name: string;
};

export default function CanEditResource({
  source,
  agentId,
  agentName,
  children,
  ...props
}: CanEditResourceProps) {
  // if Agent isn't local, we can't edit it
  if (
    agentId !== "00000000-0000-0000-0000-000000000000" &&
    agentId !== undefined
  ) {
    return (
      <div className="flex flex-row gap-1 items-center">
        <span>Linked to </span>{" "}
        <Link
          to={`/settings/agents?id=${agentId}`}
          className="underline text-blue-500 cursor-pointer"
        >
          <span>{agentName}</span>
        </Link>
      </div>
    );
  }

  if (source !== "UI") {
    return <CRDSource source={source!} {...props} />;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
