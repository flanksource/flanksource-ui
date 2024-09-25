import { getConnectionByID } from "@flanksource-ui/api/services/connections";
import TextSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/TextSkeletonLoader";
import { useQuery } from "@tanstack/react-query";
import { Connection } from "./ConnectionFormModal";
import ConnectionIcon from "./ConnectionIcon";

type ConnectionLinkProps = {
  connection?: Pick<Connection, "name" | "type" | "id">;
  connectionId: string;
};

export default function ConnectionLink({
  connection,
  connectionId
}: ConnectionLinkProps) {
  const { isLoading, data } = useQuery({
    queryKey: ["connections", connectionId],
    queryFn: () => getConnectionByID(connectionId),
    enabled: connection === undefined && !!connectionId
  });

  if (isLoading) {
    return <TextSkeletonLoader />;
  }

  const connectionData = connection || data;

  if (!connectionData) {
    return null;
  }

  return <ConnectionIcon showLabel connection={connectionData} />;
}
