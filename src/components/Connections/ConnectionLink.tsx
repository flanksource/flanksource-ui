import {
  getConnectionByID,
  getConnectionByNamespaceName
} from "@flanksource-ui/api/services/connections";
import TextSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/TextSkeletonLoader";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Connection } from "./ConnectionFormModal";
import ConnectionIcon from "./ConnectionIcon";

type ConnectionLinkProps = {
  connection?: Pick<Connection, "name" | "type" | "id">;
  connectionId?: string;
  connectionName?: string;
  connectionNamespace?: string;
};

export default function ConnectionLink({
  connection,
  connectionId,
  connectionName,
  connectionNamespace
}: ConnectionLinkProps) {
  const { isLoading, data } = useQuery({
    queryKey: [
      "connections",
      connectionId,
      connectionName,
      connectionNamespace
    ],
    queryFn: () => {
      if (connectionId) {
        return getConnectionByID(connectionId);
      }

      if (connectionName) {
        return getConnectionByNamespaceName(
          connectionName,
          connectionNamespace
        );
      }

      return Promise.resolve(null);
    },
    enabled: connection === undefined && (!!connectionId || !!connectionName)
  });

  if (isLoading) {
    return <TextSkeletonLoader />;
  }

  const connectionData = connection || data;

  if (!connectionData) {
    return null;
  }

  if (!connectionData.id) {
    return <ConnectionIcon showLabel connection={connectionData} />;
  }

  return (
    <Link
      className="link inline-flex items-center"
      to={`/settings/connections?id=${connectionData.id}`}
    >
      <ConnectionIcon showLabel connection={connectionData} />
    </Link>
  );
}
