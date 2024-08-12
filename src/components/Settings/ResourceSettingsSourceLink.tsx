import { Link } from "react-router-dom";
import CRDSource from "./CRDSource";
import { CatalogResourceSource } from "./CatalogResourceSource";
import ComponentResourceSource from "./ComponentResourceSource";

type ResourceSettingsSourceLinkProps = {
  source?: string;
  agentId?: string;
  agentName?: string;
  id: string;
  namespace: string;
  name: string;
  showMinimal?: boolean;
};

export default function ResourceSettingsSourceLink({
  source,
  agentId,
  agentName,
  showMinimal,
  ...props
}: ResourceSettingsSourceLinkProps) {
  // if Agent isn't local, we can't edit it
  if (
    agentId !== "00000000-0000-0000-0000-000000000000" &&
    agentId !== undefined
  ) {
    return (
      <div className="flex flex-row items-center gap-1">
        {showMinimal ? (
          <Link
            to={`/settings/agents?id=${agentId}`}
            className="cursor-pointer text-blue-500 underline"
          >
            <span>link</span>
          </Link>
        ) : (
          <>
            <span>Linked to </span>{" "}
            <Link
              to={`/settings/agents?id=${agentId}`}
              className="cursor-pointer text-blue-500 underline"
            >
              <span>{agentName}</span>
            </Link>
          </>
        )}
      </div>
    );
  }

  if (source?.toLowerCase() === "push") {
    return null;
  }

  if (source?.startsWith("component")) {
    return (
      <ComponentResourceSource source={source} showMinimal={showMinimal} />
    );
  }

  if (source?.startsWith("kubernetes")) {
    return <CatalogResourceSource source={source} showMinimal={showMinimal} />;
  }

  if (source === "ConfigFile") {
    return (
      <div className="flex justify-end p-2">
        <div className="flex flex-row items-center gap-1">
          Linked to local file
        </div>
      </div>
    );
  }

  if (source && source !== "UI") {
    return <CRDSource source={source!} {...props} showMinimal={showMinimal} />;
  }

  return null;
}
