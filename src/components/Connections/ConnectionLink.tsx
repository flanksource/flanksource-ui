import { getConnectionByID } from "@flanksource-ui/api/services/connections";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import TextSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/TextSkeletonLoader";
import { useQuery } from "@tanstack/react-query";
import { Connection } from "./ConnectionFormModal";

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

  return (
    <div className="flex flex-row items-center space-x-2">
      <Icon name={connectionData.type} className="h-auto w-6" />
      <div>{connectionData.name}</div>
    </div>
  );
}
