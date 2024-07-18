import { Link } from "react-router-dom";
import { Icon } from "../../ui/Icons/Icon";

type CRDSourceProps = {
  id: string;
  namespace: string;
  name: string;
  source?: string;
};

export default function CRDSource({
  id,
  name,
  namespace,
  source
}: CRDSourceProps) {
  if (!source || source === "UI") {
    return null;
  }

  return (
    <div className="flex flex-row items-center gap-1">
      <Icon name="k8s" />
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
    </div>
  );
}
