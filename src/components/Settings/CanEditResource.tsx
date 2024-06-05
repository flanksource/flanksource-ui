import { Link } from "react-router-dom";
import { SchemaResourceType } from "../SchemaResourcePage/resourceTypes";
import CRDSource from "./CRDSource";
import { CatalogResourceSource } from "./CatalogResourceSource";
import ComponentResourceSource from "./ComponentResourceSource";

type CanEditResourceProps = {
  resourceType: SchemaResourceType["table"];
  source?: string;
  agentId?: string;
  agentName?: string;
  children: React.ReactNode;
  id: string;
  namespace: string;
  name: string;
};

export default function CanEditResource({
  resourceType,
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

  if (source?.startsWith("component")) {
    return <ComponentResourceSource source={source} />;
  }

  if (source?.startsWith("kubernetes")) {
    return <CatalogResourceSource source={source} />;
  }

  if (source === "ConfigFile") {
    return (
      <div className="flex justify-end p-2">
        <div className="flex flex-row gap-1 items-center">
          Linked to local file
        </div>
      </div>
    );
  }

  if (source && source !== "UI") {
    return <CRDSource source={source!} {...props} />;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
