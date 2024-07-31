import { getConfig } from "@flanksource-ui/api/services/configs";
import TextSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/TextSkeletonLoader";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export function CatalogResourceSource({
  source,
  showMinimal = false
}: {
  source: string;
  showMinimal?: boolean;
}) {
  const catalogId = source?.split("/")[1] || "";

  const { data: catalog, isLoading } = useQuery(
    ["catalog", catalogId],
    async () => {
      const res = await getConfig(catalogId);
      return res.data?.[0];
    },
    {
      enabled: catalogId !== ""
    }
  );

  if (isLoading) {
    return <TextSkeletonLoader />;
  }

  if (!catalog) {
    return null;
  }

  return (
    <div className="flex justify-end p-2">
      <Link
        to={{
          pathname: `/catalog/${catalog.id}`
        }}
        className="block text-blue-500"
      >
        {showMinimal ? "link" : <> Created by {catalog.name}</>}
      </Link>
    </div>
  );
}
