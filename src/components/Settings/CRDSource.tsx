import { Link } from "react-router-dom";
import { Icon } from "../../ui/Icons/Icon";

type CRDSourceProps = {
  id?: string;
  namespace?: string;
  name?: string;
  source?: string;
  showMinimal?: boolean;
};

export default function CRDSource({
  id,
  name,
  namespace,
  source,
  showMinimal = false
}: CRDSourceProps) {
  if (
    source?.toLowerCase() !== "KubernetesCRD".toLowerCase() &&
    !source?.toLowerCase().startsWith("kubernetes")
  ) {
    return null;
  }

  return (
    <div className="flex flex-row items-center gap-1">
      {showMinimal ? (
        <Link
          to={`/catalog/${id}`}
          className="flex cursor-pointer flex-row items-center gap-1 text-blue-500 hover:underline"
        >
          <Icon name="k8s" />
          <span> CRD</span>
        </Link>
      ) : (
        <>
          <Icon name="k8s" />
          {name ? (
            <>
              <span> CRD linked to</span>{" "}
              <Link
                to={`/catalog/${id}`}
                className="cursor-pointer text-blue-500 underline"
              >
                <span>
                  {namespace ? <>{namespace}/</> : ""}
                  {name}
                </span>
              </Link>
            </>
          ) : (
            <Link
              to={`/catalog/${id}`}
              className="cursor-pointer text-blue-500 underline"
            >
              Linked to CRD
            </Link>
          )}
        </>
      )}
    </div>
  );
}
