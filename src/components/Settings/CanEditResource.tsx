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
  id?: string;
  namespace?: string;
  name?: string;
  // do not render alternate content, if crd
  hideSourceLink?: boolean;
};

export function CanEditResourceInner({
  resourceType,
  source,
  agentId,
  agentName,
  children,
  hideSourceLink = false,
  ...props
}: CanEditResourceProps) {
  // if Agent isn't local, we can't edit it
  if (
    agentId !== "00000000-0000-0000-0000-000000000000" &&
    agentId !== undefined
  ) {
    if (hideSourceLink) {
      return null;
    }

    return (
      <div className="flex flex-row items-center gap-1">
        <span>Linked to </span>{" "}
        <Link
          to={`/settings/agents?id=${agentId}`}
          className="cursor-pointer text-blue-500 underline"
        >
          <span>{agentName}</span>
        </Link>
      </div>
    );
  }

  if (source?.startsWith("component")) {
    if (hideSourceLink) {
      return null;
    }
    return <ComponentResourceSource source={source} />;
  }

  if (source?.startsWith("kubernetes")) {
    if (hideSourceLink) {
      return null;
    }
    return <CatalogResourceSource source={source} />;
  }

  if (source === "ConfigFile") {
    if (hideSourceLink) {
      return null;
    }
    return (
      <div className="flex justify-end p-2">
        <div className="flex flex-row items-center gap-1">
          Linked to local file
        </div>
      </div>
    );
  }

  if (source && source !== "UI") {
    return (
      <CRDSource source={source!} hideSourceLink={hideSourceLink} {...props} />
    );
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}

export default function CanEditResource({
  extraButtons,
  className = "flex flex-1 flex-row justify-end gap-2",
  ...props
}: CanEditResourceProps & {
  className?: string;
  extraButtons?: React.ReactNode;
}) {
  return (
    <div className={className}>
      {extraButtons && <div className="flex-1">{extraButtons}</div>}
      <CanEditResourceInner {...props} />
    </div>
  );
}
