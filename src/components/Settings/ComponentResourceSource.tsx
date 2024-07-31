import { getTopologyNameByID } from "@flanksource-ui/api/services/topology";
import TextSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/TextSkeletonLoader";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

type ComponentResourceSourceProps = {
  source: string;
  showMinimal?: boolean;
};

export default function ComponentResourceSource({
  source,
  showMinimal = false
}: ComponentResourceSourceProps) {
  const componentID = source?.split("/")[1] || "";

  const { data: component, isLoading } = useQuery(
    ["topology", "component", componentID],
    async () => {
      const res = await getTopologyNameByID(componentID);
      return res.data?.[0];
    },
    {
      enabled: !!componentID
    }
  );

  if (isLoading) {
    return <TextSkeletonLoader />;
  }

  if (!component) {
    return null;
  }

  return (
    <div className="flex justify-end p-2">
      <Link
        to={{
          pathname: `/topology/${component.id}`
        }}
        className="block text-blue-500"
      >
        {showMinimal ? "link" : <> Created by {component.name}</>}
      </Link>
    </div>
  );
}
